import { Router } from "express";
import { passportError, authorization } from '../utils/messageError.js';
import { getCart, postCart, putCart, deleteCart, postProductsInCart, putProductsInCart, deleteProductsInCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get('/:id', getCart);
cartRouter.post('/', passportError('jwt'), authorization('admin'), postCart);
cartRouter.put('/:cid', passportError('jwt'), authorization('admin'), putCart);
cartRouter.delete('/:cid', passportError('jwt'), authorization('admin'), deleteCart);
cartRouter.post('/:cid/products/:pid', postProductsInCart);
cartRouter.put('/:cid/products/:pid', putProductsInCart);
cartRouter.delete('/:cid/products/:pid', deleteProductsInCart);

export default cartRouter;