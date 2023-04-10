import { Model, DataTypes } from 'sequelize';

class Animal extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Animal deve ser preenchido!" },
          notNull: {msg: "Nome do Animal não pode ser nulo!"}
        }
      },
      peso: { 
        type: DataTypes.DOUBLE, 
        validate: {
          isFloat: { msg: "Peso do Animal deve ser preenchido com um valor decimal!" },
          notEmpty: {msg: "Peso do Animal deve ser preenchido!"},
          notNull: {msg: "Peso do Animal não pode ser nulo!"}
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Nascimento deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Nascimento deve ser preenchido!"},
            notNull: {msg: "Data de Nascimento não pode ser nulo!"}
          }
      },
      dataVacinacao: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Vacinação deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Vacinação deve ser preenchido!"},
            notNull: {msg: "Data de Vacinação não pode ser nulo!"}
          }
      }
    }, { sequelize, modelName: 'animal', tableName: 'animais' })
  }

  static associate(models) {
    this.belongsTo(models.galpao, {as: "galpao", foreignKey: {name: "galpaoId"}})
  }
  
}

export { Animal };