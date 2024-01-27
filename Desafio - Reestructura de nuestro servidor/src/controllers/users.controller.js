import { userModel } from "../models/user.models.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        if (users)
            res.status(200).send({ respuesta: 'OK', mensaje: users });
        else
            res.status(404).send({ respuesta: 'Error usuarios no encontrados', mensaje: 'Not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en consultar usuarios', mensaje: error });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (user) 
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        else 
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en consultar usuario', mensaje: error });
    }
}

export const putUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password });

        if (user) 
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        else 
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' });
        
    } catch (error) {
        res.status(500).send({ respuesta: 'Error en actualizar usuario', mensaje: error });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if (user) 
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        else 
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' });
        
    } catch (error) {
        res.status(500).send({ respuesta: 'Error en eliminar usuario', mensaje: error });
    }
}