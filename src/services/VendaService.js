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
        const objs = await Venda.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Venda.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const { distanciaEntrega, dataVenda, preco, cliente, caminhao, galpao } = req.body;

        const animais = await GalpaoService.animaisPorGalpao(galpao);
        const kmRodados = await this.quilometrosRodadosMesAtual(cliente);
        let precoFrete = preco;
        console.log(kmRodados)

        if (await this.verificarRegrasDeNegocio(req)) {
            if (kmRodados['soma'] <= 1000) {
                //10% taxa de frete
                precoFrete = preco * 1.10;
            }
            const t = await sequelize.transaction();
            const obj = await Venda.create({ distanciaEntrega, dataVenda, preco: precoFrete, clienteId: cliente, caminhaoId: caminhao }, { transaction: t });
            try {
                await Promise.all(animais.map(async item => (await ItemDeVenda.create({ vendaId: obj.id, animalId: item.id }, { transaction: t }))));
                await t.commit();
                return await Venda.findByPk(obj.id, { include: { all: true, nested: true } });
            } catch (error) {
                await t.rollback();
                throw "Pelo menos um dos animais informadas não foi encontrada!" + error;
            }
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { distanciaEntrega, dataVenda, preco, cliente, caminhao, animais } = req.body;
        const obj = await Venda.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Venda não encontrado!';
        Object.assign(obj, { distanciaEntrega, dataVenda, preco, cliente, caminhao, animais });
        await obj.save();
        return await Venda.findByPk(obj.id, { include: { all: true, nested: true } });
    }

    static async delete(req) {
        const { id } = req.params;
        const obj = await Venda.findByPk(id);
        if (obj == null) throw 'Venda não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch (error) {
            throw "Não é possível remover a venda";
        }
    }

    static async getTotalVendasPorCliente(req) {
        const { inicio, termino } = req.params;

        const objs = await sequelize.query(`
        SELECT c.nome, SUM(v.preco) as valor_total
        FROM clientes c,
        vendas v
        WHERE v.cliente_id = c.id
        AND v.data_venda > :inicio
        AND v.data_venda < :termino
        GROUP BY c.nome;`, 
        { replacements: { inicio: inicio, termino: termino }, type: QueryTypes.SELECT });
  
        return objs;
    }

    

    static async getMediaPesoAnimaisVendidos(req) {
        const { inicio, termino } = req.params;

        // const objs = await sequelize.query(`
        // SELECT strftime('%Y-%m', v.data_venda), AVG(a.peso)
        // FROM animais a,
        // vendas v,
        // itemDeVenda iv
        // WHERE v.id = iv.venda_id
        // AND iv.animal_id = a.id
        // AND v.data_venda > :inicio
        // AND v.data_venda < :termino
        // GROUP BY strftime('%Y-%m', v.data_venda);`, 
        // { replacements: { inicio: inicio, termino: termino }, type: QueryTypes.SELECT });

        
        const objs = await sequelize.query(`
        SELECT to_char(v.data_venda, 'YYYY-MM') as data, AVG(a.peso) as media_peso
        FROM animais a
        INNER JOIN itemDeVenda iv ON iv.animal_id = a.id
        INNER JOIN vendas v ON v.id = iv.venda_id
        WHERE v.data_venda > :inicio
        AND v.data_venda < :termino
        GROUP BY to_char(v.data_venda, 'YYYY-MM');`, 
        { replacements: { inicio: inicio, termino: termino }, type: QueryTypes.SELECT })
  
        return objs;
    }

    // Implementando as regras de negócio relacionadas ao processo de negócio Empréstimo
    // Regra de Negócio 1: Será verificado se o galpão já atingiu o limite diário de recebimento de animais
    // Regra de Negócio 2: Verifica se a idade do animal está próximo da média de animais que estão no galpão (a idade do animal pode ter uma variação de 6 meses em relação a média de idade dos animais contidos no galpão)
    static async verificarRegrasDeNegocio(req) {
        const { dataEntrada, galpao, funcionario } = req.body;

        const animais = await GalpaoService.animaisPorGalpao(galpao);

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
        //const sql = "SELECT SUM(distancia_entrega) as soma FROM vendas WHERE strftime('%m', date('now')) = strftime('%m', data_venda) AND strftime('%Y', date('now')) = strftime('%Y', data_venda) and cliente_id = :clienteId;"
        const sql = "SELECT SUM(distancia_entrega) as soma FROM vendas WHERE EXTRACT(MONTH FROM current_date) = EXTRACT(MONTH FROM data_venda) AND EXTRACT(YEAR FROM current_date) = EXTRACT(YEAR FROM data_venda) AND cliente_id = :clienteId;"
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