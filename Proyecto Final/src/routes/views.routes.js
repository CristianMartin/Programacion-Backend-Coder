import express, { Router } from "express";
import { homeView, productsView, realTimeProductsView, chatView,
     loginView, registerView, profileView, cartView } from "../controllers/views.controller.js";
import { passportError, authorization } from '../middleware/messageError.js';
import path from 'path';
import { __dirname } from '../path.js';

const viewsRouter = Router();

viewsRouter.use('/', express.static(path.join(__dirname, '/public')));

viewsRouter.get('/', homeView);
viewsRouter.get('/all', productsView);
viewsRouter.get('/realTimeProducts', passportError('jwt'), authorization('admin'), realTimeProductsView);
viewsRouter.get('/chat', chatView);
viewsRouter.get('/login', loginView);
viewsRouter.get('/register', registerView);
viewsRouter.get('/profile', passportError('jwt'), profileView);
viewsRouter.get('/cart', cartView);

export default viewsRouter;