import { promises as fs } from 'fs';

export default class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prod = prods.find(prod => prod.code === product.code);
        if (prod) {
            return `¡El producto con code: ${product.code}, ya existe!`;
        } else {
            prods.push(product);
            await fs.writeFile(this.path, JSON.stringify(prods));
        }
    }

    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return prods? prods : "¡No hay productos!";
    }

    async getProductById(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prod = prods.find(prod => prod.id === id);
        return prod? prod : "¡Producto no encontrado!";
    }

    async updateProduct(id, product) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const index = prods.findIndex(prod => prod.id === id);
        if(index !== -1) {
            prods[index].title = product.title;
            prods[index].description = product.description;
            prods[index].price = product.price;
            prods[index].code = product.code;
            prods[index].stock = product.stock;
            prods[index].thumbnail = product.thumbnail;
            await fs.writeFile(this.path, JSON.stringify(prods));
        } else {
            return "¡Producto no encontrado!";
        }
    }

    async delete(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prod = prods.find(prod => prod.id === id);
        
        if(prod) {
            await fs.writeFile(this.path, JSON.stringify(prods.filter(product => product.id != id)));
        } else {
            return `¡No existe el producto con id: ${id}!`;
        }
    }
}