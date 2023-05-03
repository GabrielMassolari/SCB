import { AnimalService } from "../services/AnimalService.js";

class AnimalController {
  
  static async findAll(req, res, next) {
    AnimalService.findAll()
        .then(objs => res.json(objs))
        .catch(next);
  }

  static async findByPk(req, res, next) {
    AnimalService.findByPk(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async create(req, res, next) {
    AnimalService.create(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async update(req, res, next) {
    AnimalService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
  }

  static async delete(req, res, next) {
    AnimalService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
  }
}

export { AnimalController };