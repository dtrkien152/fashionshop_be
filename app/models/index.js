const config = require("../config/db.config.js");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: config.DIALECT,
        pool: config.pool,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
