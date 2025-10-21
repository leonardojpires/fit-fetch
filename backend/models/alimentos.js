import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class Alimento extends Model {
    static associate(models) {
      // Defines associations
    }
  }

  Alimento.init({
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
  }, {
    sequelize,
    modelName: 'Alimento',
    tableName: 'Alimentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Alimento;
};
