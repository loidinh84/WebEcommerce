const TaiKhoan = require("./TaiKhoan");
const TheThanhVien = require("./TheThanhVien");
const DonHang = require("./DonHang");
const ChiTietDonHang = require("./ChiTietDonHang");
const SanPham = require("./SanPham");

// 1. Quan hệ Tài Khoản <-> Thẻ Thành Viên
// Một tài khoản thuộc về một hạng thành viên
TaiKhoan.belongsTo(TheThanhVien, {
  foreignKey: "the_thanh_vien_id",
  as: "hang_thanh_vien",
});
// Một hạng thành viên có thể có nhiều tài khoản
TheThanhVien.hasMany(TaiKhoan, { foreignKey: "the_thanh_vien_id", as: "thanh_vien" });

// 2. Quan hệ Tài Khoản <-> Đơn Hàng
// Một tài khoản có nhiều đơn hàng
TaiKhoan.hasMany(DonHang, {
  foreignKey: "tai_khoan_id",
  as: "danh_sach_don_hang",
});
DonHang.belongsTo(TaiKhoan, { foreignKey: "tai_khoan_id", as: "nguoi_mua" });

// 3. Quan hệ Đơn Hàng <-> Chi Tiết Đơn Hàng
DonHang.hasMany(ChiTietDonHang, { foreignKey: "don_hang_id", as: "chi_tiet" });
ChiTietDonHang.belongsTo(DonHang, { foreignKey: "don_hang_id" });

module.exports = {
  TaiKhoan,
  TheThanhVien,
  DonHang,
  ChiTietDonHang,
  SanPham,
};
