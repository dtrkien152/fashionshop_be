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
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            full_name: {
                type: DataTypes.STRING,
                unique: false,
            },
            gender: {
                type: DataTypes.BOOLEAN,
                unique: false,
            },
            phone: {
                type: DataTypes.STRING,
                unique: false,
            },
            avatar: {
                type: DataTypes.STRING,
                unique: false,
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
            user_address_id: {
                type: DataTypes.INTEGER,
                unique: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                unique: false,
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
