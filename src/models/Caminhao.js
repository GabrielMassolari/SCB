//Autor: Vitor Cogo
import { Model, DataTypes } from 'sequelize';

class Caminhao extends Model {

  static init(sequelize) {
    super.init({
      modelo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Modelo do caminhao deve ser preenchido!" }
        }
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Ano deve ser preenchido com um valor inteiro!" },
          notEmpty: {msg: "Ano deve ser preenchido!"},
          min: 1
        }
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Marca deve ser preenchida!" }
        }
      },
      quilometragem: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {msg: "A quilometragem deve ser preenchida!"}
          }
      }
    }, { sequelize, modelName: 'caminhao', tableName: 'caminhoes' })
  }

  static associate(models) {

  }

}

export { Caminhao };
