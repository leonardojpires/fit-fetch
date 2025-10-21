'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('alimentos_planos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    plano_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Planos_Alimentacaos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    alimento_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Alimentos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: Sequelize.INTEGER
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
  await queryInterface.dropTable('alimentos_planos');
}
