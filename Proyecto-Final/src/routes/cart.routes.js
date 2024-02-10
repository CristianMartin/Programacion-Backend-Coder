import { Router } from "express";
import { passportError, authorization } from '../middleware/messageError.js';
import { getCart, postCart, putCart, deleteCart, postProductsInCart, putProductsInCart, deleteProductsInCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get('/:id', getCart);
cartRouter.post('/', passportError('jwt'), authorization('admin'), postCart);
cartRouter.put('/:cid', passportError('jwt'), authorization('admin'), putCart);
cartRouter.delete('/:cid', passportError('jwt'), deleteCart);
cartRouter.post('/:cid/product/:pid', passportError('jwt'), authorization('user'), postProductsInCart);
cartRouter.put('/:cid/product/:pid', passportError('jwt'), authorization('user'), putProductsInCart);
cartRouter.delete('/:cid/product/:pid', passportError('jwt'), authorization('user'), deleteProductsInCart);

export default cartRouter;