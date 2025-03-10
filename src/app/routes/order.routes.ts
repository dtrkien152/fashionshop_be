import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';

const productController = container.resolve(OrderController);
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API quản lý thông tin order
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create an order
 *     description: Creates a new order and sends a confirmation email.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       200:
 *         description: Order created successfully
 */
router.post('', productController.createOrder);

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderCreateRequest:
 *       type: object
 *       required:
 *         - siteId
 *         - customer
 *         - products
 *         - payment
 *         - voucherCode
 *         - email
 *         - shipFee
 *       properties:
 *         siteId:
 *           type: integer
 *           example: 1
 *         customer:
 *           $ref: '#/components/schemas/OrderCustomer'
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         payment:
 *           $ref: '#/components/schemas/OrderPayment'
 *         voucherCode:
 *           type: string
 *           example: "DISCOUNT20"
 *         email:
 *           type: string
 *           format: email
 *           example: "customer@example.com"
 *     OrderPayment:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: "VNPAY"
 *         status:
 *           type: string
 *           example: "Paid"
 *     OrderProduct:
 *       type: object
 *       required:
 *         - productId
 *         - color
 *         - size
 *         - unit
 *       properties:
 *         productId:
 *           type: integer
 *           example: 456
 *         color:
 *           type: string
 *           example: "#000000"
 *         size:
 *           type: string
 *           example: "M"
 *         unit:
 *           type: integer
 *           example: 2
 *     OrderCustomer:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 * */

export default router;