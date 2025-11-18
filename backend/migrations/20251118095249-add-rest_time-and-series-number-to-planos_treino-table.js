export async function up (queryInterface, Sequelize) {
    await queryInterface.addColumn('planos_treinos', 'rest_time', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
  });

  await queryInterface.addColumn('planos_treinos', 'series_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
  });
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('planos_treinos', 'rest_time');
  await queryInterface.removeColumn('planos_treinos', 'series_number');
}
