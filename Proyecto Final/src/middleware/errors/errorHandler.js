import CustomError from "../../service/errors/CustomError.js";
import { Errors } from "../../service/errors/errors.js";

export default (error, req, res, next) => {
    req.logger.info(`Error: ${error}`);
    switch (error.code){
        case Errors.ROUTING_ERROR:
            res.status(error.status).send({ respuesta: 'Error de ruteo', mensaje: error });
            break;
        case Errors.INVALID_TYPES_ERROR:
            res.status(error.status).send({ respuesta: 'Error de tipos', mensaje: error });
            break;
        case Errors.DATABASE_ERROR:
            res.status(error.status).send({ respuesta: 'Error de base de datos', mensaje: error });
            break;
        case Errors.MISSING_DATA:
            res.status(error.status).send({ respuesta: 'Error de datos', mensaje: error });
            break;
        default:
            try {
                CustomError.generateError({});
            } catch (err){
                req.logger.fatal(`Error fatal: ${err}`);
                res.status(err.status).send({ respuesta: 'Unhandled error', mensaje: err });
            }
    }
}