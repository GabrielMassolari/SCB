import { Animal } from "../models/Animal.js";

import sequelize from '../config/database-connection.js';

class AnimalService {

  static async findAll() {
    const objs = await Animal.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Animal.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, peso, dataNascimento, dataVacinacao, galpao } = req.body;
    const obj = await Animal.create({ nome, peso, dataNascimento, dataVacinacao, galpaoId: galpao });
    return await Animal.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, peso, dataNascimento, dataVacinacao, galpao  } = req.body;
    const obj = await Animal.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Animal não encontrado!';
    Object.assign(obj, { nome, peso, dataNascimento, dataVacinacao, galpaoId: galpao });
    await obj.save();
    return await Animal.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Animal.findByPk(id);
    if (obj == null) throw 'Animal não encontrado!';
    await obj.destroy();
    return obj;
  }

}

export { AnimalService };