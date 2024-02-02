import { Router } from "express";
import { getMockingProducts } from '../controllers/mockingproducts.controller.js';

const mockingRouter = Router();

mockingRouter.get("/mockingproducts", getMockingProducts); 

export default mockingRouter;