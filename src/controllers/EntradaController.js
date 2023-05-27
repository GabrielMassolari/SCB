import { EntradaService } from "../services/EntradaService.js";

class EntradaController {

  static async findAll(req, res, next) {
    EntradaService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    EntradaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    EntradaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    EntradaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    EntradaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { EntradaController };