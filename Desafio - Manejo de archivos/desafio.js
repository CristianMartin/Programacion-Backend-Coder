import {promises as fs} from 'fs';

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
            console.log(`¡El producto con code: ${product.code}, ya existe!`)
        } else {
            prods.push(product);
            await fs.writeFile(this.path, JSON.stringify(prods));
        } 
    }

    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        prods? console.log(prods) : console.log("¡No hay productos!"); 
    }

    async getProductById(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prod = prods.find(prod => prod.id === id); 
        prod? console.log(prod) : console.log("¡Producto no encontrado!");
    }

    async updateProduct(id, product) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const index = prods.findIndex(prod => prod.id === id); 
        prod? console.log(prod) : console.log("¡Producto no encontrado!");
    }
}

const AcerNitro = new Product("Notebook Acer Nitro", "Notebook gamer Acer Nitro 32gb 1TB", 500000, "AP5000NT", 50, "./assets/Acer-Nitro.jpg");
const AsusTuf4080 = new Product("RTX 4080 Asus Tuf", "Placa de video RTX 4080 Asus Tuf 16gb", 960000, "AT4080PV", 15, "./assets/Asus-tuf-4080.jpg");
const GigabyteRX6900 = new Product("Gigabyte Radeon RX 6900 XT", "Placa de Video Gigabyte Radeon RX 6900 XT Gaming OC 16GB", 338600, "GB6900PV", 20, "./assets/Radeon-RX-6900-XT.jpg");

const productManager = new ProductManager('./productos.json');

productManager.addProduct(AcerNitro);
productManager.addProduct(AsusTuf4080);
productManager.addProduct(GigabyteRX6900);
productManager.addProduct(AcerNitro); //prueba agregar producto que ya existe

productManager.getProducts();

productManager.getProductById(3);
productManager.getProductById(4); //prueba buscar un producto con un id que no existe