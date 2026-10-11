import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { Server } from '../src/server.ts';
import routes from '../src/routes/index.ts';

// Create a server instance for testing without listening on a network port
const server = new Server({ port: 3000, routes });
const app = server.getApp();

describe('Products API Integration Tests with Vitest & Supertest', () => {
  let createdProductId: number;

  // 1. GET /api/v1/products - Fetch all active products
  it('GET /api/v1/products - should return 200 and an array of active products', async () => {
    const response = await request(app).get('/api/v1/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // 2. GET /api/v1/products/:id - Fetch active product by ID
  it('GET /api/v1/products/:id - should return 200 and product object', async () => {
    // Fetch all active products first to get a known active ID
    const allResponse = await request(app).get('/api/v1/products');
    const firstActiveProduct = allResponse.body[0];

    const response = await request(app).get(`/api/v1/products/${firstActiveProduct.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(firstActiveProduct.id);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
  });

  // 3. POST /api/v1/products - Create a new product
  it('POST /api/v1/products - should return 201 and created product id', async () => {
    const newProduct = {
      name: 'Vitest Automated Test Product',
      price: 199.99,
      stock: 50,
      description: 'Product created during Vitest & Supertest automated test suite',
      brand: 'Vitest Lab',
      img: 'https://example.com/test-product.jpg',
    };

    const response = await request(app)
      .post('/api/v1/products')
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('Product created successfully');

    createdProductId = response.body.id;
    expect(typeof createdProductId).toBe('number');
  });

  // 4. PUT /api/v1/products/:id - Update product details
  it('PUT /api/v1/products/:id - should update product and return 200', async () => {
    const updatedData = {
      name: 'Vitest Automated Test Product (Updated)',
      price: 249.99,
      stock: 45,
      description: 'Updated product description via automated test',
      brand: 'Vitest Lab Pro',
      img: 'https://example.com/test-product-updated.jpg',
    };

    const response = await request(app)
      .put(`/api/v1/products/${createdProductId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product updated successfully');
  });

  // 5. PATCH /api/v1/products/:id/price - Change price only
  it('PATCH /api/v1/products/:id/price - should update price and return 200', async () => {
    const response = await request(app)
      .patch(`/api/v1/products/${createdProductId}/price`)
      .send({ price: 299.99 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product price updated successfully');
  });

  // 6. DELETE /api/v1/products/:id - Soft delete product
  it('DELETE /api/v1/products/:id - should soft-delete product and return 200', async () => {
    const response = await request(app).delete(`/api/v1/products/${createdProductId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product soft-deleted successfully');
  });

  // 7. Verify soft-deleted product is no longer returned
  it('GET /api/v1/products/:id - should return 404 for soft-deleted product', async () => {
    const response = await request(app).get(`/api/v1/products/${createdProductId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product not found or inactive');
  });

  // 8. Error Case: Inexistent ID
  it('GET /api/v1/products/999999 - should return 404 for non-existent ID', async () => {
    const response = await request(app).get('/api/v1/products/999999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product not found or inactive');
  });

  // 9. Error Case: Invalid data (price <= 0)
  it('POST /api/v1/products - should return 400 for invalid price', async () => {
    const invalidProduct = {
      name: 'Invalid Price Item',
      price: -10,
      stock: 5,
      description: 'Test with negative price',
    };

    const response = await request(app)
      .post('/api/v1/products')
      .send(invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid data. Price must be > 0 and stock >= 0');
  });
});
