'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.createTable('attractions', {
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
        timeExposition: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        hasLimit: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        limitPeople: {
          type: Sequelize.INTEGER,
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
      await queryInterface.dropTable('attractions', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
