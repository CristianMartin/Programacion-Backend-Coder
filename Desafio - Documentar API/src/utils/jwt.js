import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    /*
        1° parametro: Objeto asociado al token
        2° parametro: Clave privada para el cifrado
        3° parametro: TTL
    */
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.Authorization

    if(!authHeader) {
        return res.status(401).send({error: 'Usuario no autenticado'});
    }

    const token = authHeader.split(' ')[1];

    jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
        if(error) {
            return res.status(403).send({error: 'Usuario no autorizado, token invalido'});
        }
    })

    req.user = credential.user

    next();
}