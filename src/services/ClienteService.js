import { Cliente } from "../models/Cliente.js";

import sequelize from '../config/database-connection.js';

class ClienteService {

  static async findAll() {
    const objs = await Cliente.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, email, cpf, dataNascimento } = req.body;
    const obj = await Cliente.create({ nome, email, cpf, dataNascimento});
    return await Cliente.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, email, cpf, dataNascimento } = req.body;
    const obj = await Cliente.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Cliente não encontrado!';
    Object.assign(obj, { nome, email, cpf, dataNascimento });
    await obj.save();
    return await Cliente.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cliente.findByPk(id);
    if (obj == null) throw 'Cliente não encontrado!';
    await obj.destroy();
    return obj;
  }

}

export { ClienteService };