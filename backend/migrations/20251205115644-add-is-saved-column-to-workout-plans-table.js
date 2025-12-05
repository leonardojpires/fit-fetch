export async function up (queryInterface, Sequelize) {
    queryInterface.addColumn('planos_treinos', 'is_saved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  }

export async function down (queryInterface, Sequelize) {
      queryInterface.removeColumn('planos_treinos', 'is_saved');
}
