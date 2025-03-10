import { Router } from 'express';
import { container } from '../config';
import { ProductController } from '../controllers';

const productController = container.resolve(ProductController);
const router = Router();

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
 *           enum: [newest, price_asc, price_desc, latest]
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
 *       500:
 *         description: Internal server error
 */
router.get('/search', productController.searchProducts);


/**
 * @swagger
 * /api/products/detail:
 *   get:
 *     summary: Get product details
 *     description: Retrieve detailed information about a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product detail retrieved successfully
 *       400:
 *         description: Invalid request (missing productId)
 *       404:
 *         description: Product not found
 */
router.get('/detail', productController.getProductDetail);

export default router;
