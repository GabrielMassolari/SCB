import express from "express";

import { AnimalController } from './controllers/AnimalController.js';
import { GalpaoController } from "./controllers/GalpaoController.js";
import { LoteController } from './controllers/LoteController.js';
import { VacinaController } from './controllers/VacinaController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { CaminhaoController } from './controllers/CaminhaoController.js';
import { FuncionarioController } from './controllers/FuncionarioController.js';
import { EntradaController } from "./controllers/EntradaController.js";
import { VacinacaoController } from "./controllers/VacinacaoController.js";
import { VendaService } from "./services/VendaService.js";
import { VendaController } from "./controllers/VendaController.js";


const routes = express.Router();

routes.get('/animais', AnimalController.findAll);
routes.get('/animais/:id', AnimalController.findByPk);
routes.post('/animais', AnimalController.create);
routes.put('/animais/:id', AnimalController.update);
routes.delete('/animais/:id', AnimalController.delete);

routes.get('/galpoes', GalpaoController.findAll);
routes.get('/galpoes/:id', GalpaoController.findByPk);
routes.post('/galpoes', GalpaoController.create);
routes.put('/galpoes/:id', GalpaoController.update);
routes.delete('/galpoes/:id', GalpaoController.delete);

routes.get('/lotes', LoteController.findAll);
routes.get('/lotes/:id', LoteController.findByPk);
routes.post('/lotes', LoteController.create);
routes.put('/lotes/:id', LoteController.update);
routes.delete('/lotes/:id', LoteController.delete);

routes.get('/vacinas', VacinaController.findAll);
routes.get('/vacinas/:id', VacinaController.findByPk);
routes.post('/vacinas', VacinaController.create);
routes.put('/vacinas/:id', VacinaController.update);
routes.delete('/vacinas/:id', VacinaController.delete);

routes.get('/clientes', ClienteController.findAll);
routes.get('/clientes/:id', ClienteController.findByPk);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.delete);

routes.get('/caminhoes', CaminhaoController.findAll);
routes.get('/caminhoes/:id', CaminhaoController.findByPk);
routes.post('/caminhoes', CaminhaoController.create);
routes.put('/caminhoes/:id', CaminhaoController.update);
routes.delete('/caminhoes/:id', CaminhaoController.delete);

routes.get('/funcionarios', FuncionarioController.findAll);
routes.get('/funcionarios/:id', FuncionarioController.findByPk);
routes.post('/funcionarios', FuncionarioController.create);
routes.put('/funcionarios/:id', FuncionarioController.update);
routes.delete('/funcionarios/:id', FuncionarioController.delete);

routes.get('/entradas', EntradaController.findAll);
routes.get('/entradas/:id', EntradaController.findByPk);
routes.post('/entradas', EntradaController.create);
routes.put('/entradas/:id', EntradaController.update);
routes.delete('/entradas/:id', EntradaController.delete);

routes.get('/vacinacoes', VacinacaoController.findAll);
routes.get('/vacinacoes/:id', VacinacaoController.findByPk);
routes.post('/vacinacoes', VacinacaoController.create);
routes.put('/vacinacoes/:id', VacinacaoController.update);
routes.delete('/vacinacoes/:id', VacinacaoController.delete);

routes.get('/vendas', VendaController.findAll);
routes.get('/vendas/:id', VendaController.findByPk);
routes.post('/vendas', VendaController.create);
routes.put('/vendas/:id', VendaController.update);
routes.delete('/vendas/:id', VendaController.delete);

export default routes;