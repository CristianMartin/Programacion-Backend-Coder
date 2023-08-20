import express from 'express';
import prodsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const PORT = 8081;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/products', prodsRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
    res.send("¡Bienvenido a la primera pre-entrega de proyecto final!");
})

app.listen(PORT, () => {
    console.log(`Server en el puerto ${PORT}`);
})