import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import CustomError from "../service/errors/CustomError.js";
import { dataNotFound, idNotFound, failCreateInDB } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const getCart = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);

    const { id } = req.params;

    try {
        const cart = await cartModel.findById(id);
        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: cart });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error carrito no encontrado', cause: idNotFound(id), code: Errors.MISSING_DATA});
            req.logger.warning(`Carrito con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const postCart = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    try {
        const cart = await cartModel.create({});

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: cart });
        }
        else {
            CustomError.generateError({ status: 400, name: 'Error en crear carrito', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
            req.logger.error(`Error al crear el carrito`);
        }
    } catch (error) {
        try {
            if (error.code == 11000) { //llave duplicada code:11000
                CustomError.generateError({ status: 400, name: 'Error carrito ya creado', cause: failCreateInDB(), code: Errors.DATABASE_ERROR});
                req.logger.error(`Error al crear el carrito, carrito ya creado`);
            }
        } catch (error) {
            next(error);
        }
        next(error);
    }
}

export const putCart = async(req, res, next)=> {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid } = req.params;
    const productsToReplace = req.body;

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products: productsToReplace}});

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito actualizado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error al actualizar Carrito', cause: idNotFound(cid), code: Errors.MISSING_DATA});
            req.logger.warning(`Error al actualizar el carrito, carrito con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const deleteCart = async(req, res, next)=>{
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid } = req.params;

    try{
        const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products: []}});

        if (cart) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'productos del carrito eliminado' });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error al eliminar los productos del carrito', cause: idNotFound(cid), code: Errors.MISSING_DATA});
            req.logger.warning(`Error al eliminar el carrito, carrito con id ${id} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const postProductsInCart = async (req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod == pid);
                
                if (indice != -1) {
                    cart.products[indice].quantity = quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }

                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });

            } else {
                CustomError.generateError({ status: 404, name: 'Error en agregar el producto en el carrito, producto no encontrado', cause: idNotFound(pid), code: Errors.MISSING_DATA});
                req.logger.warning(`Error al agregar el producto al carrito, producto con id ${pid} no encontrado en la base de datos`);
            }
        } else {
            CustomError.generateError({ status: 404, name: 'Error en agregar el producto en el carrito, carrito no encontrado', cause: idNotFound(cid), code: Errors.MISSING_DATA});
            req.logger.warning(`Error al agregar el producto al carrito, carrito con id ${cid} no encontrado en la base de datos`);
        }

    } catch (error) {
        next(error);
    }
}

export const putProductsInCart = async(req, res, next)=>{
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        
        if (cart) {
            const prod = await productModel.findById(pid);
            
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid);

                if (indice != -1) {
                    cart.products[indice].quantity = quantity;
                } else {
                    CustomError.generateError({ status: 404, name: 'Error en actualizar el producto en el carrito, producto no encontrado en el carrito', cause: dataNotFound('producto'), code: Errors.MISSING_DATA});
                    req.logger.warning(`Error en actualizar el producto en el carrito, producto no encontrado en el carrito`);
                }

                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);

                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                CustomError.generateError({ status: 404, name: 'Error en actualizar el producto en el carrito, producto no encontrado', cause: idNotFound(pid), code: Errors.MISSING_DATA});
                req.logger.warning(`Error en actualizar el producto en el carrito, producto con id ${pid} no encontrado en la base de datos`);
            }
        } else {
            CustomError.generateError({ status: 404, name: 'Error en actualizar el producto en el carrito, carrito no encontrado', cause: idNotFound(cid), code: Errors.MISSING_DATA});
            req.logger.warning(`Error en actualizar el producto en el carrito, carrito con id ${cid} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}

export const deleteProductsInCart = async(req, res, next)=>{
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid, pid } = req.params;

    try{
        const cart = await cartModel.findById(cid);

        if (cart) {
            const prod = await productModel.findById(pid);

            if (prod) {
                let products = cart.products.filter(prod => prod.id_prod._id.toString() != pid);
        
                let respuesta = await cartModel.updateOne({ _id: cid }, {$set: {products: products}});
                
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
            } else {
                CustomError.generateError({ status: 404, name: 'Error en eliminar el producto del Carrito, producto no encontrado', cause: idNotFound(pid), code: Errors.MISSING_DATA});
                req.logger.warning(`Error en eliminar el producto del Carrito, producto con id ${cid} no encontrado en la base de datos`);
            }
        } else {
            CustomError.generateError({ status: 404, name: 'Error en eliminar el producto del Carrito, carrito no encontrado', cause: idNotFound(cid), code: Errors.MISSING_DATA});
            req.logger.warning(`Error en eliminar el producto del Carrito, carrito con id ${cid} no encontrado en la base de datos`);
        }
    } catch (error) {
        next(error);
    }
}