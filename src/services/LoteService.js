import { Lote } from "../models/Lote.js";

import sequelize from '../config/database-connection.js';

class LoteService {

    static async findAll() {
        const objs = await Lote.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Lote.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { lote, dataVencimento, quantidadeDoses, vacinaid } = req.body;
        const obj = await Lote.create({ lote, dataVencimento, quantidadeDoses, vacinaid: vacinaid });
        return await Lote.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async update(req) {
        const { id } = req.params;
        const { lote, dataVencimento, quantidadeDoses, vacinaid } = req.body;
        const obj = await Lote.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Lote não encontrado!';
        Object.assign(obj, { lote, dataVencimento, quantidadeDoses, vacinaid: vacinaid});
        await obj.save();
        return await Lote.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Lote.findByPk(id);
        if (obj == null) throw 'Lote não encontrado!';
        await obj.destroy();
        return obj;
    }
}

export { LoteService };