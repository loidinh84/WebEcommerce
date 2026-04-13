const TaiKhoan = require("../models/TaiKhoan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const TheThanhVien = require("../models/TheThanhVien");
const DonHang = require("../models/DonHang");
const ChiTietDonHang = require("../models/ChiTietDonHang");
const DiaChiGiaoHang = require("../models/DiaChiGiaoHang");

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

// Thêm tài khoản mới
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

    const hangMacDinh = await TheThanhVien.findOne({
      order: [["muc_chi_tieu_tu", "ASC"]],
    });

    if (!hangMacDinh) {
      return res.status(500).json({
        message: "Hệ thống chưa thiết lập hạng thẻ thành viên!",
      });
    }

    // Lưu thông tin tài khoản
    const taiKhoanMoi = await TaiKhoan.create({
      ho_ten,
      email,
      mat_khau: hashedMatKhau,
      so_dien_thoai,
      the_thanh_vien_id: hangMacDinh.id,
      tong_chi_tieu: 0,
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
      include: [{ model: TheThanhVien, as: "hang_thanh_vien" }],
    });

    if (!user) {
      return res.status(404).json({
        message: " Email hoặc số điện thoại không tồn tại!",
      });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo mã Token để người dùng không phải đăng nhập lại
    const token = jwt.sign(
      { id: user.id, email: user.email, vai_tro: user.vai_tro },
      process.env.JWT_SECRET,
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
        ty_le_giam_gia: user.hang_thanh_vien?.ty_le_giam_gia || 0,
        ten_hang: user.hang_thanh_vien?.ten_hang,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};

// Đăng nhập bằng google
exports.loginWithGoogle = async (req, res) => {
  try {
    const { email, ho_ten, anh_dai_dien } = req.body;

    // Tìm user theo email
    let user = await TaiKhoan.findOne({ where: { email } });

    // Nếu chưa có → tự động tạo mới
    if (!user) {
      const hangMacDinh = await TheThanhVien.findOne({
        order: [["muc_chi_tieu_tu", "ASC"]],
      });

      user = await TaiKhoan.create({
        ho_ten,
        email,
        mat_khau: "GOOGLE_AUTH_NO_PASSWORD",
        anh_dai_dien,
        vai_tro: "customer",
        the_thanh_vien_id: hangMacDinh?.id,
        tong_chi_tieu: 0,
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Lấy thông tin thẻ thành viên
    const userWithCard = await TaiKhoan.findByPk(user.id, {
      include: [{ model: TheThanhVien, as: "hang_thanh_vien" }],
    });

    res.status(200).json({
      message: "Đăng nhập Google thành công!",
      token,
      user: {
        id: user.id,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
        anh_dai_dien: user.anh_dai_dien,
        so_dien_thoai: user.so_dien_thoai,
        ty_le_giam_gia: userWithCard.hang_thanh_vien?.ty_le_giam_gia || 0,
        ten_hang: userWithCard.hang_thanh_vien?.ten_hang,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi đăng nhập Google!" });
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

exports.getDiaChiByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const diaChiList = await DiaChiGiaoHang.findAll({
      where: { tai_khoan_id: id },
      order: [["la_mac_dinh", "DESC"]],
    });
    res.json(diaChiList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách địa chỉ!" });
  }
};
