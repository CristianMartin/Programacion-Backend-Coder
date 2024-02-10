import { productModel } from "../models/products.models.js";
import { cartModel } from "../models/carts.models.js";

export const homeView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('home', {
        css: "style.css",
        title: "Home",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin
    });
}

export const productsView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('home', {
        css: "style.css",
        title: "All Products",
        js: "home.js",
        products: await productModel.find().lean(),
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin
    });
}

export const realTimeProductsView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('realTimeProducts', {
        css: "style.css",
        title: "RealTimeProducts",
        js: "realTimeProducts.js",
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin
    });
}

export const chatView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "chat.js",
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin
    });
}

export const loginView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('login', {
        title: "Login",
        css: "style.css",
        js: "login.js",
        admin: req.session.admin
    });
}

export const registerView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('register', {
        title: "Register",
        css: "style.css",
        js: "register.js",
        admin: req.session.admin
    });
}

export const profileView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('profile', {
        title: "Profile",
        css: "style.css",
        js: "profile.js",
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin
    });
}

export const cartView = async (req, res) => {
    req.logger.http(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`);

    let cart;
    let totalCost = 0;
    if(req.session.user) {
        cart = (await cartModel.findById(req.session.user.cart).lean()).products;
        totalCost = cart.reduce((acc, product) => { return product.quantity * product.id_prod.price + acc }, 0);
    }

    res.render('cart', {
        title: "Cart",
        css: "style.css",
        js: "cart.js",
        login: req.session.login,
        user: req.session.user,
        admin: req.session.admin,
        totalCost: totalCost,
        cartProducts: cart
    });
}
