import { productModel } from '../models/products.models.js';
import CustomError from "../service/errors/CustomError.js";
import { dataNotFound, idNotFound } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const getProducts = async (req, res, next) => {
    const { query, limit, page, sort } = req.query;

    try {
        const prods = await productModel.paginate(query ?? {}, { limit: limit ?? 10, page: page ?? 1, sort: { price: sort ?? '' } });

        if (prods) {
            res.status(200).send({ respuesta: 'OK', mensaje: prods });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error productos no encontrados', cause: dataNotFound('producto'), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findById(id);

        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: prod });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error productos no encontrados', cause: idNotFound(id), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const postProduct = async (req, res, next) => {
    const { title, description, stock, code, price, category } = req.body;
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category });

        if (prod) {
            res.status(201).send({ respuesta: 'OK', mensaje: prod });
        }
        else {
            CustomError.generateError({ status: 400, name: 'Error en crear producto', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
        }
    } catch (error) {
        if (error.code == 11000) { //llave duplicada code:11000
            CustomError.generateError({ status: 400, name: 'Producto ya creado', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
        }
        next(next);
    }
}

export const putProduct = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, stock, status, code, price, category } = req.body;

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category });
        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en actualizar Producto', cause: dataNotFound('producto'), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findByIdAndDelete(id);

        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en eliminar producto', cause: dataNotFound('producto'), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}