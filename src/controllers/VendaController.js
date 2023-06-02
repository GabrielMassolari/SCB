import { VendaService } from "../services/VendaService.js";

class VendaController {

    static async findAll(req, res, next) {
        VendaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        VendaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        VendaService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next) {
        VendaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        VendaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async getTotalVendasPorCliente(req, res, next) {
        VendaService.getTotalVendasPorCliente(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async getMediaPesoAnimaisVendidos(req, res, next) {
        VendaService.getMediaPesoAnimaisVendidos(req)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { VendaController };