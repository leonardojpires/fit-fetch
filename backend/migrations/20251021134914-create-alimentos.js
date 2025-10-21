'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Alimentos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    protein: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    carbs: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    fiber: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Alimentos');
}
