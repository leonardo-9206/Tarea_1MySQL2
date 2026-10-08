import { Router } from 'express';
import { ProductController } from '../controllers/products.controller.ts';

const productController = new ProductController();
const router = Router();

//route definitions (Clean REST endpoints - No verbs in URLs)
//GET /api/v1/products - Get all active products
router.get('/', (req, res) => productController.getAll(req, res));

//GET /api/v1/products/:id - Get active product by ID
router.get('/:id', (req, res) => productController.getById(req, res));

//POST /api/v1/products - Create a new product
router.post('/', (req, res) => productController.create(req, res));

//PUT /api/v1/products/:id - Update complete product details
router.put('/:id', (req, res) => productController.update(req, res));

//DELETE /api/v1/products/:id - Soft-delete product
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

//PATCH /api/v1/products/:id/price - Modify product price only
router.patch('/:id/price', (req, res) => productController.changePrice(req, res));
export default router;