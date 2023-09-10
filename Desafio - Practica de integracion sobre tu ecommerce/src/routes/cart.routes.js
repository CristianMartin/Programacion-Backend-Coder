import { Router } from "express";
import CartManager from '../models/CartManager.js';

const cartRouter = Router();
const cartManager = new CartManager('./carts.json');

cartRouter.post("/", async (req, res) => {
    const { products } = req.body;
    res.status(201).json(await cartManager.addCart(products));
});
  
cartRouter.get("/:cid", async (req, res) => res.send(await cartManager.getCartById(req.params.cid)));
  
cartRouter.post("/:cid/product/:pid", async (req, res) => res.send(await cartManager.addProductToCart(req.params.cid, req.params.pid, req.body.quantity)));

export default cartRouter;