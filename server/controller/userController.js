'use strict';
import db from '../models/index.js';

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
            const user = await db.Users.create({ name, email, password });
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
            await user.update({ name, email, password });
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ error: 'Erro ao atualizar usuário.', details: err.errors });
        }
    },

    removeUser: async (req, res) => {
        try {
            const user = await db.Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
            await user.destroy();
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: 'Erro ao remover usuário.' });
        }
    }
};

export default UserController;