'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alimentos - planos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  alimentos - planos.init({
    plano_id: DataTypes.INTEGER,
    alimento_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alimentos-planos',
  });
  return alimentos - planos;
};