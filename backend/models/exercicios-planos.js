import { Model } from 'sequelize';

'use strict';

export default (sequelize, DataTypes) => {
  class ExerciciosPlano extends Model {
    static associate(models) {
      this.belongsTo(models.PlanoTreino, { foreignKey: 'plano_id' });
      this.belongsTo(models.Exercicio, { foreignKey: 'exercicio_id' });
    }
  }

  ExerciciosPlano.init({
    plano_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exercicio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ExerciciosPlano',
    tableName: 'exercicios_planos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ExerciciosPlano;
};
