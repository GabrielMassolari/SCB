import { Entrada } from "../models/Entrada.js";
import { GalpaoService } from "./GalpaoService.js";

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';
import { Animal } from "../models/Animal.js";
import { Galpao } from "../models/Galpao.js";
import { Venda } from "../models/Venda.js";
import { ItemDeVenda } from "../models/ItemDeVenda.js";

class VendaService {
    static async findAll() {
        const objs = await Entrada.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Entrada.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { distanciaEntrega, dataVenda, preco, cliente, caminhao, animais } = req.body;
        if (await this.verificarRegrasDeNegocio(req)) {
            if(this.quilometrosRodadosMesAtual(cliente)['soma'] <= 1000) {
                //10% taxa de frete
                preco = preco * 1.10;
            }
            const t = await sequelize.transaction();
            const obj = await Venda.create({ distanciaEntrega, dataVenda, preco, clienteId: cliente, caminhaoId: caminhao }, { transaction: t });
            try {
                await Promise.all(animais.map(async item => (await ItemDeVenda.create({vendaId: obj.id, animalId: item.id}))));
                await t.commit();
                return {"message": "ok"}
            } catch (error) {
                await t.rollback();
                throw "Pelo menos um dos animais informadas não foi encontrada!";
            }
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { data, valor, cliente, itens } = req.body;
        const obj = await Emprestimo.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Empréstimo não encontrado!';
        const t = await sequelize.transaction();
        Object.assign(obj, { data, valor, clienteId: cliente.id });
        await obj.save({ transaction: t });
        try {
            await Promise.all((await obj.itens).map(item => item.destroy({ transaction: t }))); // destruindo todos itens deste empréstimo
            await Promise.all(itens.map(item => obj.createItem({ valor: item.valor, entrega: item.entrega, emprestimoId: obj.id, fitaId: item.fita.id }, { transaction: t })));
            await t.commit();
            return await Emprestimo.findByPk(obj.id, { include: { all: true, nested: true } });
        } catch (error) {
            await t.rollback();
            throw "Pelo menos uma das fitas informadas não foi encontrada!";
        }
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Emprestimo.findByPk(id);
        if (obj == null) throw 'Empréstimo não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover um empréstimo que possui devoluções ou multas!";
        }
    }

    // Implementando as regras de negócio relacionadas ao processo de negócio Empréstimo
    // Regra de Negócio 1: Será verificado se o galpão já atingiu o limite diário de recebimento de animais
    // Regra de Negócio 2: Verifica se a idade do animal está próximo da média de animais que estão no galpão (a idade do animal pode ter uma variação de 6 meses em relação a média de idade dos animais contidos no galpão)
    static async verificarRegrasDeNegocio(req) {
        const { dataEntrada, galpao, funcionario, animais } = req.body;

        if (animais.length == 0) {
            throw "Deve existir, pelo menos, um animal selecionado!";
        }

        // Regra de Negócio 1: Será validado se a média de peso do lote de animais está acima de 250 kg.
        const mediaPesoLote = await GalpaoService.mediaPesoGalpao(galpao)

        if (mediaPesoLote['media'] < 250) {
            throw "A média de peso do lote é menor que 250kg";
        }
        // Regra de Negócio 2: Verifica se a data da última vacinação, sendo que se tiver menos de 3 meses, não será permitido vacinar o animal

        return true;
    }

    static async quilometrosRodadosMesAtual(cliente) {
        //SELECT SUM(distancia_entrega) FROM vendas WHERE strftime('%m', date('now')) = strftime('%m', data_venda) AND strftime('%Y', date('now')) = strftime('%Y', data_venda) and cliente_id = 1;
        const sql = "SELECT SUM(distancia_entrega) as soma FROM vendas WHERE strftime('%m', date('now')) = strftime('%m', data_venda) AND strftime('%Y', date('now')) = strftime('%Y', data_venda) and cliente_id = :clienteId;"
        const sum = await sequelize.query(sql, { replacements: { clienteId: cliente }, type: QueryTypes.SELECT });  
    
        return sum[0];
    }

    static getIdade(data) {
        let dataAtual = new Date()
        data = new Date(data)

        return (dataAtual.getFullYear() - data.getFullYear());
    }
}

export { VendaService };