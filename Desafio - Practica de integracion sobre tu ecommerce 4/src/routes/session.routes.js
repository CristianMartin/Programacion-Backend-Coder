import { Router } from "express";
import { userModel } from "../models/user.models.js";

const sessionRouter = Router();

sessionRouter.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        if(req.session.login) {
           return res.status(200).send({resultado: 'Login ya existente'});
        }
        
        const user = await userModel.findOne({ email: email });

        if(user) {
            if(user.password == password) {
                req.session.login = true;
                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name
                }

                user.last_connection = new Date().toLocaleDateString();

                await userModel.updateOne({email: user.email}, user)
                
                res.status(200).send({ resultado: 'Login valido', message: user });
            } else {
                res.status(401).send({ resultado: 'Usuario no valido'});
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user });
        }

    } catch(error) {
        res.status(400).send({error: `Error en Login: ${error}`});
    }
});

sessionRouter.get('/logout', (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.status(200).send({ resultado: 'Usuario deslogueado'});
});

export default sessionRouter;