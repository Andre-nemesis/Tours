'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.createTable('views', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        contentType: {
          type: Sequelize.ENUM('.mp3', '.jpg', '.mp4', '.wav', '.png', '.jpeg', '.gif'),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false
        },
        locationId:{
          type: Sequelize.UUID,
          allowNull:false,
          references:{
            key: 'id',
            model: 'locations',
            onUpdate: 'CASCADE',
            onDelet: 'RESTRICT'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          onUpdate: Sequelize.NOW
        }
      }, { transaction });
      await transaction.commit();
    }catch(error){
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('views', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
