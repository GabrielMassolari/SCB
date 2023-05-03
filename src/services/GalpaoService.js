import { Galpao } from "../models/Galpao.js";

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
}

export { GalpaoService };