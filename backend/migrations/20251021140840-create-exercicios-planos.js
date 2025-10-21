'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('exercicios_planos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    plano_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Planos_Treinos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    exercicio_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Exercicios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  await queryInterface.dropTable('exercicios_planos');
}
