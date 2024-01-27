import { generateToken } from "../utils/jwt.js";

export const login = async(req, res) => {
    try {
        if(!req.user) {
            return res.status(401).send({ mensaje: 'Usuario invalido'});
        }

        req.session.login = true;
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        const token = generateToken(req.user);

        res.cookie('jwtCookie', token, {
            maxAge: 43200000,
            signed: true
        });

        res.status(200).send({ payload: req.user });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}`});
    }
}

export const register = async(req, res) => {
    try {

        if(!req.user) {
            return res.status(401).send({ mensaje: 'Usuario ya existe'});
        }

        res.status(200).send({ mensaje: 'Usuario registrado' });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}`});
    }
}

export const github = async (req, res) => {
    res.status(200).send({mensaje: 'Usuario registrado'});
}

export const githubCallback = async (req, res) => {
    req.session.login = true;
    req.session.user = req.user;
    res.status(200).send({mensaje: 'Usuario logueado'});
}

export const current = async (req, res) => {
    res.send(req.user);
}

export const logout = async (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.clearCookie('jwtCookie');
    res.status(200).send({ resultado: 'Usuario deslogueado'});
}