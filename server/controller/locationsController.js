import db from '../models/index.js'

const LocationController = {
    getLocations: async (req, res) => {
        try {
            const locations = await db.locations.findAll({
                attributes: ['id', 'name', 'address', 'photo', 'qrCode']
            });
            if (locations.length === 0) {
                return res.status(404).json({ error: 'Nenhuma localização encontrada.' });
            }
            return res.status(200).json(locations);
        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro ao carregar as localizações.', details: error.message });
        }
    },

    getLocationsWithComponents: async (req, res) => {
        try {
            const locations = await db.locations.findAll({
                include: [
                    { model: db.attractions, as: 'attractions', attributes: ['id', 'name', 'timeExposition', 'hasLimit', 'limitPeople'] },
                    { model: db.views, as: 'views', attributes: ['id', 'name', 'contentType', 'content'] }
                ]
            });
            if (locations.length === 0) {
                return res.status(404).json({ error: 'Nenhuma localização encontrada.' });
            }
            return res.status(200).json(locations);
        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro ao carregar as localizações.', details: error.message });
        }
    },

    getLocationsWithComponentsById: async (req, res) => {
        try {
            const { id } = req.params;
            const locations = await db.locations.findByPk(id, {
                include: [
                    { model: db.attractions, as: 'attractions', attributes: ['id', 'name', 'timeExposition', 'hasLimit', 'limitPeople'] },
                    { model: db.views, as: 'views', attributes: ['id', 'name', 'contentType', 'content'] }
                ]
            });
            if (locations.length === 0) {
                return res.status(404).json({ error: 'Nenhuma localização encontrada.' });
            }
            return res.status(200).json(locations);
        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro ao carregar as localizações.', details: error.message });
        }
    },

    // create before
    createLocation: async (req, res) => {
        try {
            const { name, address, photo, qrCode, attractions, views } = req.body;
            if (name == null || address == null || photo == null || qrCode == null || attractions == null || views == null) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
            }
        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro ao criar a localização.', details: error.message });
        }
    }

}

export default LocationController;