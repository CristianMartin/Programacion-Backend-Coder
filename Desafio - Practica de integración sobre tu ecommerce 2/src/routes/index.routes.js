import { Router } from 'express';
import userRouter from './users.routes.js';
import prodsRouter from './products.routes.js';
import cartRouter from './cart.routes.js';
import sessionRouter from './session.routes.js';
import viewRoutes from './views.routes.js';

const router = Router();

router.use('/', viewRoutes);
router.use('/api/users', userRouter);
router.use('/api/products', prodsRouter);
router.use('/api/carts', cartRouter);
router.use('/api/session', sessionRouter);

export default router;