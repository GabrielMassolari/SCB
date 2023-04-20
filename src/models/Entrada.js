//Autor: Gabriel Guimarães Massolari
import { Model, DataTypes } from 'sequelize';

class Entrada extends Model {

  static init(sequelize) {
    super.init({
      dataEntrada: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Entrada deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Entrada deve ser preenchido!"}
          }
      }
    }, { sequelize, modelName: 'entrada', tableName: 'entradas' })
  }

  static associate(models) {
    this.belongsTo(models.galpao, {as: "galpao", foreignKey: {name: "galpaoId"}})
    this.hasMany(models.animal, {as: 'animais', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
    this.belongsTo(models.funcionario, {as: "funcionario", foreignKey: {name: "funcionarioId"}})
  }

}

export { Entrada };
