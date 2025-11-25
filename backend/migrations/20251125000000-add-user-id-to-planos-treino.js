export async function up(queryInterface, Sequelize) {
  // Adds user_id column to associate workout plans with users
  await queryInterface.addColumn('planos_treinos', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: true, // Allow null for existing plans
    references: {
      model: 'Users', // Name of the users table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Foreign key to the user who created this workout plan'
  });

  // Add index for better query performance
  await queryInterface.addIndex('planos_treinos', ['user_id'], {
    name: 'planos_treinos_user_id_idx'
  });
}

export async function down(queryInterface) {
  // Remove index first
  await queryInterface.removeIndex('planos_treinos', 'planos_treinos_user_id_idx');
  
  // Remove column
  await queryInterface.removeColumn('planos_treinos', 'user_id');
}
