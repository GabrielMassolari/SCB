//Autor:Vinicius
import { Model, DataTypes } from 'sequelize';

class Vacinacao extends Model {

    static init(sequelize) {
        super.init({
            dataVacinacao: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: { msg: "Data da Vacinação deve ser preenchida!" },
                    is: { args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Reserva deve seguir o padrão yyyy-MM-dd!" },
                    notEmpty: { msg: "Data de Vacinação deve ser preenchido!" },
                    notNull: { msg: "Data de Vacinação não pode ser nulo!" }
                }
            }
        }, { sequelize, modelName: 'vacinacao', tableName: 'vacinacoes' })
    }

    static associate(models) {
        this.belongsTo(models.lote, { as: "lote", foreignKey: { name: "loteId" } })
        this.belongsTo(models.funcionario, { as: "funcionario", foreignKey: { name: "funcionarioId" } })
        this.belongsTo(models.animal, { as: "animal", foreignKey: { name: "animalId" } })
    }

}

export { Vacinacao };
