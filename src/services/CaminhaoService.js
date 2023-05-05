import { Caminhao } from "../models/Caminhao.js";

import sequelize from '../config/database-connection.js';

class CaminhaoService {

  static async findAll() {
    const objs = await Caminhao.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Caminhao.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { modelo, ano, marca, quilometragem } = req.body;
    const obj = await Caminhao.create({ modelo, ano, marca, quilometragem });
    return await Caminhao.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {  modelo, ano, marca, quilometragem} = req.body;
    const obj = await Caminhao.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Caminhao não encontrado!';
    Object.assign(obj, { modelo, ano, marca, quilometragem });
    await obj.save();
    return await Caminhao.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Caminhao.findByPk(id);
    if (obj == null) throw 'Caminhao não encontrado!';
    await obj.destroy();
    return obj;
  }

}

export { CaminhaoService };