import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class AlimentosPlano extends Model {
  static associate(models) {
    this.belongsTo(models.PlanoAlimentacao, { foreignKey: 'plano_id' });
    this.belongsTo(models.Alimento, { foreignKey: 'alimento_id' });
  }
}

AlimentosPlano.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    plano_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'planos_alimentacoes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    alimento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Alimentos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'AlimentosPlano',
    tableName: 'alimentos_planos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default AlimentosPlano;
