import passport from "passport";

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) {
                return next(error);
            }

            if(!user) {
                req.logger.error(`Usuario no autorizado`);
                return res.status(401).send({error: info.message? info.message : info.toString()});
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}

export const authorization = (rol) => {
    return async (req, res, next) => {
        if(!req.user) {
            req.logger.error(`Usuario no autorizado`);
            return res.status(401).send({error: 'User no autorizado'});
        }

        if(req.user.user.rol != rol) {
            req.logger.error(`Usuario sin permisos necesarios`);
            return res.status(403).send({error: 'Usuario no tiene los permisos necesarios'});
        }
        next();
    }
}