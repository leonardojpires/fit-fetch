'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('exercicios', 'image_url');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('exercicios', 'image_url', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
