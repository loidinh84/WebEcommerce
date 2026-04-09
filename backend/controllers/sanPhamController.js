const SanPham = require("../models/SanPham");
const BienTheSanPham = require("../models/BienTheSanPham");
const ThuocTinhSanPham = require("../models/ThuocTinhSanPham");
const HinhAnhSanPham = require("../models/HinhAnhSanPham");
const DanhGiaSanPham = require("../models/DanhGiaSanPham");
const TaiKhoan = require("../models/TaiKhoan");
const { Op } = require("sequelize");

const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// 1. Lấy danh sách toàn bộ sản phẩm
exports.getAllSanPham = async (req, res) => {
  try {
    const danhSach = await SanPham.findAll({
      include: [
        { model: require("../models/BienTheSanPham"), as: "bien_the" },
        { model: require("../models/ThuocTinhSanPham"), as: "thuoc_tinh" },
        { model: require("../models/HinhAnhSanPham"), as: "hinh_anh" },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(danhSach);
  } catch (error) {
    console.error("Lỗi server khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};

// Lấy thông tin chi tiết 1 sản phẩm
exports.getSanPhamById = async (req, res) => {
  try {
    const { id } = req.params;

    const sanPham = await SanPham.findByPk(id, {
      include: [
        { model: BienTheSanPham, as: "bien_the" },
        { model: ThuocTinhSanPham, as: "thuoc_tinh" },
        { model: HinhAnhSanPham, as: "hinh_anh" },
      ],
    });

    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    res.status(200).json(sanPham);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết sản phẩm!" });
  }
};

// 2. Thêm một sản phẩm mới
exports.createSanPham = async (req, res) => {
  const t = await require("../config/db").transaction();

  try {
    const {
      ten_san_pham,
      danh_muc_id,
      nha_cung_cap_id,
      mo_ta_ngan,
      mo_ta_day_du,
      thuong_hieu,
      trang_thai,
      noi_bat,
      bien_the,
      thuoc_tinh,
      hinh_anh,
    } = req.body;

    // 1. Tên sản phẩm là bắt buộc
    if (!ten_san_pham) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Tên sản phẩm không được để trống!" });
    }

    // 2. Tự động tạo slug
    const slug = generateSlug(ten_san_pham);

    // 3. Lưu thông tin chung vào CSDL
    const sanPhamMoi = await SanPham.create(
      {
        ten_san_pham,
        slug,
        danh_muc_id: danh_muc_id || null,
        nha_cung_cap_id: nha_cung_cap_id || null,
        mo_ta_ngan,
        mo_ta_day_du,
        thuong_hieu,
        trang_thai: trang_thai || "active",
        noi_bat: noi_bat !== undefined ? noi_bat : false,
        luot_xem: 0,
      },
      { transaction: t },
    );

    const newProductId = sanPhamMoi.id;

    // 4. Lưu mảng Biến thể vào CSDL
    if (bien_the && bien_the.length > 0) {
      const BienTheSanPham = require("../models/BienTheSanPham");
      const dataBienThe = bien_the.map((bt) => ({
        ...bt,
        san_pham_id: newProductId,
      }));
      await BienTheSanPham.bulkCreate(dataBienThe, { transaction: t });
    }

    // 5. Lưu mảng Thuộc tính vào CSDL
    if (thuoc_tinh && thuoc_tinh.length > 0) {
      const ThuocTinhSanPham = require("../models/ThuocTinhSanPham");
      const dataThuocTinh = thuoc_tinh.map((tt) => ({
        ...tt,
        san_pham_id: newProductId,
      }));
      await ThuocTinhSanPham.bulkCreate(dataThuocTinh, { transaction: t });
    }

    // 6. Lưu mảng Hình ảnh vào CSDL
    if (hinh_anh && hinh_anh.length > 0) {
      const HinhAnhSanPham = require("../models/HinhAnhSanPham");
      const dataHinhAnh = hinh_anh.map((ha) => ({
        ...ha,
        san_pham_id: newProductId,
      }));
      await HinhAnhSanPham.bulkCreate(dataHinhAnh, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      message: "Thêm sản phẩm và chi tiết thành công!",
      data: sanPhamMoi,
    });
  } catch (error) {
    // Nếu bị lỗi ở bất kỳ dòng nào -> hủy bỏ toàn bộ
    await t.rollback();
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm!" });
  }
};

exports.toggleTrangThai = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm trong DB
    const sanPham = await SanPham.findByPk(id);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Đảo ngược trạng thái hiện tại
    const newStatus = sanPham.trang_thai === "active" ? "inactive" : "active";

    //Lưu vào Database
    await sanPham.update({ trang_thai: newStatus });

    res.status(200).json({
      message: "Cập nhật trạng thái thành công!",
      trang_thai: newStatus,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái!" });
  }
};

// API xóa sản phẩm
exports.deleteSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findByPk(id);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // Lệnh xóa khỏi Database
    await sanPham.destroy();
    res.status(200).json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm!" });
  }
};

exports.updateSanPham = async (req, res) => {
  // Bắt đầu 1 Transaction để bảo vệ dữ liệu
  const t = await require("../config/db").transaction();

  try {
    const { id } = req.params;
    const {
      ten_san_pham,
      thuong_hieu,
      danh_muc_id,
      nha_cung_cap_id,
      mo_ta_ngan,
      mo_ta_day_du,
      trang_thai,
      noi_bat,
      bien_the,
      thuoc_tinh,
      hinh_anh,
    } = req.body;

    // 1. Tìm sản phẩm
    const sanPham = await SanPham.findByPk(id);
    if (!sanPham) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    // 2. Cập nhật thông tin bảng chính
    await sanPham.update(
      {
        ten_san_pham,
        thuong_hieu,
        danh_muc_id,
        nha_cung_cap_id,
        mo_ta_ngan,
        mo_ta_day_du,
        trang_thai,
        noi_bat,
      },
      { transaction: t },
    );

    // 3. Cập nhật các bảng phụ
    await BienTheSanPham.destroy({
      where: { san_pham_id: id },
      transaction: t,
    });
    await ThuocTinhSanPham.destroy({
      where: { san_pham_id: id },
      transaction: t,
    });
    await HinhAnhSanPham.destroy({
      where: { san_pham_id: id },
      transaction: t,
    });

    // Thêm cái mới từ Form gửi lên
    if (bien_the && bien_the.length > 0) {
      const newBienThe = bien_the.map((bt) => ({ ...bt, san_pham_id: id }));
      await BienTheSanPham.bulkCreate(newBienThe, { transaction: t });
    }

    if (thuoc_tinh && thuoc_tinh.length > 0) {
      const newThuocTinh = thuoc_tinh.map((tt) => ({ ...tt, san_pham_id: id }));
      await ThuocTinhSanPham.bulkCreate(newThuocTinh, { transaction: t });
    }

    if (hinh_anh && hinh_anh.length > 0) {
      const newHinhAnh = hinh_anh.map((ha) => ({ ...ha, san_pham_id: id }));
      await HinhAnhSanPham.bulkCreate(newHinhAnh, { transaction: t });
    }

    // Nếu mọi thứ trót lọt -> Xác nhận lưu vào DB
    await t.commit();
    res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    // Nếu có lỗi ở bất kỳ bước nào -> Hủy bỏ toàn bộ, không lưu rác vào DB
    await t.rollback();
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm!" });
  }
};

// API Lấy 4 sản phẩm tương tự
exports.getSanPhamTuongTu = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPhamHienTai = await SanPham.findByPk(id);

    if (!sanPhamHienTai)
      return res.status(404).json({ message: "Không tìm thấy" });

    const sanPhamTuongTu = await SanPham.findAll({
      where: {
        danh_muc_id: sanPhamHienTai.danh_muc_id,
        id: { [Op.ne]: id },
      },
      include: [
        { model: require("../models/BienTheSanPham"), as: "bien_the" },
        { model: require("../models/HinhAnhSanPham"), as: "hinh_anh" },
      ],
      limit: 4,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(sanPhamTuongTu);
  } catch (error) {
    console.error("Lỗi lấy SP tương tự:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// API Lấy danh sách đánh giá của 1 sản phẩm
exports.getDanhGiaBySanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const danhGia = await DanhGiaSanPham.findAll({
      where: { san_pham_id: id, trang_thai: "approved" },
      include: [
        {
          model: TaiKhoan,
          as: "nguoi_dung",
          attributes: ["ho_ten", "anh_dai_dien"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(danhGia);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đánh giá!" });
  }
};

// API Thêm đánh giá mới
exports.createDanhGia = async (req, res) => {
  try {
    const { id } = req.params;
    const { tai_khoan_id, so_sao, noi_dung } = req.body;

    if (!tai_khoan_id || !so_sao || !noi_dung) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin!" });
    }

    const danhGiaMoi = await DanhGiaSanPham.create({
      san_pham_id: id,
      tai_khoan_id: tai_khoan_id,
      so_sao: so_sao,
      noi_dung: noi_dung,
      don_hang_id: null,
      trang_thai: "approved",
    });

    res.status(201).json({ message: "Đánh giá thành công!", data: danhGiaMoi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm đánh giá!" });
  }
};
