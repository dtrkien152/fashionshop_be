const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
      "User",
      {
        user_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, // Kiểm tra email hợp lệ
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "users", // Tên bảng
        // timestamps: true, // Bật createdAt, updatedAt
        underscored: true, // Chuyển camelCase thành snake_case
      }
  );

  return User;
};
