const SanPham = require("../models/SanPham");

// 1. Lấy danh sách toàn bộ sản phẩm
exports.getAllSanPham = async (req, res) => {
  try {
    const danhSach = await SanPham.findAll();
    res.status(200).json(danhSach);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};

// 2. Thêm một sản phẩm mới
exports.createSanPham = async (req, res) => {
  try {
    const {
      ten_san_pham,
      slug,
      danh_muc_id,
      nha_cung_cap_id,
      mo_ta_ngan,
      mo_ta_day_du,
      thuong_hieu,
      trang_thai,
      noi_bat,
    } = req.body;

    // Tên sản phẩm là bắt buộc
    if (!ten_san_pham) {
      return res
        .status(400)
        .json({ message: "Tên sản phẩm không được để trống!" });
    }

    // Lưu vào CSDL
    const sanPhamMoi = await SanPham.create({
      ten_san_pham,
      slug,
      danh_muc_id,
      nha_cung_cap_id,
      mo_ta_ngan,
      mo_ta_day_du,
      thuong_hieu,
      trang_thai: trang_thai !== undefined ? trang_thai : 1,
      noi_bat: noi_bat !== undefined ? noi_bat : false,
      luot_xem: 0,
    });

    res.status(201).json({
      message: "Thêm thông tin chung của sản phẩm thành công!",
      data: sanPhamMoi,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm!" });
  }
};
