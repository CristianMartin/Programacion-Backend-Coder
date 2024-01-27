import { productModel } from "../models/products.models.js";

export const homeView = async (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "Home",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user
    });
}

export const productsView = async (req, res) => {
    res.render('home', {
        css: "style.css",
        title: "All Products",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user
    });
}

export const realTimeProductsView = async (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "RealTimeProducts",
        js: "realTimeProducts.js",
        login: req.session.login,
        user: req.session.user
    });
}

export const chatView = async (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "chat.js",
        login: req.session.login,
        user: req.session.user
    });
}

export const loginView = async (req, res) => {
    res.render('login', {
        title: "Login",
        css: "style.css",
        js: "login.js"
    });
}

export const registerView = async (req, res) => {
    res.render('register', {
        title: "Register",
        css: "style.css",
        js: "register.js"
    });
}