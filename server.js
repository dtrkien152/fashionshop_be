require("dotenv").config({ path: "./dev.env" }); // Load file env

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models/index"); // Import connection-manager
const sequelize = db.sequelize; // Lấy instance của Sequelize
const swaggerDocs = require("./app/config/swagger.config"); // Import Swagger config
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./app/routes/auth.routes"));
app.use("/api/user", require("./app/routes/user.routes"));

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Kết nối MySQL & chạy server
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Connected to MySQL Database!");

        // Đồng bộ cơ sở dữ liệu (nếu cần)
        return sequelize.sync();
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

module.exports = app;
