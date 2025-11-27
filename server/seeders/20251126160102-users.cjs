'use strict';

/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const rawUsers = [
        { name: "Gustavo Almeida", email: "gustavo.almeida@example.com", password: "123456" },
        { name: "Jorge Felipe", email: "jorge.felipe@example.com", password: "12345678" },
      ];

      const users = await Promise.all(
        rawUsers.map(async (u) => ({
          id: uuidv4(),
          name: u.name,
          email: u.email,
          password: await bcrypt.hash(u.password, 10),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );

      await queryInterface.bulkInsert('users', users, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
