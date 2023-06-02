import { LoteService } from "../services/LoteService.js";

class LoteController {

    static async findAll(req, res, next) {
        LoteService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        LoteService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        LoteService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next) {
        LoteService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        LoteService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async getLotesProximosVencer(req, res, next) {
        LoteService.getLotesProximosVencer(req)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { LoteController };