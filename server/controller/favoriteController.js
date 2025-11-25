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
};

export default FavoriteController;
