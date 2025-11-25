import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class PlanoTreino extends Model {
    static associate(models) {
      // Many-to-many relationship with Exercicio through ExerciciosPlano
      this.belongsToMany(models.Exercicio, {
        through: models.ExerciciosPlano,
        foreignKey: 'plano_id',
        otherKey: 'exercicio_id',
        as: 'exercicios'
      });

      // Many-to-one relationship with User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  PlanoTreino.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    workout_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tipo: calisthenics, weightlifting, cardio'
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nível: beginner, intermediate, advanced'
    },
    exercises_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Duração em minutos (cardio)'
    },
    muscles: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array de músculos alvo'
    },
    rest_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    series_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'PlanoTreino',
    tableName: 'Planos_Treinos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PlanoTreino;
};
