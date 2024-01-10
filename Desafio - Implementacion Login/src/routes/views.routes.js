import express, { Router } from "express";
import path from 'path';
import { __dirname } from '../path.js';
import { productModel } from "../models/products.models.js";

const viewsRouter = Router();

viewsRouter.use('/', express.static(path.join(__dirname, '/public')));

viewsRouter.get('/', async (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "Home",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user
    })
})

viewsRouter.get('/all', async (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "All Products",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user
    })
})

viewsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "RealTimeProducts",
        js: "realTimeProducts.js",
        login: req.session.login,
        user: req.session.user
    })
})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "chat.js",
        login: req.session.login,
        user: req.session.user
    })
})

viewsRouter.get('/login', async (req, res) => {
    res.render('login', {
        title: "Login",
        css: "style.css",
        js: "login.js"
    })
})

viewsRouter.get('/register', async (req, res) => {
    res.render('register', {
        title: "Register",
        css: "style.css",
        js: "register.js"
    })
})


export default viewsRouter;