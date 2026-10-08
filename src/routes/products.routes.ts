import { Router } from 'express';
import { ProductController } from '../controllers/products.controller.ts';

const productController = new ProductController();
const router = Router();

// RESTful Route definitions (Clean REST endpoints - No verbs in URLs)
// 1. GET /api/v1/products - Get all active products
router.get('/', (req, res) => productController.getAll(req, res));

// 2. GET /api/v1/products/:id - Get active product by ID
router.get('/:id', (req, res) => productController.getById(req, res));

// 3. POST /api/v1/products - Create a new product
router.post('/', (req, res) => productController.create(req, res));

// 4. PUT /api/v1/products/:id - Update complete product details
router.put('/:id', (req, res) => productController.update(req, res));

// 5. DELETE /api/v1/products/:id - Soft-delete product
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

// 6. PATCH /api/v1/products/:id/price - Modify product price only
router.patch('/:id/price', (req, res) => productController.changePrice(req, res));

export default router;