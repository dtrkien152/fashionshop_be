import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "role",
        {
            role_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "role",
            underscored: true,
            timestamps: false,  // ✅ Tắt tự động thêm createdAt và updatedAt
        }
    );
};
