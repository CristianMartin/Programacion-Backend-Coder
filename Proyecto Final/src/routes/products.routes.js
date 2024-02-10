import { Router } from "express";
import { getProducts, getProduct, postProduct, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { passportError, authorization } from '../middleware/messageError.js';

const prodsRouter = Router();

prodsRouter.get('/', getProducts);
prodsRouter.get('/:id', getProduct);
prodsRouter.post('/', passportError('jwt'), authorization('admin'), postProduct);
prodsRouter.put('/:id', passportError('jwt'), authorization('admin'), putProduct);
prodsRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteProduct);

export default prodsRouter;