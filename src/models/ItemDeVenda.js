//Autor: Vitor Cogo
import { Model, DataTypes } from 'sequelize';

class ItemDeVenda extends Model {

  static init(sequelize) {
    super.init({
        preco: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
              isFloat: { msg: "Preço do Animal deve ser preenchido com um valor decimal!" },
              notEmpty: {msg: "Preço do Animal deve ser preenchido!"}
            }
          },
    }, { sequelize, modelName: 'itemDeVenda', tableName: 'itemDeVenda' })
  }

  static associate(models) {
    this.removeAttribute('id')
    this.belongsTo(models.animal, {as: "animal", foreignKey: {name: "animalId"}})
    this.belongsTo(models.venda, {as: "venda", foreignKey: {name: "vendaId"}})
  }

}

export { ItemDeVenda };
