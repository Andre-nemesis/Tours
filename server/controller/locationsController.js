import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { DataTypes } from 'sequelize';
import db from '../models/models.js';

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
            const locations = await db.Locations.findAll({
                attributes: ['id', 'name', 'address', 'photo', 'qrCode']
            });
            if (locations.length === 0) {
                return res.status(404).json({ error: 'Nenhuma localização encontrada.' });
            }
            return res.status(200).json(locations);
        } catch (error) {
            return res.status(500).json({ err: 'Ocorreu um erro ao carregar as localizações.', details: error.message, stack: error.stack });
        }
    },

    getLocationsWithComponents: async (req, res) => {
        try {
            const locations = await db.Locations.findAll({
                include: [
                    { model: db.Attractions, as: 'attractions', attributes: ['id', 'name', 'timeExposition', 'hasLimit', 'limitPeople'] },
                    { model: db.Views, as: 'views', attributes: ['id', 'name', 'contentType', 'content'] }
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
            const location = await db.Locations.findByPk(id, {
                include: [
                    { model: db.Attractions, as: 'attractions', attributes: ['id', 'name', 'timeExposition', 'hasLimit', 'limitPeople'] },
                    { model: db.Views, as: 'views', attributes: ['id', 'name', 'contentType', 'content'] }
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
                return res.status(400).json({
                    error: 'Todos os campos são obrigatórios e attractions/views devem ser arrays'
                });
            }

            const sanitizedName = sanitizeName(name);
            const baseDir = path.join('archives', sanitizedName);
            const dirs = {
                image: path.join(baseDir, 'image'),
                audio: path.join(baseDir, 'audio'),
                video: path.join(baseDir, 'video'),
                qrcode: path.join(baseDir, 'qrcode'), 
            };

            await Promise.all([
                mkdir(dirs.image, { recursive: true }),
                mkdir(dirs.audio, { recursive: true }),
                mkdir(dirs.video, { recursive: true }),
                mkdir(dirs.qrcode, { recursive: true }),
            ]);

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
                    photoPath = photo; 
                }
            }

            const location = await db.Locations.create(
                {
                    name,
                    address,
                    photo: photoPath || '',
                    qrCode: '' 
                },
                { transaction: t }
            );

            const PUBLIC_URL = process.env.APP_URL || 'http://localhost:3001';
            const locationUrl = `${PUBLIC_URL}/locations/${location.id}`;

            const qrFileName = `qrcode-${location.id}.png`;
            const qrFilePath = path.join(dirs.qrcode, qrFileName);

            await QRCode.toFile(
                qrFilePath,
                locationUrl,
                {
                    width: 512,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }
            );

            const qrCodePath = qrFilePath.replace(/\\/g, '/');

            await location.update({ qrCode: qrCodePath }, { transaction: t });

            const savedViews = [];
            for (const v of views) {
                if (!v?.type) continue;
                const type = v.type.toLowerCase();
                const targetDir = dirs[type];
                if (!targetDir) continue;

                let ext = path.extname(v.filename || '') || mimeToExt(v.mime) ||
                    (type === 'image' ? '.jpg' : type === 'audio' ? '.mp3' : '.mp4');

                if (ext && !extAllowed(type, ext)) continue;

                const finalFilename = `${DataTypes.UUIDV4()}${ext}`;
                const filePath = path.join(targetDir, finalFilename);

                if (v.base64) {
                    await writeFile(filePath, Buffer.from(stripBase64(v.base64), 'base64'));
                }

                const contentValue = v.base64 ? filePath.replace(/\\/g, '/') : (v.url || v.path || '');

                const viewRecord = await db.Views.create({
                    name: v.name || finalFilename,
                    contentType: ext,
                    content: contentValue,
                    locationId: location.id
                }, { transaction: t });

                savedViews.push(viewRecord);
            }

            const savedAttractions = [];
            for (const a of attractions) {
                if (!a?.name) continue;
                const attractionRecord = await db.Attractions.create({
                    name: a.name,
                    timeExposition: a.timeExposition || '00:00:00',
                    hasLimit: !!a.hasLimit,
                    limitPeople: a.limitPeople || 0,
                    locationId: location.id
                }, { transaction: t });
                savedAttractions.push(attractionRecord);
            }

            await t.commit();

            return res.status(201).json({
                location: {
                    ...location.toJSON(),
                    qrCode: qrCodePath 
                },
                viewsSaved: savedViews.length,
                attractionsSaved: savedAttractions.length,
                qrCodeUrl: `${PUBLIC_URL}/archives/${sanitizedName}/qrcode/${qrFileName}` // URL pública do QR
            });

        } catch (error) {
            await t.rollback();
            console.error('Erro ao criar localização:', error);
            return res.status(500).json({
                error: 'Ocorreu um erro ao criar a localização.',
                details: error.message
            });
        }
    }

}

export default LocationController;