import { Galpao } from "../models/Galpao.js";
import { QueryTypes } from 'sequelize';

import sequelize from '../config/database-connection.js';

class GalpaoService {

  static async findAll() {
    const objs = await Galpao.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Galpao.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, capacidade, limiteDiario, maternidade } = req.body;
    const obj = await Galpao.create({ nome, capacidade, limiteDiario, maternidade });
    return await Galpao.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {  nome, capacidade, limiteDiario, maternidade } = req.body;
    const obj = await Galpao.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Galpão não encontrado!';
    Object.assign(obj, { nome, capacidade, limiteDiario, maternidade });
    await obj.save();
    return await Galpao.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Galpao.findByPk(id);
    if (obj == null) throw 'Galpão não encontrado!';
    await obj.destroy();
    return obj;
  }

  static async animalsReceivedCount(galpao, dataEntrada) {
    //const objs = await sequelize.query("SELECT * FROM reservas WHERE reservas.fita_id = :fitaId AND reservas.status = :status", { replacements: { fitaId: fitaId, status: status }, type: QueryTypes.SELECT });

    const sql = "SELECT COUNT(*) FROM animais a, entradas e WHERE a.entrada_id = e.id AND e.data_entrada = :data AND e.galpao_id = :galpaoId;"
    const count = await sequelize.query(sql, { replacements: { data: dataEntrada, galpaoId: galpao }, type: QueryTypes.SELECT });  

    return count[0];
  }

  static async mediaIdadeGalpao(galpao) {
    //Criar SQL para Postgresql
    const sql = "SELECT avg(((JulianDay('now')) - JulianDay(data_nascimento))/365.25) as media FROM animais a, entradas e WHERE a.entrada_id = e.id AND e.galpao_id = :galpaoId;";
    const media = await sequelize.query(sql, { replacements: { galpaoId: galpao } ,  type: QueryTypes.SELECT });

    return media[0];
  }
  
}

export { GalpaoService };