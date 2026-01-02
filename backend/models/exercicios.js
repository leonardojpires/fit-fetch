import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class Exercicio extends Model {}

Exercicio.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscle_group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('calisthenics', 'weightlifting', 'cardio'),
      allowNull: false,
      defaultValue: 'weightlifting',
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner',
    },
  },
  {
    sequelize,
    modelName: 'Exercicio',
    tableName: 'exercicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Exercicio;
