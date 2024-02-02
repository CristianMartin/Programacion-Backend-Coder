import { Router } from "express";
import { login, register, github, githubCallback, current, logout } from "../controllers/session.controller.js";
import passport from "passport";
import { passportError, authorization } from '../middleware/messageError.js';

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), login);
sessionRouter.post('/register', passport.authenticate('register'), register);
sessionRouter.get('/github', passport.authenticate('github', { scope:['user:email']}), github);
sessionRouter.get('/githubCallback', passport.authenticate('github'), githubCallback);
sessionRouter.get('/current', passportError('jwt'), authorization('admin'), current);
sessionRouter.get('/logout', logout);

export default sessionRouter;