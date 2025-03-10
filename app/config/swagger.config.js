const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Fashion Shop API",
            version: "1.0.0",
            description: "API documentation for Fashion Shop",
        },
        servers: [
            {
                url: "http://localhost:5000", // Cập nhật URL production nếu cần
            },
        ],
    },
    apis: ["./app/routes/*.js"], // Đường dẫn đến các file chứa API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
