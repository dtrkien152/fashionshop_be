import {DataTypes} from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "user",
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "user", // ✅ Chỉ định rõ tên bảng
        }
    );
};
