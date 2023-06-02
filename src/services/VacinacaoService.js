import { Entrada } from "../models/Entrada.js";
import { GalpaoService } from "./GalpaoService.js";

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';
import { Animal } from "../models/Animal.js";
import { Galpao } from "../models/Galpao.js";
import { Vacinacao } from "../models/Vacinacao.js";
import { FuncionarioService } from "./FuncionarioService.js";

class VacinacaoService {

    static async findAll() {
        const objs = await Vacinacao.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Vacinacao.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { dataVacinacao, lote, funcionario, galpao } = req.body;

        const animais = await GalpaoService.animaisPorGalpao(galpao)
        if (await this.verificarRegrasDeNegocio(req)) {
            const t = await sequelize.transaction();
            try {
                await Promise.all(animais.map(async item => ((await Animal.findByPk(item.id, { include: { all: true, nested: true } })).update({ dataVacinacao: dataVacinacao }))));
                await Promise.all(animais.map(async item => (await Vacinacao.create({ dataVacinacao: dataVacinacao, loteId: lote, funcionarioId: funcionario, animalId: item.id }))));
                await t.commit();
                return { 'message': 'ok' }
            } catch (error) {
                await t.rollback();
                throw "Pelo menos um dos animais informadas não foi encontrada!";
            }
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { dataVacinacao, lote, funcionario } = req.body;
        const obj = await Vacinacao.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Vacinacao não encontrada!';
        Object.assign(obj, { dataVacinacao: dataVacinacao, loteId: lote, funcionarioId: funcionario, animalId: item.id });
        await obj.save();
        return await Vacinacao.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Vacinacao.findByPk(id);
        if (obj == null) throw 'Empréstimo não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover um empréstimo que possui devoluções ou multas!";
        }
    }

    static async getTotalVacinasAplicadas(req) {
        const { inicio, termino } = req.params;

        const objs = await sequelize.query(`
        SELECT v.nome, COUNT(*) as quantidade
        FROM vacinas v,
        lotes l,
        Vacinacoes va
        WHERE v.id = l.vacinaid 
        AND va.lote_id = l.id
        AND va.data_vacinacao > :inicio
        AND va.data_vacinacao < :termino
        GROUP BY v.nome;`, 
        { replacements: { inicio: inicio, termino: termino }, type: QueryTypes.SELECT });
  
        return objs;
    }

    // Implementando as regras de negócio relacionadas ao processo de negócio Empréstimo
    // Regra de Negócio 1: O funcionário só poderá vacinar um lote de animais por dia.
    // Regra de Negócio 2: Verifica se a data da última vacinação, sendo que se tiver menos de 3 meses, não será permitido vacinar o animal
    static async verificarRegrasDeNegocio(req) {
        const { dataVacinacao, lote, funcionario, galpao } = req.body;

        const animais = await GalpaoService.animaisPorGalpao(galpao);

        if (animais.length == 0) {
            throw "Deve existir, pelo menos, um animal selecionado!";
        }

        // Regra de Negócio 1: Será validado se a média de peso do lote de animais está acima de 250 kg.
        const lotesVacinadosNoDia = await FuncionarioService.getLotesVacinadosNoDia(dataVacinacao)
        console.log(lotesVacinadosNoDia)
        if (lotesVacinadosNoDia.length > 1) {
            throw "O funcionário já vacinou um lote hoje";
        }

        // Regra de Negócio 2: Verifica se a data da última vacinação, sendo que se tiver menos de 3 meses, não será permitido vacinar o animal

        for (let animal of animais) {
            animal = await Animal.findByPk(animal.id, { include: { all: true, nested: true } })
            let mesesQueFoiVacinado = this.getMeses(animal.dataVacinacao)

            if (mesesQueFoiVacinado < 3) {
                throw `O animal ${animal.nome} possui já foi vacinado a menos de 3 meses`;
            }
        }

        return true;
    }

    static getMeses(data) {
        let dataAtual = new Date()
        data = new Date(data)

        return (dataAtual.getMonth() - data.getMonth()) + (12 * (dataAtual.getFullYear() - data.getFullYear()));
    }
}

export { VacinacaoService };