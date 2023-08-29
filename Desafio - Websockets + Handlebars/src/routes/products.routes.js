import express, { Router } from "express";
import path from 'path';
import ProductManager from '../models/ProductManager.js';
import { __dirname } from '../path.js';

const prodsRouter = Router();
const productManager = new ProductManager('./productos.json');

prodsRouter.use('/all', express.static(path.join(__dirname, '/public')));
prodsRouter.use('/realTimeProducts', express.static(path.join(__dirname, '/public')));

prodsRouter.get('/all', async (req, res) => {
    res.render('home', {
        css: "home.css",
        title: "All Products",
        js: "home.js",
        products: await productManager.getProducts()
    })
})

prodsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "RealTimeProducts",
        js: "realTimeProducts.js"
    })
})

prodsRouter.get('/realTimeProducts', async (req, res) => {
    res.render('home', {
        title: "All Products",
        products: await productManager.getProducts()
    })
})

prodsRouter.get('/', async (req, res) => {
    const { limit } = req.query
    const prods = await productManager.getProducts();
    limit? res.send(prods.slice(0, limit)) : res.send(prods);
})

prodsRouter.get('/:id', async (req, res) => res.send(await productManager.getProductById(parseInt(req.params.id))));

prodsRouter.post("/", async (req, res) => res.send(await productManager.addProduct(req.body)));
  
prodsRouter.put("/:id", async (req, res) => res.send(await productManager.updateProduct(parseInt(req.params.id), req.body)));
  
prodsRouter.delete("/:id", async (req, res) => res.send(await productManager.delete(parseInt(req.params.id))));

export default prodsRouter;