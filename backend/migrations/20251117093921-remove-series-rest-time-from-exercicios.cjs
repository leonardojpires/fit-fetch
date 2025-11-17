'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('exercicios', 'series');
    await queryInterface.removeColumn('exercicios', 'rest_time');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('exercicios', 'series', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3
    });
    await queryInterface.addColumn('exercicios', 'rest_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 60
    });
  }
};
