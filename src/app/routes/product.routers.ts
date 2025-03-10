import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { container } from '../config';
import {corsMiddleware} from "../middlewares";

const productController = container.resolve(ProductController);
// Middleware CORS

const router = Router();
router.use(corsMiddleware.addHeaderResponse);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Authentication Products
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search and filter products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search products
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Category ID to filter products
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, price_asc, price_desc,lastest]
 *         description: Sort by newest, price ascending, or price descending
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                   example: 100
 *       500:
 *         description: Internal server error
 */
router.get('/search', productController.searchProducts);

export default router;
