import { Router } from 'express';
import productsRoutes from './products.routes.ts';

const router = Router();

//mount products routes under /products
router.use('/products', productsRoutes);

export default router;