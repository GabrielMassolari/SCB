import { Vacina } from "../models/Vacina.js";

import sequelize from '../config/database-connection.js';

class VacinaService {

    static async findAll() {
        const objs = await Vacina.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Vacina.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { nome } = req.body;
        const obj = await Vacina.create({nome });
        return await Vacina.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { nome } = req.body;
        const obj = await Vacina.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Vacina não encontrada!';
        Object.assign(obj, { nome });
        await obj.save();
        return await Vacina.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Vacina.findByPk(id);
        if (obj == null) throw 'Vacina não encontrada!';
        await obj.destroy();
        return obj;
    }
}

export { VacinaService };