const TaiKhoan = require("../models/TaiKhoan");

// Lấy danh sách tất cả tài khoản
exports.getAllRTaiKhoan = async (req, res) => {
  try {
    const danhSach = await TaiKhoan.findAll();
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách" });
  }
};

// Lấy thông tin 1 người dùng
exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await TaiKhoan.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm một tài khoản mới vào CSDL
exports.createTaiKhoan = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai } = req.body;

    const taiKhoanMoi = await TaiKhoan.create({
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
    });

    res
      .status(201)
      .json({ message: "Tạo tài khoản thành công!", data: taiKhoanMoi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo tài khoản!" });
  }
};
