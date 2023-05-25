//Autor: Gabriel Guimarães Massolari
import { Model, DataTypes } from 'sequelize';

class Animal extends Model {

  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Nome do Animal deve ser preenchido!" }
        }
      },
      peso: {
        type: DataTypes.DOUBLE,
        validate: {
          isFloat: { msg: "Peso do Animal deve ser preenchido com um valor decimal!" },
          notEmpty: {msg: "Peso do Animal deve ser preenchido!"},
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Nascimento deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Nascimento deve ser preenchido!"},
          }
      },
      dataVacinacao: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Vacinação deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Vacinação deve ser preenchido!"},
          }
      }
    }, { sequelize, modelName: 'animal', tableName: 'animais' })
  }

  static associate(models) {
    this.belongsTo(models.galpao, {as: "galpaoAnimal", foreignKey: {name: "galpaoId"}})
    this.belongsTo(models.entrada, { as: 'entrada', foreignKey: {name: 'entradaId'}});
  }

}

export { Animal };
