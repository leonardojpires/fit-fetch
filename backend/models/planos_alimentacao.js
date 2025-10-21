import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class AlimentosPlano extends Model {
    static associate(models) {
      this.belongsTo(models.PlanoAlimentacao, { foreignKey: 'plano_id' });
      this.belongsTo(models.Alimento, { foreignKey: 'alimento_id' });
    }
  }

  AlimentosPlano.init({
    plano_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    alimento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'AlimentosPlano',
    tableName: 'alimentos_planos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AlimentosPlano;
};
