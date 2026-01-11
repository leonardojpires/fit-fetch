'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('planos_alimentacoes', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('planos_alimentacoes', ['user_id'], {
        name: 'planos_alimentacoes_user_id_idx'
    });

    await queryInterface.addColumn('planos_alimentacoes', 'is_saved', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    });

    await queryInterface.addColumn('planos_alimentacoes', 'calories', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'diet_type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'total_proteins', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'total_carbs', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'total_fibers', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'total_fats', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
  });

  await queryInterface.addColumn('planos_alimentacoes', 'diet_type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
  });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('planos_alimentacoes', 'user_id');
    await queryInterface.removeIndex('planos_alimentacoes', 'planos_alimentacoes_user_id_idx');
    await queryInterface.removeColumn('planos_alimentacoes', 'is_saved');
    await queryInterface.removeColumn('planos_alimentacoes', 'calories');
    await queryInterface.removeColumn('planos_alimentacoes', 'diet_type');
    await queryInterface.removeColumn('planos_alimentacoes', 'total_proteins');
    await queryInterface.removeColumn('planos_alimentacoes', 'total_carbs');
    await queryInterface.removeColumn('planos_alimentacoes', 'total_fibers');
    await queryInterface.removeColumn('planos_alimentacoes', 'total_fats');
    await queryInterface.removeColumn('planos_alimentacoes', 'diet_type');
}