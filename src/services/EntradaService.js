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

    // Regra de Negócio 1: Será verificado se o galpão já atingiu o limite diário de recebimento de animais
    const animaisRecebidosNoDia = await GalpaoService.animalsReceivedCount(galpao, dataEntrada);
    let galpaoT = await Galpao.findByPk(galpao, { include: { all: true, nested: true } })

    if (animaisRecebidosNoDia['COUNT(*)'] > galpaoT.limiteDiario) {
      throw "Este galpão já atingiu o limite diario";
    }

    // Regra de Negócio 2: Verifica se a idade do animal está próximo da média de animais que estão no galpão (a idade do animal pode ter uma variação de 6 meses em relação a média de idade dos animais contidos no galpão)
  
    const mediaAnimais = await GalpaoService.mediaIdadeGalpao(galpao);

    for(let animal of animais) {
        animal = await Animal.findByPk(animal.id, { include: { all: true, nested: true } })
        let idade = this.getIdade(animal.dataNascimento)
        if(mediaAnimais['media'] == null) {
        }
        else if(idade > (mediaAnimais['media'] + 3)) {
            throw `O animal ${animal.nome} possui mais de 3 anos de diferença da média de idade do galpao id ${galpao}`;
        }else if(idade < (mediaAnimais['media'] - 3)){
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