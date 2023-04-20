//Autor: Vitor Cogo
import { Model, DataTypes } from 'sequelize';

class Venda extends Model {

  static init(sequelize) {
    super.init({
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Valor deve ser preenchido!"}
          }
      },
      distanciaEntrega: {
        type: DataTypes.FLOAT,
        validate: {
            notEmpty: {msg: "A distancia deve ser preenchida!"}
          }
      }
    }, { sequelize, modelName: 'venda', tableName: 'vendas' })
  }

  static associate(models) {
    this.belongsTo(models.caminhao, {as: "caminhao", foreignKey: {name: "caminhaoId"}})
    this.belongsTo(models.cliente, {as: "cliente", foreignKey: {name: "clienteId"}})
    this.hasMany(models.itemDeVenda, {as: "itemDeVenda", foreignKey: {name: "itemDeVendaId"}})
  }

}

export { Venda };
