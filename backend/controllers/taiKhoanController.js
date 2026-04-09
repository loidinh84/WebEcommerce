const TaiKhoan = require("../models/TaiKhoan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const TheThanhVien = require("../models/TheThanhVien");
const DonHang = require("../models/DonHang");
const ChiTietDonHang = require("../models/ChiTietDonHang");

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
    const user = await TaiKhoan.findByPk(req.params.id, {
      attributes: { exclude: ["mat_khau"] },
    });
    if (!user) return res.status(404).json({ message: "Không tìm thấy!" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getUserFullDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await TaiKhoan.findByPk(id, {
      attributes: { exclude: ["mat_khau"] },
      include: [{ model: TheThanhVien, as: "hang_thanh_vien" }],
    });

    const allOrders = await DonHang.findAll({
      where: { tai_khoan_id: id },
      include: [{ model: ChiTietDonHang, as: "chi_tiet", limit: 1 }],
      order: [["created_at", "DESC"]],
    });

    res.json({
      userInfo: user,
      orderCount: allOrders.length,
      allOrders: allOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu dashboard" });
  }
};

// Thêm một tài khoản mới vào CSDL
exports.createTaiKhoan = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const emailTonTai = await TaiKhoan.findOne({ where: { email: email } });
    if (emailTonTai) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    // Kiểm tra số điện thoại
    const sdtTonTai = await TaiKhoan.findOne({
      where: {
        so_dien_thoai: so_dien_thoai,
      },
    });
    if (sdtTonTai) {
      return res
        .status(400)
        .json({ message: "Số điện thoại này đã được sử dụng!" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedMatKhau = await bcrypt.hash(mat_khau, salt);

    // Lưu thông tin tài khoản
    const taiKhoanMoi = await TaiKhoan.create({
      ho_ten,
      email,
      mat_khau: hashedMatKhau,
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

// Đăng nhập
exports.loginTaiKhoan = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    // Kiểm tra xem email có tồn tại trong CSDL
    const user = await TaiKhoan.findOne({
      where: {
        [Op.or]: [{ email: email }, { so_dien_thoai: email }],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: " Email hoặc số điện thoại không tồn tại trong hệ thống!",
      });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo mã Token để người dùng không phải đăng nhập lại
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "MAT_KHAU_BI_MAT",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user.id,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
        so_dien_thoai: user.so_dien_thoai,
        anh_dai_dien: user.anh_dai_dien,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await DonHang.findByPk(id, {
      include: [
        {
          model: ChiTietDonHang,
          as: "chi_tiet", 
        },
      ],
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin đơn hàng!" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server khi lấy chi tiết đơn hàng" });
  }
};
