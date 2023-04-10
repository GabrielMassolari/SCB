import { Model, DataTypes } from 'sequelize';

class Galpao extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Galpão deve ser preenchido!" },
          notNull: {msg: "Nome do Galpão não pode ser nulo!"}
        }
      },
      capacidade: { 
        type: DataTypes.INTEGER, 
        validate: {
          isInt: { msg: "Capacidade deve ser preenchido com um valor inteiro!" },
          notEmpty: {msg: "Capacidade deve ser preenchido!"},
          notNull: {msg: "Capacidade não pode ser nulo!"},
          min: 1
        }
      },
      limiteDiario: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: { msg: "Limite Diário deve ser preenchido com um valor inteiro!" },
            notEmpty: {msg: "Limite Diário deve ser preenchido!"},
            notNull: {msg: "Limite Diário não pode ser nulo!"},
            min: 1
          }
      },
      maternidade: {
        type: DataTypes.BOOLEAN,
        validate: {
            notEmpty: {msg: "Maternidade deve ser preenchido!"},
            notNull: {msg: "Maternidade não pode ser nulo!"}
          }
      }
    }, { sequelize, modelName: 'galpao', tableName: 'galpoes' })
  }

  static associate(models) {
  }
  
}

export { Galpao };