import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Alimento extends Model {}

Alimento.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    fiber: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Alimento',
    tableName: 'Alimentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Alimento;
