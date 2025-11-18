export async function up (queryInterface, Sequelize) {
    await queryInterface.addColumn('exercicios', 'type', {
      type: Sequelize.ENUM('calisthenics', 'weightlifting', 'cardio'),
      allowNull: false,
      defaultValue: 'weightlifting'
  });

  await queryInterface.addColumn('exercicios', 'difficulty', {
      type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
  });
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('exercicios', 'type');
  await queryInterface.removeColumn('exercicios', 'difficulty');
}
