'use strict';

const path = require('path');
const { mkdir } = require('fs/promises');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Função idêntica à do seu controller
function sanitizeName(name) {
  return name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const date = new Date();

    // URL pública da sua aplicação (mude ou use .env)
    require('dotenv').config();
    const APP_URL = process.env.APP_URL || 'http://localhost:3000';

    try {
      const locationsData = [
        {
          name: "ifce_cedro",
          photoFilename: 'ifce-main.jpg',
          address: Sequelize.literal(`'${JSON.stringify({
            lat: "-6.6007746",
            long: "-39.0576952"
          })}'::json`),
          createdAt: date,
          updatedAt: date
        },
        {
          name: "cedro",
          photoFilename: 'cedro-main.jpeg',
          address: Sequelize.literal(`'${JSON.stringify({
            lat: "-6.6048618",
            long: "-39.0714555"
          })}'::json`),
          createdAt: date,
          updatedAt: date
        }
      ];

      for (const loc of locationsData) {
        // === 1. Sanitiza nome da pasta (igual ao controller) ===
        const folderName = sanitizeName(loc.name);

        // === 2. Define caminhos ===
        const baseDir = path.join('archives', folderName);
        const imageDir = path.join(baseDir, 'image');
        const qrDir = path.join(baseDir, 'qrcode');

        // === 3. Cria pastas (image já deve existir com a foto, mas criamos qrcode) ===
        await mkdir(qrDir, { recursive: true });

        // === 4. Gera ID manualmente (porque gen_random_uuid() não está disponível no JS) ===
        const locationId = uuidv4();

        // === 5. URL que o QR Code vai apontar ===
        const locationUrl = `${APP_URL}/locations/${locationId}`;

        // === 6. Gera e salva o QR Code ===
        const qrFileName = `qrcode-${locationId}.png`;
        const qrFullPath = path.join(qrDir, qrFileName);

        await QRCode.toFile(qrFullPath, locationUrl, {
          width: 512,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' }
        });

        // === 7. Caminho relativo para salvar no banco (igual ao controller) ===
        const qrCodePath = path.join(baseDir, 'qrcode', qrFileName).replace(/\\/g, '/');
        const photoPath = path.join(baseDir, 'image', loc.photoFilename).replace(/\\/g, '/');

        // === 8. Insere no banco ===
        await queryInterface.bulkInsert('locations', [{
          id: locationId,
          name: loc.name,
          address: loc.address,
          photo: photoPath,
          qrCode: qrCodePath,
          createdAt: date,
          updatedAt: date
        }], { transaction });
      }

      await transaction.commit();
      console.log('Seed executada com sucesso! QR Codes gerados em:');
      console.log(`   ${APP_URL}/locations/<id>`);

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao executar seed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Apaga todas as localizações criadas pela seed
    await queryInterface.bulkDelete('locations', {
      name: ['IFCE - Campus Cedro', 'Cedro']
    }, {});
    
    // Opcional: apagar as pastas (cuidado em produção!)
    // const rimraf = require('rimraf');
    // rimraf.sync('archives/ifce_campus_cedro');
    // rimraf.sync('archives/cedro');
  }
};