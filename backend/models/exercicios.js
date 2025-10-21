import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class Exercicio extends Model {
    static associate(models) {
      // Defines associations
    }
  }

  Exercicio.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    muscle_group: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rest_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Exercicio',
    tableName: 'Exercicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Exercicio;
};
