//Autor: Vinicius
import { Model, DataTypes } from 'sequelize';

class Vacina extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Nome da vacina deve ser preenchido!" },
                    notNull: { msg: "Nome da vacina não pode ser nulo!" }
                }
            },

        }, { sequelize, modelName: 'vacina', tableName: 'vacinas' })
    }

    static associate(models) {

    }
}

export { Vacina };
