const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DanhMuc = sequelize.define(
  "DanhMuc",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_danh_muc: { type: DataTypes.STRING(255), allowNull: false },
    mo_ta: { type: DataTypes.TEXT },
    trang_thai: { type: DataTypes.STRING(20), defaultValue: "active" },
  },
  {
    tableName: "DanhMuc",
    timestamps: false,
  },
);

module.exports = DanhMuc;
