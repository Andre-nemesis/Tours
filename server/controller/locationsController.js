import db from '../models/index.js'
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { DataTypes } from 'sequelize';

const ALLOWED = {
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
    audio: ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
    video: ['.mp4', '.mov', '.webm', '.mkv'],
};

function extAllowed(type, ext) {
    return ALLOWED[type] && ALLOWED[type].includes(ext.toLowerCase());
}

function stripBase64(s) {
  const idx = s.indexOf('base64,');
  return idx >= 0 ? s.slice(idx + 7) : s;
}

function isBase64(s) {
  return typeof s === 'string' && (s.startsWith('data:') || /^[A-Za-z0-9+/=]+\s*$/.test(s.slice(0, 100)));
}

function mimeToExt(mime) {
  if (!mime) return null;
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'video/mp4': '.mp4',
  };
  return map[mime] || null;
}

function sanitizeName(name) {
  return name.replace(/[^a-z0-9-_]/gi, '_');
}

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
            const location = await db.locations.findByPk(id, {
                include: [
                    { model: db.attractions, as: 'attractions', attributes: ['id', 'name', 'timeExposition', 'hasLimit', 'limitPeople'] },
                    { model: db.views, as: 'views', attributes: ['id', 'name', 'contentType', 'content'] }
                ]
            });
            if (!location) {
                return res.status(404).json({ error: 'Localização não encontrada.' });
            }
            return res.status(200).json(location);
        } catch (error) {
            return res.status(500).json({ error: 'Ocorreu um erro ao carregar a localização.', details: error.message });
        }
    },

    createLocation: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { name, address, photo, attractions, views } = req.body;
            if (!name || !address || !photo || !Array.isArray(attractions) || !Array.isArray(views)) {
                await t.rollback();
                return res.status(400).json({ error: 'Todos os campos são obrigatórios e arrays devem ser usados para attractions e views' });
            }

            const baseDir = path.join('archives', sanitizeName(name));
            const dirs = {
                image: path.join(baseDir, 'image'),
                audio: path.join(baseDir, 'audio'),
                video: path.join(baseDir, 'video'),
            };

            // cria diretórios
            await mkdir(dirs.image, { recursive: true });
            await mkdir(dirs.audio, { recursive: true });
            await mkdir(dirs.video, { recursive: true });

            // salva foto principal (aceita { filename, base64 } ou url/string => salva se base64)
            let photoPath = null;
            if (typeof photo === 'object' && photo.base64 && photo.filename) {
                const ext = path.extname(photo.filename) || '.jpg';
                const filename = `${DataTypes.UUIDV4()}${ext}`;
                photoPath = path.join(dirs.image, filename);
                await writeFile(photoPath, Buffer.from(stripBase64(photo.base64), 'base64'));
                photoPath = photoPath.replace(/\\/g, '/');
            } else if (typeof photo === 'string') {
                if (isBase64(photo)) {
                    const filename = `${DataTypes.UUIDV4()}.jpg`;
                    photoPath = path.join(dirs.image, filename);
                    await writeFile(photoPath, Buffer.from(stripBase64(photo), 'base64'));
                    photoPath = photoPath.replace(/\\/g, '/');
                } else {
                    photoPath = photo; // url ou caminho já existente
                }
            }

            // cria localização (note: address no model é JSON)
            const location = await db.locations.create(
                { name, address, photo: photoPath || '', qrCode: '' },
                { transaction: t }
            );

            const savedViews = [];
            // processa views: cada item deve conter { name, type: 'image'|'audio'|'video', filename, base64, url, mime }
            for (const v of views) {
                if (!v || !v.type) continue;
                const type = v.type.toLowerCase();
                const targetDir = dirs[type];
                if (!targetDir) continue;

                let originalFilename = v.filename || v.name || `${DataTypes.UUIDV4()}`;
                let ext = path.extname(originalFilename);
                if (!ext && v.mime) ext = mimeToExt(v.mime) || '';
                if (!ext && v.base64) ext = (type === 'image' ? '.jpg' : (type === 'audio' ? '.mp3' : '.mp4'));

                if (ext && !extAllowed(type, ext)) {
                    // se extensão não permitida, pula
                    continue;
                }

                const finalFilename = `${DataTypes.UUIDV4()}${ext}`;
                const filePath = path.join(targetDir, finalFilename);

                if (v.base64) {
                    await writeFile(filePath, Buffer.from(stripBase64(v.base64), 'base64'));
                } else if (v.url && typeof v.url === 'string') {
                    // não faz download aqui — grava a url no campo content
                } else if (v.path) {
                    // poderia copiar, mas aqui gravamos path como content
                } else {
                    // sem conteúdo, pular
                    continue;
                }

                const contentValue = v.base64 ? filePath.replace(/\\/g, '/') : (v.url || v.path || filePath.replace(/\\/g, '/'));
                const contentType = ext || mimeToExt(v.mime) || '';

                const viewRecord = await db.views.create(
                    {
                        name: v.name || finalFilename,
                        contentType: contentType,
                        content: contentValue,
                        locationId: location.id
                    },
                    { transaction: t }
                );

                savedViews.push(viewRecord);
            }

            const savedAttractions = [];
            // processa atrações: cada item { name, timeExposition, hasLimit, limitPeople, ... }
            for (const a of attractions) {
                if (!a || !a.name) continue;
                const attractionRecord = await db.attractions.create(
                    {
                        name: a.name,
                        timeExposition: a.timeExposition || '00:00:00',
                        hasLimit: !!a.hasLimit,
                        limitPeople: a.limitPeople || 0,
                        locationId: location.id
                    },
                    { transaction: t }
                );
                savedAttractions.push(attractionRecord);
            }

            await t.commit();
            return res.status(201).json({
                location,
                viewsSaved: savedViews.length,
                attractionsSaved: savedAttractions.length,
            });
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Ocorreu um erro ao criar a localização.', details: error.message });
        }
    }

}

export default LocationController;