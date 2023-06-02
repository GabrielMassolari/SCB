import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Animal } from '../models/Animal.js';
import { Caminhao } from '../models/Caminhao.js';
import { Cliente } from '../models/Cliente.js';
import { Entrada } from '../models/Entrada.js';
import { Funcionario } from '../models/Funcionario.js';
import { Galpao } from '../models/Galpao.js';
import { ItemDeVenda } from '../models/ItemDeVenda.js';
import { Venda } from '../models/Venda.js';
import * as fs from 'fs';
import { Vacina } from '../models/Vacina.js';
import { Lote } from '../models/Lote.js';
import { Vacinacao } from '../models/Vacinacao.js';

const sequelize = new Sequelize(databaseConfig);

Animal.init(sequelize);
Caminhao.init(sequelize);
Cliente.init(sequelize);
Funcionario.init(sequelize);
Entrada.init(sequelize);
Galpao.init(sequelize);
ItemDeVenda.init(sequelize);
Venda.init(sequelize);
Vacina.init(sequelize);
Lote.init(sequelize);
Vacinacao.init(sequelize)

// A ordem das efetivações das associações importa: neste exemplo, Uf.associate antes de Cidade.associate deixa foreignKey: { allowNull: true } poder ser null
Cliente.associate(sequelize.models);
Caminhao.associate(sequelize.models);
Galpao.associate(sequelize.models);
Funcionario.associate(sequelize.models);
Cliente.associate(sequelize.models);
Animal.associate(sequelize.models);
Entrada.associate(sequelize.models);
ItemDeVenda.associate(sequelize.models);
Venda.associate(sequelize.models);
Vacina.associate(sequelize.models);
Lote.associate(sequelize.models);
Vacinacao.associate(sequelize.models)

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        await sequelize.sync({ force: true });
        const animal1 = await Animal.create({ nome: "Caracu", peso: 450.00, dataNascimento: "2000-02-10", dataVacinacao: "2003-03-08" });
        const animal2 = await Animal.create({ nome: "Brangus", peso: 320.00, dataNascimento: "1998-05-11", dataVacinacao: "2000-02-10" });
        const animal3 = await Animal.create({ nome: "Nelore", peso: 140.00, dataNascimento: "2001-03-20", dataVacinacao: "2005-08-11" });
        const animal4 = await Animal.create({ nome: "Angus", peso: 90.00, dataNascimento: "2019-08-07", dataVacinacao: "2023-03-20" });

        const galpao1 = await Galpao.create({nome: "Galpao 1", capacidade: 100, limiteDiario: 10, maternidade: false});
        const galpao2 = await Galpao.create({nome: "Galpao 2", capacidade: 110, limiteDiario: 15, maternidade: false});
        const galpao3 = await Galpao.create({nome: "Galpao 3", capacidade: 120, limiteDiario: 20, maternidade: true});
        const galpao4 = await Galpao.create({nome: "Galpao 4", capacidade: 130, limiteDiario: 2, maternidade: false});

        const funcionario1 = await Funcionario.create({ nome: "Jose", cpf: "111.111.111-99", dataNascimento: "2000-02-10", salario: 2000 })
        const funcionario2= await Funcionario.create({ nome: "Diogo", cpf: "111.111.111-22", dataNascimento: "2000-05-10", salario: 3000 })
        const funcionario3 = await Funcionario.create({ nome: "Joao P", cpf: "111.111.111-33", dataNascimento: "2000-05-13'", salario: 4000 })
        const funcionario4 = await Funcionario.create({ nome: "Sebastiao", cpf: "111.111.111-44", dataNascimento: "2000-12-10", salario: 1000 })

        const entrada1 = await Entrada.create({ dataEntrada: "2023-06-14", galpaoId: 1, funcionarioId: 1 });
        const entrada2 = await Entrada.create({ dataEntrada: "2023-06-14", galpaoId: 2, funcionarioId: 2 });
        const entrada3 = await Entrada.create({ dataEntrada: "2023-06-14", galpaoId: 3, funcionarioId: 3 });
        const entrada4 = await Entrada.create({ dataEntrada: "2023-04-14", galpaoId: 4, funcionarioId: 4 });

        animal1.update({galpaoId: 1, entradaId: 1})
        animal2.update({galpaoId: 2, entradaId: 2})
        animal3.update({galpaoId: 3, entradaId: 3})
        animal4.update({galpaoId: 4, entradaId: 4})

        const cliente1 = await Cliente.create({ nome: "João", email: "joao@gmail.com", cpf: "333.333.333-33", dataNascimento: "2000-02-10" });
        const cliente2 = await Cliente.create({ nome: "Vitor", email: "vitor@hotmail.com", cpf: "123.543.223-33", dataNascimento: "1998-05-11" });
        const cliente3 = await Cliente.create({ nome: "Jose", email: "jose@gmail.com", cpf: "543.332.313-73", dataNascimento: "2001-08-07" });
        const cliente4 = await Cliente.create({ nome: "Vinicius", email: "vinicius@hotmail.com", cpf: "678.873.332-12", dataNascimento: "1990-08-02" });

        const caminhao1 = await Caminhao.create({ modelo: "Truck", ano: 2001, marca: "VW", quilometragem: 200000.0 });
        const caminhao2 = await Caminhao.create({ modelo: "caminhao2", ano: 2020, marca: "Fiat", quilometragem: 120000.0 });
        const caminhao3 = await Caminhao.create({ modelo: "caminhao3", ano: 2002, marca: "Ford", quilometragem: 150000.0 });
        const caminhao4 = await Caminhao.create({ modelo: "caminhao4", ano: 2015, marca: "Hyundai", quilometragem: 80000.0 });

        const venda1 = await Venda.create({ distanciaEntrega: 20, dataVenda: "2023-05-10", preco: 2000, clienteId: cliente1.id, caminhaoId: caminhao1.id });
        const venda2 = await Venda.create({ distanciaEntrega: 50, dataVenda: "2023-05-10", preco: 3000, clienteId: cliente2.id, caminhaoId: caminhao2.id });
        const venda3 = await Venda.create({ distanciaEntrega: 65, dataVenda: "2022-05-10", preco: 1000, clienteId: cliente3.id, caminhaoId: caminhao3.id });
        const venda4 = await Venda.create({ distanciaEntrega: 1200, dataVenda: "2023-05-10", preco:200, clienteId: cliente4.id, caminhaoId: caminhao4.id });

        const itemDeVenda1 = await ItemDeVenda.create({ animalId: animal1.id, vendaId: venda1.id });
        const itemDeVenda2 = await ItemDeVenda.create({ animalId: animal2.id, vendaId: venda2.id });
        const itemDeVenda3 = await ItemDeVenda.create({ animalId: animal3.id, vendaId: venda3.id });
        const itemDeVenda4 = await ItemDeVenda.create({ animalId: animal4.id, vendaId: venda4.id });

        const vacina1 = await Vacina.create({ nome: 'Raiva' });
        const vacina2 = await Vacina.create({ nome: 'Raiva2' });
        const vacina3 = await Vacina.create({ nome: 'Raiva3' });
        const vacina4 = await Vacina.create({ nome: 'Raiva4' });

        const lote1 = await Lote.create({lote: 'teste1', quantidadeDoses: 100, dataVencimento: '2023-05-10', vacinaid: 1});

        const vacinacao1 = await Vacinacao.create({dataVacinacao: '2023-01-01', funcionarioId: 1, loteId: 1, animalId: 1})
        const vacinacao2 = await Vacinacao.create({dataVacinacao: '2023-01-01', funcionarioId: 1, loteId: 1, animalId: 2})
        const vacinacao3 = await Vacinacao.create({dataVacinacao: '2023-01-01', funcionarioId: 1, loteId: 1, animalId: 3})
        const vacinacao4 = await Vacinacao.create({dataVacinacao: '2023-01-01', funcionarioId: 1, loteId: 1, animalId: 4})
    })();
}

export default sequelize;
