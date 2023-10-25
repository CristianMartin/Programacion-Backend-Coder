import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import userRouter from './routes/users.routes.js';
import prodsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productModel } from "./models/products.models.js";

const PORT = 8081;
const app = express();

mongoose.connect(process.env.MONGO_URL)
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
app.use(cookieParser(process.env.SIGNED_COOKIE));
/* app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})); */
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: storage });
app.use('/static', express.static(path.join(__dirname, '/public')));
app.engine('handlebars', engine());//Definicion de motor de plantillas a usar y su config
app.set('view engine', 'handlebars');//Setting de handlebars
app.set('views', path.resolve(__dirname, './views'));//Rutas de mis vistas

//Server de Socket.io
let mensajes = [];
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
app.use('/api/carts', cartRouter);

app.get('/static', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat",
        js: "script.js"
    })
})

app.get('/', (req, res) => {
    res.send("¡Bienvenido al Desafio - Segunda pre-entrega!");
})

app.post('/upload', upload.single('product'),(req, res) => {
    res.status(200).send("¡Imagen cargada!");
});

app.get('/setCookie', (req, res) => {
    res.cookie('Cookie', 'Cookie de prueba', { maxAge: 5000, signed: true }).send('Cookie generada')
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})