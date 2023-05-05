//Autor:Vinicius
import { Model, DataTypes } from 'sequelize';

class Lote extends Model {

    static init(sequelize) {
        super.init({
            lote: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Lote deve ser preenchido!" },
                    notNull: { msg: "Lote não pode ser nulo!" }
                }
            },
            quantidadeDoses: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: "Quantidade de doses deve ser preenchido com um valor inteiro!" },
                    notEmpty: { msg: "Quantidade de doses deve ser preenchido!" },
                    notNull: { msg: "Quantidade de doses não pode ser nulo!" }
                }
            },
            dataVencimento: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: { msg: "Data de vencimento deve ser preenchida!" },
                    is: { args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data de vencimento deve seguir o padrão yyyy-MM-dd!" },
                    notEmpty: { msg: "Data de vencimento deve ser preenchido!" },
                    notNull: { msg: "Data de vencimento não pode ser nulo!" }
                },
            },

        }, { sequelize, modelName: 'lote', tableName: 'lotes' })
    }

    static associate(models) {
        this.belongsTo(models.vacina, { as: "vacina", foreignKey: { name: "vacinaid" } })
    }

}

export { Lote };
