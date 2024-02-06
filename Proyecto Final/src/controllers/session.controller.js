import { generateToken } from "../utils/jwt.js";
import CustomError from "../service/errors/CustomError.js";
import { invalidUser, existingUser } from '../service/errors/generateInfoError.js';
import { Errors } from "../service/errors/errors.js";

export const login = async(req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    try {
        if(!req.user) {
            CustomError.generateError({statusCode: 401, name: `Usuario invalido`, cause: invalidUser(), code: Errors.INVALID_TYPES_ERROR});
            req.logger.error(`Error loguear usuario, usuario invalido`);
        }

        req.session.login = true;
        req.session.admin = req.user.rol == 'admin';

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            cart: req.user.cart
        }

        const token = generateToken(req.user);

        res.cookie('jwtCookie', token, {
            maxAge: 1*24*60*60*1000,
            signed: true,
            httpOnly: true
        });

        res.status(200).send({mensaje: 'Usuario logueado', payload: req.user });
    } catch (error) {
        next(error);
    }
}

export const register = async(req, res, next) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    try {

        if(!req.user) {
            CustomError.generateError({statusCode: 401, name: `Usuario ya existe`, cause: existingUser(), code: Errors.INVALID_TYPES_ERROR});
            req.logger.error(`Error loguear usuario, el usuario ya existe`);
        }

        res.status(200).send({ mensaje: 'Usuario registrado' });
    } catch (error) {
        next(error);
    }
}

export const github = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.status(200).send({mensaje: 'Usuario registrado'});
}

export const githubCallback = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    req.session.login = true;
    req.session.user = req.user;
    res.status(200).send({mensaje: 'Usuario logueado'});
}

export const current = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.send(req.user);
}

export const logout = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.clearCookie('jwtCookie');
    res.status(200).send({ resultado: 'Usuario deslogueado'});
}