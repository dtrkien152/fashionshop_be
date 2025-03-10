import swaggerJsDoc from "swagger-jsdoc";

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
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Nhập JWT Token vào đây để xác thực",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["./src/app/routes/*.ts"], // Đường dẫn đến các file chứa API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export {swaggerDocs};
