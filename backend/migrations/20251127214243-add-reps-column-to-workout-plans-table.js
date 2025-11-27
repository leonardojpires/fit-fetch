export async function up(queryInterface, Sequelize) {
  queryInterface.addColumn('planos_treinos', 'reps_number', {
    type: Sequelize.INTEGER,
    allowNull: true,
    comment: 'Número de repetições por série para exercícios de musculação e calistenia'
  })  
}

export async function down(queryInterface, Sequelize) {
  queryInterface.removeColumn('planos_treinos', 'reps_number');
};
