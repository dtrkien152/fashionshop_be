import express from 'express';
import { ENV_CONFIG, sequelize, SESSION_CONFIG, swaggerDocs } from './app/config';
import {
  authRoutes,
  cartRoutes,
  categoryRoutes,
  employeeRoutes,
  orderRoutes,
  productRoutes,
  shipFeeRoutes,
  siteRoutes,
  statsRoutes,
  stockRoutes,
  userRoutes,
  voucherRoutes,
} from './app/routes';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware, errorMiddleware, passportMiddleware } from './app/middlewares';
import bodyParser from 'body-parser';
import postRouters from './app/routes/post.routers';
import fileRouter from './app/routes/file.router';

const app = express();
const port = ENV_CONFIG.server.port || 5000;

// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(SESSION_CONFIG); // 💡 Dùng session middleware

// ✅ Thêm Passport Middleware
app.use(passportMiddleware.initialize());
app.use(passportMiddleware.session()); // 💡 Cần có để dùng session trong Passport

// Middleware CORS
app.use(corsMiddleware.addHeaderResponse);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ship-fee', shipFeeRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/posts', postRouters);
app.use('/api/stocks', stockRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/files', fileRouter);
app.use('/api/employee', employeeRoutes);

// ✅ Thêm Error Handler Middleware
app.use(errorMiddleware.errorHandler);

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Kết nối MySQL & chạy server
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL Database!');
    return sequelize;

  })
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📄 Swagger Docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

export default app;
