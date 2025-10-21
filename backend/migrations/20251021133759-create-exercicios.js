'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Exercicios', {
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
    muscle_group: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    video_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    series: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    rest_time: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  await queryInterface.dropTable('Exercicios');
}
