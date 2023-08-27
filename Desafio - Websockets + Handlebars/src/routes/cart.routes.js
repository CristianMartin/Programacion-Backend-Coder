import { Router } from "express";
import CartManager from '../models/CartManager';

const cartRouter = Router();
const cartManager = new CartManager('../carts.json');

cartManager.post("/", async (req, res) => {
    const { products } = req.body;
    res.status(201).json(await cartManager.addCart(products));
});
  
cartManager.get("/:cid", async (req, res) => res.send(await cartManager.getCartById(req.params.cid)));
  
cartManager.post("/:cid/product/:pid", async (req, res) => await res.send(cartManager.addProductToCart(req.params.cid, req.params.pid, req.body.quantity)));

export default cartRouter;