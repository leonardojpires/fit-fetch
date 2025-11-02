import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class User extends Model {}

User.init(
  {
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatarUrl : {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

export default User;
