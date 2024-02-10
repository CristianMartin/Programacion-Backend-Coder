import "dotenv/config";
import express from "express";
import router from "./routes/index.routes.js";
import multer from "multer";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productModel } from "./models/products.models.js";
import compression from "express-compression";
import errorHandler from "./middleware/errors/errorHandler.js";
import { addLogger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const PORT = 3000;
const app = express();

const swaggerOptions = {
  definition: {
      openapi: '3.1.0',
      info: {
          title: "Documentacion del curso de backend en nodejs",
          description: "Api backend de un ecommerce",
          version: "1.0.0"
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("BDD conectada");
  })
  .catch(() => console.log("Error en conexion a BDD"));

//Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const serverExpress = app.listen(PORT, () => {
  console.log(`Server en el puerto ${PORT}`);
});

//Middleware
app.use(express.json());
app.use(addLogger);
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: storage });
app.engine("handlebars", engine()); //Definicion de motor de plantillas a usar y su config
app.set("view engine", "handlebars"); //Setting de handlebars
app.set("views", path.resolve(__dirname, "./views")); //Rutas de mis vistas
//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Server de Socket.io
let mensajes = [];
const io = new Server(serverExpress);
io.on("connection", (socket) => {
  console.log("Servidor Socket.io conectado");

  socket.on("nuevoProducto", async (nuevoProd) => {
    await productModel.create({ ...nuevoProd });
    socket.emit("prods", await productModel.find());
  });

  socket.on("eliminarProducto", async (idProdToDelete) => {
    await productModel.findByIdAndDelete(idProdToDelete);
    socket.emit("prods", await productModel.find());
  });

  socket.on("mensaje", (infoMensaje) => {
    mensajes.push(infoMensaje);
    socket.emit("mensajes", mensajes);
  });
});

//Routes
app.use("/", router);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(errorHandler);

app.post("/upload", upload.single("product"), (req, res) => {
  res.status(200).send("¡Imagen cargada!");
});

app.get('/loggerTest', (req, res) => {
  req.logger.fatal("Logger Fatal");
  req.logger.error("Logger Error");
  req.logger.warning("Logger Warning");
  req.logger.info("Logger Info");
  req.logger.http("Logger HTTP");
  req.logger.debug("Logger Debug");

  res.send({status: "Ok", message: "LoggerTest completo!"});
})