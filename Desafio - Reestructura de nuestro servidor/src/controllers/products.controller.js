import { productModel } from '../models/products.models.js';

export const getProducts = async (req, res) => {
    const { query, limit, page, sort } = req.query;

    try {
        const prods = await productModel.paginate(query ?? {}, { limit: limit ?? 10, page: page ?? 1, sort: { price: sort ?? '' } });

        if (prods)
            res.status(200).send({ respuesta: 'OK', mensaje: prods });
        else
            res.status(404).send({ respuesta: 'Error productos no encontrados', mensaje: 'Not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en consultar productos', mensaje: error });
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findById(id);

        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: prod });
        else 
            res.status(404).send({ respuesta: 'Error productos no encontrados', mensaje: 'Not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en consulta producto', mensaje: error });
    }
}

export const postProduct = async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category });

        if (prod) 
            res.status(201).send({ respuesta: 'OK', mensaje: prod });
        else
            res.status(400).send({ respuesta: 'Error en crear producto'});

    } catch (error) {
        if (error.code == 11000) { //llave duplicada code:11000
            res.status(400).send({ respuesta: 'Producto ya creado'});
        }
        res.status(500).send({ respuesta: 'Error en crear producto', mensaje: error });
    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, stock, status, code, price, category } = req.body;

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category });
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' });
        else
            res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en actualizar producto', mensaje: error });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findByIdAndDelete(id);

        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
        else
            res.status(404).send({ respuesta: 'Error en eliminar producto', mensaje: 'Not Found' });

    } catch (error) {
        res.status(500).send({ respuesta: 'Error en eliminar producto', mensaje: error })
    }
}