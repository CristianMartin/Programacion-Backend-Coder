import { userModel } from "../models/user.models.js";
import CustomError from "../service/errors/CustomError.js";
import { dataNotFound, idNotFound } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();

        if (users) {
            res.status(200).send({ respuesta: 'OK', mensaje: users });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error usuarios no encontrados', cause: dataNotFound('usuarios'), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en consultar usuario', cause: idNotFound(id), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const putUser = async (req, res, next) => {
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password });

        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en actualizar usuario', cause: idNotFound(id), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        }
        else {
            CustomError.generateError({ status: 404, name: 'Error en eliminar usuario', cause: idNotFound(id), code: Errors.MISSING_DATA});
        }
    } catch (error) {
        next(error);
    }
}