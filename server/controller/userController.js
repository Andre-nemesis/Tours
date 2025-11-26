import db from '../models/models.js';
import bcryptjs from 'bcryptjs';

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
    }
};

export default UserController;