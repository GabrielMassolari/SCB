import { VacinacaoService } from "../services/VacinacaoService.js";

class VacinacaoController {
  
  static async findAll(req, res, next) {
    VacinacaoService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    VacinacaoService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) { 
    VacinacaoService.create(req)
          .then(obj => res.json(obj))
          .catch(next);
  }

  static async update(req, res, next) {
    VacinacaoService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    VacinacaoService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

}

export { VacinacaoController };