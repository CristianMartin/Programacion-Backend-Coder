import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import userRouter from './routes/users.routes.js';
import prodsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import path from 'path';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productModel } from "./models/products.models.js";

const PORT = 8081;
const app = express();

mongoose.connect('mongodb+srv://cristian:password@cluster0.t2t0gid.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))

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
io.on('connection', (socket) => {
    console.log('Servidor Socket.io conectado');

    socket.on('nuevoProducto', async (nuevoProd) => {
        await productModel.create(...nuevoProd);
        socket.emit('prods', await productModel.find());
    })

    socket.on('eliminarProducto', async (idProdToDelete) => {
        await productModel.findByIdAndDelete(idProdToDelete);
        socket.emit('prods', await productModel.find());
    })

    socket.on('mensaje', (infoMensaje) => {
        mensajes.push(infoMensaje)
        socket.emit('mensajes', mensajes)
    })
})

//Routes
app.use('/api/users', userRouter);
app.use('/api/products', prodsRouter);
app.use('/api/cart', cartRouter);

app.get('/static', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "script.js"
    })
})

app.get('/', (req, res) => {
    res.send("¡Bienvenido al Desafio - Websockets + Handlebars!");
})

app.post('/upload', upload.single('product'),(req, res) => {
    res.status(200).send("¡Imagen cargada!");
});
