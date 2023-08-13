import {promises as fs} from 'fs';
import express from 'express';

class Product {
    constructor(title, description, price, code, stock, thumbnail) {
        this.id = Product.newId();
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.thumbnail = thumbnail;
    }
    
    static newId = () => { 
        this.lastId? this.lastId++ : this.lastId = 1;
        return this.lastId;
    };
}

class ProductManager {

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
        if(index != -1) {
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

const productManager = new ProductManager('./productos.json');
const PORT = 8081;
const app = express();

app.get('/', (req, res) => {
    res.send("¡Bienvenido al desafío de Servidor con express!");
})

app.get('/products', async (req, res) => {
    const { limit } = req.query
    const prods = await productManager.getProducts();
    limit? res.send(prods.slice(0, limit)) : res.send(prods);
})

app.get('/products/:id', async (req, res) => res.send(await productManager.getProductById(parseInt(req.params.id))));

app.listen(PORT, () => {
    console.log(`Server en el puerto ${PORT}`);
})