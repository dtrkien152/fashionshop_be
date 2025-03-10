import "dotenv/config"; // Load env file
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import db from "./app/models/index.js"; // Import connection-manager
import swaggerDocs from "./app/config/swagger.config.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import sessionConfig from "./app/config/session.config.js";
import {passport} from "./app/middleware/index.js"; // Import file cấu hình session

const sequelize = db.sequelize; // Lấy instance của Sequelize
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(sessionConfig); // 💡 Dùng session middleware

// ✅ Thêm Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); // 💡 Cần có để dùng session trong Passport
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Kết nối MySQL & chạy server
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Connected to MySQL Database!");
        return sequelize

    })
    .then(() => {
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📄 Swagger Docs: http://localhost:${port}/api-docs`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
    });

export default app;
