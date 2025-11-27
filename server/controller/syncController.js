import db from '../models/models.js';

const SyncController = {
    SyncOfflineConnection: async (req, res) => {
        const actions = req.body;

        if (!Array.isArray(actions)) {
            return res.status(400).json({ error: 'Expected an array of actions' });
        }

        const results = [];

        for (const [index, action] of actions.entries()) {
            const result = { index, action: action?.action || null };

            try {
                if (!action || !action.action) {
                    result.error = 'Missing action property';
                    results.push(result);
                    continue;
                }

                switch (action.action) {
                    case 'add_favorite': {
                        const { userId, locationId } = action;
                        if (!userId || !locationId) {
                            result.error = 'userId and locationId are required';
                            break;
                        }

                        // use a transaction per action to isolate failures
                        const op = await db.sequelize.transaction(async (t) => {
                            const user = await db.Users.findByPk(userId, { transaction: t });
                            if (!user) throw new Error('Usuário não encontrado');

                            const location = await db.Locations.findByPk(locationId, { transaction: t });
                            if (!location) throw new Error('Localização não encontrada');

                            const [record, created] = await db.FavoriteLocations.findOrCreate({
                                where: { userId, locationId },
                                defaults: { userId, locationId },
                                transaction: t
                            });

                            return { record: record.toJSON(), created };
                        });

                        result.ok = true;
                        result.detail = op;
                        break;
                    }

                    case 'remove_favorite': {
                        const { userId, locationId } = action;
                        if (!userId || !locationId) {
                            result.error = 'userId and locationId are required';
                            break;
                        }

                        try {
                            const op = await db.sequelize.transaction(async (t) => {
                                const fav = await db.FavoriteLocations.findOne({ where: { userId, locationId }, transaction: t });
                                if (!fav) return { deleted: false };
                                await fav.destroy({ transaction: t });
                                return { deleted: true };
                            });

                            result.ok = true;
                            result.detail = op;
                        } catch (err) {
                            result.error = err.message || String(err);
                        }

                        break;
                    }

                    default: {
                        result.error = `Unknown action: ${action.action}`;
                        break;
                    }
                }
            } catch (err) {
                result.error = err.message || String(err);
            }

            results.push(result);
        }

        return res.status(200).json({ results });
    }
};

export default SyncController;
