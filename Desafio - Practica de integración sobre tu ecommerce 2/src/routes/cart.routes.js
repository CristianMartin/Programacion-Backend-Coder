import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router()

cartRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const cart = await cartModel.findById(id)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
})

cartRouter.post('/', async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Produt Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart Not Found' })
        }

    } catch (error) {
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
})

cartRouter.put('/:cid', async(req, res)=>{
    const { cid } = req.params
    const productsToReplace = req.body

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products: productsToReplace}}) 

        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito actualizado' })
        else
            res.status(404).send({ respuesta: 'Error al actualizar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al actualizar carrito', mensaje: error })
    }
})

cartRouter.put('/:cid/products/:pid', async(req, res)=>{
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        
        if (cart) {
            const prod = await productModel.findById(pid)
            
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)

                if (indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    res.status(404).send({ respuesta: 'Error en actualizar el producto en el carrito', mensaje: 'Product Not Found in Cart' })
                }

                const respuesta = await cartModel.findByIdAndUpdate(cid, cart)

                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en actualizar el producto en el carrito', mensaje: 'Product Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar el producto en el carrito', mensaje: 'Cart Not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar el producto en el carrito', mensaje: error })
    }

})

cartRouter.delete('/:cid', async(req, res)=>{
    const { cid } = req.params

    try{
        const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products: []}})

        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: 'productos del carrito eliminado' })
        else
            res.status(404).send({ respuesta: 'Error al eliminar los productos del carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al eliminar los productos del carrito', mensaje: error })
    }

})

cartRouter.delete('/:cid/products/:pid', async(req, res)=>{
    const { cid, pid } = req.params

    try{
        const cart = await cartModel.findById(cid)

        if (cart) {
            const prod = await productModel.findById(pid)

            if (prod) {
                let products = cart.products.filter(prod => prod.id_prod._id.toString() != pid)
        
                let respuesta = await cartModel.updateOne({ _id: cid }, {$set: {products: products}}) 
                
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en eliminar el producto del Carrito', mensaje: 'Product Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar el producto del Carrito', mensaje: 'Cart Not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al eliminar el producto del Carrito', mensaje: error })
    }

})

export default cartRouter