'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const users = await queryInterface.sequelize.query('select id from users');
    const locations = await queryInterface.sequelize.query('select id from locations');
    try {
      const rawData = [
        {
          userId:users[0][0].id,
          locationId: locations[0][0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId:users[0][1].id,
          locationId: locations[0][1].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await queryInterface.bulkInsert('favoriteLocations', rawData, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('favoriteLocations', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
