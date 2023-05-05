import { CaminhaoService } from "../services/CaminhaoService.js";

class CaminhaoController {
  
  static async findAll(req, res, next) {
    CaminhaoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    CaminhaoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    CaminhaoService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    CaminhaoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    CaminhaoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }
}

export { CaminhaoController };