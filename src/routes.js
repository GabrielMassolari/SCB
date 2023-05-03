import express from "express";

import { AnimalController } from './controllers/AnimalController.js';
import { GalpaoController } from "./controllers/GalpaoController.js";

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

export default routes;