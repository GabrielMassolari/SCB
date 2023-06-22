import { Entrada } from "../models/Entrada.js";
import { GalpaoService } from "./GalpaoService.js";

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';
import { Animal } from "../models/Animal.js";
import { Galpao } from "../models/Galpao.js";

class EntradaService {

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
    const { dataEntrada, galpao, funcionario, animais } = req.body;
    if (await this.verificarRegrasDeNegocio(req)) {
      const t = await sequelize.transaction();
      const obj = await Entrada.create({ dataEntrada, galpaoId: galpao, funcionarioId: funcionario }, { transaction: t });
      try {
        await Promise.all(animais.map(async item => (await Animal.findByPk(item.id)).update({ entradaId: obj.id }, { transaction: t })));
        await t.commit();
        return await Entrada.findByPk(obj.id, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw "Pelo menos um dos animais informadas não foi encontrada!";
      }
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { dataEntrada, galpao, funcionario, animais } = req.body;
    const t = await sequelize.transaction();
    const obj = await Entrada.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Entrada não encontrado!';
    Object.assign(obj, { dataEntrada, galpaoId: galpao, funcionarioId: funcionario });
    await obj.save({ transaction: t });

    return await Entrada.findByPk(obj.id, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Entrada.findByPk(id);
    if (obj == null) throw 'Entrada não encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover a entrada";
    }
  }

  static async getMediaEntradaAnimais(req) {
    const { inicio, termino } = req.params;

    const objs = await sequelize.query(`SELECT g.nome, AVG(total_animais) AS media_diaria
      FROM (
        SELECT g.nome as nome, COUNT(*) AS total_animais
        FROM animais a,
        entradas e,
        galpoes g
        WHERE e.galpao_id = g.id
        AND e.id = a.entrada_id
        AND e.data_entrada >= :inicio 
        AND e.data_entrada <= :termino
        GROUP BY g.nome
      ) AS subquery
      JOIN galpoes AS g ON g.nome = subquery.nome
      GROUP BY g.nome;`, 
      { replacements: { inicio: inicio, termino: termino }, type: QueryTypes.SELECT });

      return objs;
  }

  static async getTotalAnimaisMesAtual() {
    // const objs = await sequelize.query(`
    // SELECT COUNT(*) AS total_animais
    // FROM animais AS a
    // JOIN entradas AS e ON e.id = a.entrada_id
    // WHERE strftime('%Y-%m', e.data_entrada) = strftime('%Y-%m', 'now');`, 
    // { type: QueryTypes.SELECT });

    const objs = await sequelize.query(`
    SELECT COUNT(*) AS total_animais
    FROM animais AS a
    JOIN entradas AS e ON e.id = a.entrada_id
    WHERE to_char(e.data_entrada, 'YYYY-MM') = to_char(current_date, 'YYYY-MM');`, 
    { type: QueryTypes.SELECT });

    console.log(objs)

    return objs;
  }


  // Implementando as regras de negócio relacionadas ao processo de negócio Empréstimo
  // Regra de Negócio 1: Será verificado se o galpão já atingiu o limite diário de recebimento de animais
  // Regra de Negócio 2: Verifica se a idade do animal está próximo da média de animais que estão no galpão (a idade do animal pode ter uma variação de 6 meses em relação a média de idade dos animais contidos no galpão)
  static async verificarRegrasDeNegocio(req) {
    const { dataEntrada, galpao, funcionario, animais } = req.body;

    if (animais.length == 0) {
      throw "Deve existir, pelo menos, um animal selecionado!";
    }

    // Regra de Negócio 1: Será verificado se o galpão já atingiu o limite diário de recebimento de animais
    const animaisRecebidosNoDia = await GalpaoService.animalsReceivedCount(galpao, dataEntrada);
    let galpaoT = await Galpao.findByPk(galpao, { include: { all: true, nested: true } })

    if (animaisRecebidosNoDia['COUNT(*)'] > galpaoT.limiteDiario || animais.length > galpaoT.limiteDiario) {
      throw "Este galpão já atingiu o limite diario";
    }

    // Regra de Negócio 2: Verifica se a idade do animal está próximo da média de animais que estão no galpão (a idade do animal pode ter uma variação de 6 meses em relação a média de idade dos animais contidos no galpão)

    const mediaAnimais = await GalpaoService.mediaIdadeGalpao(galpao);

    for (let animal of animais) {
      animal = await Animal.findByPk(animal.id, { include: { all: true, nested: true } })
      let idade = this.getIdade(animal.dataNascimento)
      if (mediaAnimais['media'] == null) {
      }
      else if (idade > (mediaAnimais['media'] + 3)) {
        throw `O animal ${animal.nome} possui mais de 3 anos de diferença da média de idade do galpao id ${galpao}`;
      } else if (idade < (mediaAnimais['media'] - 3)) {
        throw `O animal ${animal.nome} possui menos de 3 anos de diferença da média de idade do galpao id ${galpao}`;
      }
    }

    return true;
  }

  static getIdade(data) {
    let dataAtual = new Date()
    data = new Date(data)

    return (dataAtual.getFullYear() - data.getFullYear());
  }
}

export { EntradaService };