import { promises as fs } from "fs";
import Cart from "./Cart";

export default class CartManager {

    constructor(path) {
        this.path = path
    }

    async addCart(products = []) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const cart = new Cart(products);
        carts.push(cart);
        await fs.writeFile(this.path, JSON.stringify(carts));

        return cart;
    }

    async getCartById(id) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const cart = carts.find(cart => cart.id === id);
        return cart? cart : "¡Carrito no encontrado!";
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex !== -1) {
            const productIndex = carts[cartIndex].products.find(product => product.id === productId);

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
                carts[cartIndex].products.push({
                    id: productId,
                    quantity: quantity,
                });
            }

            await fs.writeFile(this.path, JSON.stringify(carts));
        } else {
            return "¡Carrito no encontrado!";
        }
    }
}