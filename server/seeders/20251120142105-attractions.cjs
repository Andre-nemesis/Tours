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
      const attractions = [
        {
          name: 'Quadra Esportiva',
          timeExposition: Sequelize.literal("'12:00:00'::time"),
          hasLimit: false,
          limitPeople: 0,
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Biblioteca',
          timeExposition: Sequelize.literal("'12:00:00'::time"),
          hasLimit: true,
          limitPeople: 420,
          locationId: locationsIds[0][0].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Praça Marco Zero',
          timeExposition: Sequelize.literal("'23:59:59'::time"),
          hasLimit: true,
          limitPeople: 500,
          locationId: locationsIds[0][1].id,
          createdAt: date,
          updatedAt: date
        },
        {
          name: 'Linha Ferréa',
          timeExposition: Sequelize.literal("'10:00:00'::time"),
          hasLimit: true,
          limitPeople: 250,
          locationId: locationsIds[0][1].id,
          createdAt: date,
          updatedAt: date
        }
      ];
      await queryInterface.bulkInsert('attractions', attractions, { transaction });
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('attractions', [], { transaction });
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
};
