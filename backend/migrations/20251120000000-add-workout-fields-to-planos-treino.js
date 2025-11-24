export async function up(queryInterface, Sequelize) {
  // Adds workout type (calisthenics, weightlifting, cardio)
  await queryInterface.addColumn('planos_treinos', 'workout_type', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  });

  // Adds difficulty level (beginner, intermediate, advanced)
  await queryInterface.addColumn('planos_treinos', 'level', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  });

  // Adds number of exercises in the plan
  await queryInterface.addColumn('planos_treinos', 'exercises_number', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  });

  // Adds duration (for cardio, in minutes)
  await queryInterface.addColumn('planos_treinos', 'duration', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Duration in minutes (used for cardio workout)'
  });

  // Adds selected muscles (array stored as JSON)
  await queryInterface.addColumn('planos_treinos', 'muscles', {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'List of target muscles (e.g., ["peito", "biceps", "triceps"])'
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('planos_treinos', 'workout_type');
  await queryInterface.removeColumn('planos_treinos', 'level');
  await queryInterface.removeColumn('planos_treinos', 'exercises_number');
  await queryInterface.removeColumn('planos_treinos', 'duration');
  await queryInterface.removeColumn('planos_treinos', 'muscles');
}
