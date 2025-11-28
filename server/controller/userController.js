import db from '../models/models.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const UserController = {
    getUsers: async (req, res) => {
        try {
            const users = await db.Users.findAll();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await db.Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const pHashed = await bcryptjs.hash(password, 10);
            const user = await db.Users.create({ name, email, password:pHashed });
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: 'Erro ao criar usuário.', details: err.errors });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await db.Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
            const pHashed = await bcryptjs.hash(password, 10);
            await user.update({ name, email, password: pHashed });
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ error: 'Erro ao atualizar usuário.', details: err.errors });
        }
    },

    removeUser: async (req, res) => {
        try {
            const user = await db.Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
            await db.FavoriteLocations.destroy({ where: { userId: user.id } });
            await user.destroy();
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: 'Erro ao remover usuário.' });
        }
    },

    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await db.Users.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "E-mail não encontrado." });
            }

            const expires = Date.now() + 3600000;
            const encodedEmail = encodeURIComponent(
                Buffer.from(email).toString("base64")
            );
            const passwordResetLink = `http://localhost:8081/forgot_password_step2/${encodedEmail}/${expires}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Tours - Redefinição de Senha",
                html: `
                    <p>Olá, ${user.name || "Usuário"},</p>
                    <p>Você solicitou a redefinição de sua senha no Tours. Clique no link abaixo para criar uma nova senha. Este link é válido por 1 hora:</p>
                    <p><a href="${passwordResetLink}">Redefinir Senha</a></p>
                    <p>Se você não solicitou essa alteração, por favor, ignore este e-mail.</p>
                    <p>Atenciosamente,<br>Equipe Tours</p>
                `,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "E-mail de recuperação enviado com sucesso!" });
        } catch (error) {
            console.error("Erro no forgotPassword:", error);
            return res.status(500).json({ message: "Erro ao solicitar recuperação de senha!" });
        }
    },

    async resetPassword(req, res) {
        try {
            const { encodedEmail, expires, password } = req.body;
            if (!encodedEmail) {
                return res.status(400).json({ error: "E-mail não fornecido na URL." });
            }
            const email = Buffer.from(encodedEmail, "base64").toString("utf-8");
            if (!email) {
                return res.status(400).json({ error: "E-mail inválido." });
            }

            if (Date.now() > parseInt(expires)) {
                return res.status(400).json({ error: "Link de redefinição expirado." });
            }

            if (!password) {
                return res.status(400).json({ error: "Nova senha é obrigatória." });
            }
            const user = await db.Users.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            const saltRounds = 10;
            const hashedPassword = await bcryptjs.hash(password, saltRounds);

            await user.update({ password: hashedPassword });

            return res.status(200).json({ message: "Senha atualizada com sucesso!" });
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    },
};

export default UserController;