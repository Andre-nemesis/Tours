'use strict';
import db from '../models/models.js';

const FavoriteController = {
    addFavorite: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { userId, locationId } = req.body;

            if (!userId || !locationId) {
                await t.rollback();
                return res.status(400).json({ error: 'userId and locationId are required' });
            }

            const user = await db.Users.findByPk(userId);
            if (!user) {
                await t.rollback();
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const location = await db.Locations.findByPk(locationId);
            if (!location) {
                await t.rollback();
                return res.status(404).json({ error: 'Localização não encontrada' });
            }

            const result = await db.FavoriteLocations.favoritePlace(userId, locationId);

            await t.commit();

            if (result.created) {
                return res.status(201).json({ message: 'Local adicionado aos favoritos', favorite: result.record });
            }

            return res.status(200).json({ message: 'Local já estava nos favoritos', favorite: result.record });

        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Erro ao adicionar favorito', details: error.message });
        }
    }
,

    removeFavorite: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { userId, locationId } = req.body;

            if (!userId || !locationId) {
                await t.rollback();
                return res.status(400).json({ error: 'userId and locationId are required' });
            }

            const fav = await db.FavoriteLocations.findOne({ where: { userId, locationId }, transaction: t });
            if (!fav) {
                await t.rollback();
                return res.status(404).json({ error: 'Favorito não encontrado' });
            }

            await fav.destroy({ transaction: t });
            await t.commit();

            return res.status(200).json({ message: 'Favorito removido' });
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Erro ao remover favorito', details: error.message });
        }
    },

    getFavoritesByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) return res.status(400).json({ error: 'userId is required' });

            const favorites = await db.FavoriteLocations.findAll({
                where: { userId },
                include: [{ model: db.Locations, as: 'location', attributes: ['id', 'name', 'address', 'photo', 'qrCode'] }]
            });

            const result = favorites.map(f => ({
                id: f.id,
                createdAt: f.createdAt,
                updatedAt: f.updatedAt,
                location: f.location || null
            }));

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar favoritos', details: error.message });
        }
    }
};

export default FavoriteController;
