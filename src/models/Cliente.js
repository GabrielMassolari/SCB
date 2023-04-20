import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {

  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nome do cliente deve ser preenchido!" }
        }
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "CPF deve ser preenchido!" },
          is: {args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Cliente deve seguir o padrão NNN.NNN.NNN-NN!" },
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: { msg: "Data da Nascimento deve ser preenchida!" },
            is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
            notEmpty: {msg: "Data de Nascimento deve ser preenchido!"},
          }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Email deve ser preenchido!"}
          }
      }
    }, { sequelize, modelName: 'cliente', tableName: 'clientes' })
  }

  static associate(models) {

  }

}

export { Cliente };
