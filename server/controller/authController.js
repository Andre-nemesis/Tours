import db from '../models/models.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email inválido.' });
        }

        const user = await db.Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Email não cadastrado." });
        }


        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name,},
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({ success: 1, token });

    } catch (error) {
        res.status(500).json({
            message: 'Erro ao fazer login',
            details: error.message,
            stack: error.stack
        });
    }
};