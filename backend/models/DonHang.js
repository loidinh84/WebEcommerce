const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DonHang = sequelize.define(
  "DonHang",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    ma_don_hang: { type: DataTypes.STRING(30), allowNull: false },
    tai_khoan_id: { type: DataTypes.BIGINT, allowNull: false },
    tong_thanh_toan: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    trang_thai: { type: DataTypes.STRING(20), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "DonHang",
    timestamps: false,
  },
);

module.exports = DonHang;
