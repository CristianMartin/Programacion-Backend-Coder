import { Router } from "express";
import ProductManager from '../models/ProductManager.js';

const prodsRouter = Router();
const productManager = new ProductManager('./productos.json');

prodsRouter.get('/all', async (req, res) => {
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