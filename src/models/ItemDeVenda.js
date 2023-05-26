//Autor: Vitor Cogo
import { Model, DataTypes } from 'sequelize';

class ItemDeVenda extends Model {

  static init(sequelize) {
    super.init({
    }, { sequelize, modelName: 'itemDeVenda', tableName: 'itemDeVenda' })
  }

  static associate(models) {
    this.removeAttribute('id')
    this.belongsTo(models.animal, {as: "animal", foreignKey: {name: "animalId"}})
    this.belongsTo(models.venda, {as: "venda", foreignKey: {name: "vendaId"}})
  }

}

export { ItemDeVenda };
