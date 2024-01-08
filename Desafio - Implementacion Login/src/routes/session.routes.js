import express, { Router } from "express";
import path from 'path';
import { __dirname } from '../path.js';
import { userModel } from "../models/user.models.js";

const sessionRouter = Router();

sessionRouter.use('/loginPage', express.static(path.join(__dirname, '/public')));

sessionRouter.get('/loginPage', async (req, res) => {
    res.render('login', {
        title: "Login",
        css: "style.css",
        js: "login.js"
    })
})

sessionRouter.get('/registerPage', async (req, res) => {
    console.log(req.session.req)
    res.render('login', {
        title: "Login",
        css: "style.css",
        js: "login.js"
    })
})

sessionRouter.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        if(req.session.login) {
           return res.status(200).send({resultado: 'Login ya existente'});
        }
        
        const user = await userModel.findOne({ email: email });

        if(user) {
            if(user.password == password) {
                req.session.login = true;
                res.status(200).send({ resultado: 'Login valido', message: user });
            } else {
                res.status(401).send({ resultado: 'Usuario no valido'});
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user });
        }

    } catch(error) {
        res.status(400).send({error: `Error en Login: ${error}`});
    }
});

sessionRouter.get('/logout', (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.status(200).send({ resultado: 'Usuario deslogueado'});
});

export default sessionRouter;