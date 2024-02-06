import { ticketsModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { sendEmail } from "../service/mailer.js";
import { ticketTemplate } from "../utils/templates.js";
import CustomError from "../service/errors/CustomError.js";
import { dataNotFound, idNotFound, outOfStock } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const getTickets = async(req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    try {
        const tickets = await ticketsModel.find();

        if (tickets) {
            res.status(200).send({ respuesta: 'OK', tickets: tickets });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en consultar tickets', cause: dataNotFound('tickets'), code: Errors.MISSING_DATA});
            req.logger.warning(`Error en consultar tickets, tickets no encontrados en la base de datos`);
        }
    } catch(error) {
        next(error);
    }
}

export const getTicket = async(req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { tid } = req.params;

    try {

        const ticket = await ticketsModel.findById(tid);

        if (ticket) {
            res.status(200).send({ respuesta: 'OK', ticket: ticket });
        }
        else {
            CustomError.generateError({status: 404, name: `No existe ticket con id ${tid}`, cause: idNotFound(tid), code: Errors.INVALID_TYPES_ERROR});
            req.logger.warning(`Error No existe ticket con id ${tid}`);
        }
    } catch (error) {
        next(error);
    }
}

export const postTicket = async(req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    const { cid } = req.params;
    
    try {
        const cart = await cartModel.findById(cid);
        const cartProducts = cart.products;
        let total = 0;

        for (let i = 0; i < cartProducts.length; i++) {
            const product = cartProducts[i];
            const dbProduct = await productModel.findById(product.id_prod);
            if (product.quantity <= dbProduct.stock) {
                total += product.quantity * dbProduct.price;
                dbProduct.stock = dbProduct.stock - product.quantity;
                await productModel.findByIdAndUpdate(product.id_prod._id, dbProduct);
            } else {
                CustomError.generateError({ status: 400, name: `No hay stock del producto ${product.id_prod.title}`, cause: outOfStock(), code: Errors.MISSING_DATA});
                req.logger.error(`No hay stock del producto ${product.id_prod.title}`);
            }
        }

        cart.products = [];
        await cartModel.findByIdAndUpdate(cid, cart);

        const date = new Date(Date.now()).toUTCString();
        const code = crypto.randomUUID();
        const userEmail = req.user.user.email;
        
        await ticketsModel.create({ code, purchase_datetime: date, amount: total, purchaser: userEmail });

        sendEmail(userEmail, '¡Ticket de compra exitosa!', ticketTemplate(total, code));

        res.status(200).send({ message: `Compra realizada por un total de $${total}, ticket: ${code}` });

    } catch(error) {
        next(error);
    }
}
