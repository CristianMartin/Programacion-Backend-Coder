import express, { Router } from "express";
import { homeView, productsView, realTimeProductsView, chatView, loginView, registerView } from "../controllers/views.controller.js";
import path from 'path';
import { __dirname } from '../path.js';

const viewsRouter = Router();

viewsRouter.use('/', express.static(path.join(__dirname, '/public')));

viewsRouter.get('/', homeView);
viewsRouter.get('/all', productsView);
viewsRouter.get('/realTimeProducts', realTimeProductsView);
viewsRouter.get('/chat', chatView);
viewsRouter.get('/login', loginView);
viewsRouter.get('/register', registerView);

export default viewsRouter;