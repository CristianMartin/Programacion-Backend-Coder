import express, { Router } from "express";
import { homeView, productsView, realTimeProductsView, chatView, loginView, registerView, profileView } from "../controllers/views.controller.js";
import { passportError, authorization } from '../middleware/messageError.js';
import path from 'path';
import { __dirname } from '../path.js';

const viewsRouter = Router();

viewsRouter.use('/', express.static(path.join(__dirname, '/public')));

viewsRouter.get('/', homeView);
viewsRouter.get('/all', productsView);
viewsRouter.get('/realTimeProducts', passportError('jwt'), authorization('admin'), realTimeProductsView);
viewsRouter.get('/chat', passportError('jwt'), authorization('user'), chatView);
viewsRouter.get('/login', loginView);
viewsRouter.get('/register', registerView);
viewsRouter.get('/profile', passportError('jwt'), profileView);


export default viewsRouter;