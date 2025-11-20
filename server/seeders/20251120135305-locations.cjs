'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const date = new Date();
    try {
      const loctions = [
        {
          id: Sequelize.literal('gen_random_uuid()'),
          name: "IFCE - Campus Cedro",
          address: Sequelize.literal(`'${JSON.stringify({
            lat: "-6.6007746",
            long: "-39.0576952"
          })}'::json`),
          photo: '../archives/ifce_cedro/image/ifce-main.jpg',
          qrCode: 'None',
          createdAt: date,
          updatedAt: date
        },
        {
          id: Sequelize.literal('gen_random_uuid()'),
          name: "Cedro",
          address: Sequelize.literal(`'${JSON.stringify({
            lat: "-6.6048618",
            long: "-39.0714555"
          })}'::json`),
          photo: '../archives/cedro/image/cedro-main.jpeg',
          qrCode: 'None',
          createdAt: date,
          updatedAt: date
        }
      ]

      await queryInterface.bulkInsert('locations',loctions,{transaction});
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.bulkDelete('locations',[],{transaction});
      await transaction.commit();
    }catch(error){
      transaction.rollback();
      throw error;
    }
  }
};
