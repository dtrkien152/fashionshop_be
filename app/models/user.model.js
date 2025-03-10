import {DataTypes} from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            // username: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            //     unique: true,
            // },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            code: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            google_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN
            },
        },
        {
            tableName: "user", // ✅ Chỉ định rõ tên bảng
        }
    );
};
