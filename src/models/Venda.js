//Autor: Vitor Cogo
import { Model, DataTypes } from 'sequelize';

class Venda extends Model {

  static init(sequelize) {
    super.init({
      preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Preco deve ser preenchido!"}
          }
      },
      distanciaEntrega: {
        type: DataTypes.FLOAT,
        validate: {
            notEmpty: {msg: "A distancia deve ser preenchida!"}
          }
      },
      dataVenda: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Venda deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Venda deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Venda deve ser preenchido!"},
          }
      },
    }, { sequelize, modelName: 'venda', tableName: 'vendas' })
  }

  static associate(models) {
    this.belongsTo(models.caminhao, {as: "caminhao", foreignKey: {name: "caminhaoId"}})
    this.belongsTo(models.cliente, {as: "cliente", foreignKey: {name: "clienteId"}})
    this.hasMany(models.itemDeVenda, {as: "itemDeVenda", foreignKey: {name: "itemDeVendaId"}})
  }

}

export { Venda };
