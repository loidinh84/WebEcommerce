const TaiKhoan = require("./TaiKhoan");
const TheThanhVien = require("./TheThanhVien");
const DonHang = require("./DonHang");
const ChiTietDonHang = require("./ChiTietDonHang");
const SanPham = require("./SanPham");
const DanhMuc = require("./DanhMuc");
const NhaCungCap = require("./NhaCungCap");
const GiaoDichThanhToan = require("./GiaoDichThanhToan");
const PhuongThucThanhToan = require("./PhuongThucThanhToan");
const DiaChiGiaoHang = require("./DiaChiGiaoHang");

// Quan hệ Tài Khoản <-> Thẻ Thành Viên
// Một tài khoản thuộc về một hạng thành viên
TaiKhoan.belongsTo(TheThanhVien, {
  foreignKey: "the_thanh_vien_id",
  as: "hang_thanh_vien",
});
// Một hạng thành viên có thể có nhiều tài khoản
TheThanhVien.hasMany(TaiKhoan, {
  foreignKey: "the_thanh_vien_id",
  as: "thanh_vien",
});

// Quan hệ Tài Khoản <-> Đơn Hàng
// Một tài khoản có nhiều đơn hàng
TaiKhoan.hasMany(DonHang, {
  foreignKey: "tai_khoan_id",
  as: "danh_sach_don_hang",
});

DonHang.belongsTo(TaiKhoan, { foreignKey: "tai_khoan_id", as: "nguoi_mua" });
// Đơn hàng liên kết với Địa chỉ giao hàng
DonHang.belongsTo(DiaChiGiaoHang, { foreignKey: "dia_chi_id", as: "dia_chi" });

// Quan hệ Đơn Hàng <-> Chi Tiết Đơn Hàng
DonHang.hasMany(ChiTietDonHang, { foreignKey: "don_hang_id", as: "chi_tiet" });
// Đơn hàng liên kết với Giao dịch thanh toán
DonHang.hasOne(GiaoDichThanhToan, {
  foreignKey: "don_hang_id",
  as: "giao_dich",
});
// Giao dịch thanh toán liên kết với Phương thức thanh toán
GiaoDichThanhToan.belongsTo(PhuongThucThanhToan, {
  foreignKey: "phuong_thuc_id",
  as: "phuong_thuc",
});
ChiTietDonHang.belongsTo(DonHang, { foreignKey: "don_hang_id" });

SanPham.belongsTo(DanhMuc, { foreignKey: "danh_muc_id", as: "danh_muc" });
DanhMuc.hasMany(SanPham, {
  foreignKey: "danh_muc_id",
  as: "danh_sach_san_pham",
});

// 5. Quan hệ Sản Phẩm <-> Nhà Cung Cấp
SanPham.belongsTo(NhaCungCap, {
  foreignKey: "nha_cung_cap_id",
  as: "nha_cung_cap",
});
NhaCungCap.hasMany(SanPham, {
  foreignKey: "nha_cung_cap_id",
  as: "danh_sach_san_pham",
});

module.exports = {
  TaiKhoan,
  TheThanhVien,
  DonHang,
  ChiTietDonHang,
  SanPham,
  DanhMuc,
  NhaCungCap,
  GiaoDichThanhToan,
  PhuongThucThanhToan,
  DiaChiGiaoHang,
};
