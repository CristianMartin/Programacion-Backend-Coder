import express, { Router } from "express";
import { productModel } from "../models/products.models.js";
import path from 'path';
import { __dirname } from '../path.js';

const prodsRouter = Router();

prodsRouter.use('/all', express.static(path.join(__dirname, '/public')));
prodsRouter.use('/realTimeProducts', express.static(path.join(__dirname, '/public')));

prodsRouter.get('/all', async (req, res) => {
    res.render('home', {
        css: "home.css",
        title: "All Products",
        js: "home.js",
        products: await productModel.find()
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
        products: await productModel.find()
    })
})

prodsRouter.get('/', async (req, res) => {
    const { query, limit, page, sort } = req.query

    try {
        const prods = await productModel.paginate(query ?? {}, { limit: limit ?? 10, page: page ?? 1, sort: { price: sort ?? '' } })
        
        res.status(200).send({ respuesta: 'OK', mensaje: prods })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar productos', mensaje: error })
    }
})

prodsRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findById(id)
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: prod })
        else
            res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta producto', mensaje: error })
    }
})

prodsRouter.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category })
        res.status(200).send({ respuesta: 'OK', mensaje: prod })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear productos', mensaje: error })
    }
})

prodsRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, stock, status, code, price, category } = req.body

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category })
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' })
        else
            res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error })
    }
})

prodsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' })
        else
            res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error })
    }
})

export default prodsRouter;