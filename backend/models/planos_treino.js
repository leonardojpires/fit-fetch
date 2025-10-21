import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class PlanoTreino extends Model {
    static associate(models) {
      // Defines associations
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
