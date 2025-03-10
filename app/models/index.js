import { Sequelize } from "sequelize";
import config from "../config/db.config.js";
import UserModel from "../models/user.model.js";
import RoleModel from "../models/role.model.js";

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: config.DIALECT,
        pool: config.pool,
        logging: console.log, // Giúp debug query
            define: {
                    // timestamps: true, // Bật timestamps
                    createdAt: "created_date", // Đổi tên createdAt
                    updatedAt: "updated_date", // Đổi tên updatedAt
                    underscored: true, // Chuyển camelCase thành snake_case
            },
    },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models


// Gán model vào `db`
db.User = UserModel(sequelize);
db.Role = RoleModel(sequelize);

// Khai báo quan hệ
db.Role.hasMany(db.User, { foreignKey: "role_id", as: "user" });
db.User.belongsTo(db.Role, { foreignKey: "role_id", as: "role" });

export default db;
