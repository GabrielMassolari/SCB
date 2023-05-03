import { GalpaoService } from "../services/GalpaoService.js";

class GalpaoController {
  
  static async findAll(req, res, next) {
    GalpaoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    GalpaoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    GalpaoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    GalpaoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    GalpaoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }
}

export { GalpaoController };