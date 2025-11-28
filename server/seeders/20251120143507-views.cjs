'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const date = new Date();
    try {
      const locationsIds = await queryInterface.sequelize.query('select id from locations');
      if (locationsIds.length === 0) {
        throw new Error('Nenhum local encontrado no banco de dados');
      }
      const views = [
        {
          name: 'Quadra Esportiva',
          contentType: '.jpeg',
          content: '../archives/ifce_cedro/image/quadra.jpeg',
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Quadra Esportiva Video',
          contentType: '.mp4',
          content: '../archives/ifce_cedro/video/VID_20251127_142129.mp4',
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Biblioteca',
          contentType: '.jpg',
          content: '../archives/ifce_cedro/image/biblioteca.jpg',
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Biblioteca Video',
          contentType: '.mp4',
          content: '../archives/ifce_cedro/video/VID_20251127_164522.mp4',
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Praça Marco Zero',
          contentType: '.jpg',
          content: '../archives/cedro/image/marco-zero.jpg',
          locationId: locationsIds[0][1].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Linha Férrea',
          contentType: '.jpg',
          content: '../archives/cedro/image/linha-ferrea.jpg',
          locationId: locationsIds[0][1].id,
          createdAt: date,
          updatedAt: date
        }
      ];
      await queryInterface.bulkInsert('views', views, { transaction });
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('views', [], { transaction });
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
};
