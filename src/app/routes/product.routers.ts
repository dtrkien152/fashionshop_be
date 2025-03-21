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
 *   post:
 *     summary: Search and filter products
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: Keyword to search products
 *               categoryId:
 *                 type: integer
 *                 description: Category ID to filter products
 *               sortBy:
 *                 type: string
 *                 enum: [newest, price_asc, price_desc, latest]
 *                 description: Sort by newest, price ascending, or price descending
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Limit number of results
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.post('/search', productController.searchProducts);


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

/**
 * @swagger
 * /api/products/top-selling:
 *   get:
 *     summary: Get top-selling products of the week
 *     description: Retrieve a list of the top-selling products within the last 7 days, ordered by sales volume
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of top-selling products retrieved successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get('/top-selling', productController.getTopSellingProducts);


/**
 * @swagger
 * /api/products/recommended:
 *   get:
 *     summary: Lấy ra tối đa 5 sản phẩm được đề xuất
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm hiện tại
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm đề xuất
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Thiếu Product ID
 *       500:
 *         description: Lỗi server
 */
router.get('/recommended', productController.getRecommendedProducts);


/**
 * @swagger
 * /api/products/search-for-admin:
 *   post:
 *     summary: Search and filter products
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: Keyword to search products
 *               categoryId:
 *                 type: integer
 *                 description: Category ID to filter products
 *               sortBy:
 *                 type: string
 *                 enum: [newest, price_asc, price_desc, latest]
 *                 description: Sort by newest, price ascending, or price descending
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Limit number of results
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.post('/search-for-admin', productController.searchProductsAdmin);

router.put('/update-status/:id', productController.updateStatus);

export default router;
