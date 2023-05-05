//Autor: Vinicius Toledo
import { Model, DataTypes } from 'sequelize';

class Funcionario extends Model {

  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Nome do Animal deve ser preenchido!" }
        }
      },
      cpf: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "CPF deve ser preenchido!" },
          is: {args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Cliente deve seguir o padrão NNN.NNN.NNN-NN!" }
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: { msg: "Data da Nascimento deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Nascimento deve ser preenchido!"}
          }
      },
      salario: {
        type: DataTypes.FLOAT,
        validate: {
            notEmpty: {msg: "Salario deve ser preenchido!"}
          }
      }
    }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' })
  }

  static associate(models) {

  }

}

export { Funcionario };
