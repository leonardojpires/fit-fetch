'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Alimentos', 'fat', {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  });

  await queryInterface.addColumn('Alimentos', 'calories', {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  });

  await queryInterface.addColumn('Alimentos', 'serving_size', {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 100
  });

  await queryInterface.addColumn('Alimentos', 'unit', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'g'
  });

  await queryInterface.addColumn('Alimentos', 'category', {
    type: Sequelize.STRING,
    allowNull: true
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Alimentos', 'fat');
  await queryInterface.removeColumn('Alimentos', 'calories');
  await queryInterface.removeColumn('Alimentos', 'serving_size');
  await queryInterface.removeColumn('Alimentos', 'unit');
  await queryInterface.removeColumn('Alimentos', 'category');
}
