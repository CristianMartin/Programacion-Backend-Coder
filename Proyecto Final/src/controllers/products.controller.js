import { productModel } from '../models/products.models.js';
import CustomError from "../service/errors/CustomError.js";
import { dataNotFound, idNotFound, failCreateInDB } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const getProducts = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { query, limit, page, sort } = req.query;

    const sortInt = sort? parseInt(sort): 1;

    try {
        const prods = await productModel.paginate(query ?? {}, { limit: limit ?? 10, page: page ?? 1, sort: { price: sortInt } });

        if (prods) {
            res.status(200).send({ respuesta: 'OK', mensaje: prods });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error productos no encontrados', cause: dataNotFound('producto'), code: Errors.MISSING_DATA});
            req.logger.warning(`Productos no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { id } = req.params;

    try {
        const prod = await productModel.findById(id);

        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: prod });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error producto no encontrados', cause: idNotFound(id), code: Errors.MISSING_DATA});
            req.logger.warning(`Producto con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const postProduct = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { title, description, stock, code, price, category } = req.body;
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category });

        if (prod) {
            res.status(201).send({ respuesta: 'OK', mensaje: prod });
        }
        else {
            CustomError.generateError({ status: 400, name: 'Error en crear producto', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
            req.logger.error(`Error al crear el producto`);
        }
    } catch (error) {
        try {
            if (error.code == 11000) { //llave duplicada code:11000
                CustomError.generateError({ status: 400, name: 'Producto ya creado', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
                req.logger.error(`Error al crear el producto, producto ya creado`);
            }
        } catch (error) {
            next(error);
        }
        next(error);
    }
}

export const putProduct = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { id } = req.params;
    const { title, description, stock, status, code, price, category } = req.body;

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category });
        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en actualizar Producto', cause: idNotFound(id), code: Errors.MISSING_DATA});
            req.logger.warning(`Error al actualizar el producto, producto con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { id } = req.params;

    try {
        const prod = await productModel.findByIdAndDelete(id);

        if (prod) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en eliminar producto', cause: idNotFound(id), code: Errors.MISSING_DATA});
            req.logger.warning(`Error al eliminar el producto, producto con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}