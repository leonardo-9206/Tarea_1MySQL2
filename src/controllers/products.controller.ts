import type { Request, Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { db } from '../conf/dbConnection.ts';
import type { Product } from '../models/Product.ts';

export interface ProductRow extends RowDataPacket, Product {}

export class ProductController {
  // 1. GET /getAll or GET / - Get all active products
  async getAll(_req: Request, res: Response) {
    try {
      const [rows] = await db.query<ProductRow[]>('SELECT * FROM products WHERE active = TRUE');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error while fetching products' });
    }
  }

  // 2. GET /getById/:id or GET /:id - Get active product by ID
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Product ID must be a positive integer' });
    }
    try {
      const [rows] = await db.query<ProductRow[]>(
        'SELECT * FROM products WHERE id = ? AND active = TRUE',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found or inactive' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product by ID' });
    }
  }

  // 3. POST /create or POST / - Create a new product
  async create(req: Request, res: Response) {
    const { name, price, stock, description, brand, img }: Product = req.body;
    if (!name || Number(price) <= 0 || stock === undefined || stock < 0 || !description) {
      return res.status(400).json({ message: 'Invalid data. Price must be > 0 and stock >= 0' });
    }

    try {
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
        [name, price, stock, description, brand || null, img || null]
      );
      res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
    }
  }

  // 4. PUT /update/:id or PUT /:id - Update complete product details
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { name, price, stock, description, brand, img }: Product = req.body;
    if (isNaN(id) || id <= 0 || Number(price) <= 0 || stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Invalid ID, price, or stock data' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
        'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
        [name, price, stock, description, brand || null, img || null, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found or inactive' });
      }
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  }

  // 5. DELETE /delete/:id or DELETE /:id - Soft delete product (set active = FALSE)
  async deleteProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
        'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found or already inactive' });
      }
      res.json({ message: 'Product soft-deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error soft-deleting product' });
    }
  }

  // 6. PATCH /change-price/:id or PATCH /:id/price - Modify product price only
  async changePrice(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { price } = req.body;
    if (isNaN(id) || id <= 0 || Number(price) <= 0) {
      return res.status(400).json({ message: 'Invalid ID or price. Price must be greater than 0' });
    }
    try {
      const [result] = await db.query<ResultSetHeader>(
        'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
        [price, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found or inactive' });
      }
      res.json({ message: 'Product price updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing product price' });
    }
  }
}