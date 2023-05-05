import { VacinaService } from "../services/VacinaService.js";

class VacinaController {

    static async findAll(req, res, next) {
        VacinaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        VacinaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        VacinaService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next) {
        VacinaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        VacinaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { VacinaController };