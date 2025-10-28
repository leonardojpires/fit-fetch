export async function up(queryInterface, Sequelize) {
  
  await queryInterface.sequelize.query(
    "UPDATE Users SET role = 'admin' WHERE role = 'admin, user';"
  );
  
  await queryInterface.changeColumn('Users', 'role', {
    type: Sequelize.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  });
}

export async function down(queryInterface, Sequelize) {
  
  await queryInterface.changeColumn('Users', 'role', {
    type: Sequelize.ENUM('admin, user'),
    allowNull: false,
  });
}