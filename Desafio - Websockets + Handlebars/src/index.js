import express from 'express';
import multer from 'multer';
import prodsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import path from 'path';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './models/ProductManager.js';

const PORT = 8081;
const app = express();

//Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

const serverExpress = app.listen(PORT, () => {
    console.log(`Server en el puerto ${PORT}`);
})

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: storage });
app.use('/static', express.static(path.join(__dirname, '/public')));
app.engine('handlebars', engine());//Definicion de motor de plantillas a usar y su config
app.set('view engine', 'handlebars');//Setting de handlebars
app.set('views', path.resolve(__dirname, './views'));//Rutas de mis vistas

//Server de Socket.io
const io = new Server(serverExpress);
const productManager = new ProductManager('./productos.json');
io.on('connection', (socket) => {
    console.log('Servidor Socket.io conectado');

    socket.on('nuevoProducto', async (nuevoProd) => {
        await productManager.addProduct(nuevoProd);
        socket.emit('prods', await productManager.getProducts());
    })
})

//Routes
app.use('/api/products', prodsRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
    res.send("¡Bienvenido al Desafio - Websockets + Handlebars!");
})

app.post('/upload', upload.single('product'),(req, res) => {
    res.status(200).send("¡Imagen cargada!");
});