import { Funcionario } from "../models/Funcionario.js";

import sequelize from '../config/database-connection.js';

class FuncionarioService {

    static async findAll() {
        const objs = await Funcionario.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Funcionario.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { nome, cpf, dataNascimento, salario } = req.body;
        const obj = await Funcionario.create({ nome, cpf, dataNascimento, salario });
        return await Funcionario.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { nome, cpf, dataNascimento, salario } = req.body;
        const obj = await Funcionario.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Funcionario não encontrado!';
        Object.assign(obj, { nome, cpf, dataNascimento, salario });
        await obj.save();
        return await Funcionario.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Funcionario.findByPk(id);
        if (obj == null) throw 'Funcionario não encontrado!';
        await obj.destroy();
        return obj;
    }
}

export { FuncionarioService };