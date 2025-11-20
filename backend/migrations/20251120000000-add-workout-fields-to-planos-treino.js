export async function up(queryInterface, Sequelize) {
  // Adiciona tipo de treino (calisthenics, weightlifting, cardio)
  await queryInterface.addColumn('planos_treinos', 'workout_type', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  });

  // Adiciona nível de dificuldade (beginner, intermediate, advanced)
  await queryInterface.addColumn('planos_treinos', 'level', {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  });

  // Adiciona número de exercícios no plano
  await queryInterface.addColumn('planos_treinos', 'exercises_number', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  });

  // Adiciona duração (para cardio, em minutos)
  await queryInterface.addColumn('planos_treinos', 'duration', {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Duração em minutos (usado para treino cardio)'
  });

  // Adiciona músculos selecionados (array guardado como JSON)
  await queryInterface.addColumn('planos_treinos', 'muscles', {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'Lista de músculos alvo (ex: ["peito", "biceps", "triceps"])'
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('planos_treinos', 'workout_type');
  await queryInterface.removeColumn('planos_treinos', 'level');
  await queryInterface.removeColumn('planos_treinos', 'exercises_number');
  await queryInterface.removeColumn('planos_treinos', 'duration');
  await queryInterface.removeColumn('planos_treinos', 'muscles');
}
