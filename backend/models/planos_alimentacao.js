import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class PlanoAlimentacao extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsToMany(models.Alimento, {
      through: models.AlimentosPlano,
      foreignKey: 'plano_id',
      otherKey: 'alimento_id',
      as: 'alimentos'
    });
  }
}

PlanoAlimentacao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_saved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    diet_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    total_proteins: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    },
    total_carbs: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    },
    total_fibers: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    },
    total_fats: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'PlanoAlimentacao',
    tableName: 'planos_alimentacoes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default PlanoAlimentacao;
