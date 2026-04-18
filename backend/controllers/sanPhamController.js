const { Op } = require("sequelize");
const SanPham = require("../models/SanPham");
const BienTheSanPham = require("../models/BienTheSanPham");
const ThuocTinhSanPham = require("../models/ThuocTinhSanPham");
const HinhAnhSanPham = require("../models/HinhAnhSanPham");
const DanhGiaSanPham = require("../models/DanhGiaSanPham");
const DanhMuc = require("../models/DanhMuc");
const NhaCungCap = require("../models/NhaCungCap");
const TaiKhoan = require("../models/TaiKhoan");

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
    const { danhMucId, thuongHieu } = req.query;

    let whereCondition = req.query.admin ? {} : { trang_thai: "active" };

    if (danhMucId) {
      whereCondition.danh_muc_id = danhMucId;
    }

    if (thuongHieu) {
      whereCondition.thuong_hieu = thuongHieu;
    }

    const danhSach = await SanPham.findAll({
      where: whereCondition,
      include: [
        { model: BienTheSanPham, as: "bien_the" },
        { model: ThuocTinhSanPham, as: "thuoc_tinh" },
        { model: HinhAnhSanPham, as: "hinh_anh" },
      ],
      order: [["created_at", "DESC"]],
      limit: 20,
    });

    res.status(200).json(danhSach);
  } catch (error) {
    console.error("Lỗi server khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.getAdminSanPham = async (req, res) => {
  try {
    const {
      danhMucId,
      nhaCungCapId,
      noiBat,
      trangThai,
      thuongHieu,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const offset = (pageNumber - 1) * limitNumber;

    let whereCondition = { trang_thai: { [Op.ne]: "deleted" } };
    if (danhMucId) whereCondition.danh_muc_id = danhMucId;
    if (nhaCungCapId) whereCondition.nha_cung_cap_id = nhaCungCapId;
    if (trangThai) whereCondition.trang_thai = trangThai;
    if (noiBat === "true") {
      whereCondition.noi_bat = 1;
    }
    if (search) {
      whereCondition.ten_san_pham = { [Op.like]: `%${search}%` };
    }

    if (danhMucId) {
      whereCondition.danh_muc_id = danhMucId;
    }

    if (thuongHieu) {
      whereCondition.thuong_hieu = thuongHieu;
    }

    const { count, rows } = await SanPham.findAndCountAll({
      where: whereCondition,
      include: [
        { model: DanhMuc, as: "danh_muc", attributes: ["id", "ten_danh_muc"] },
        {
          model: NhaCungCap,
          as: "nha_cung_cap",
          attributes: ["id", "ten_nha_cc"],
        },
        { model: BienTheSanPham, as: "bien_the" },
        { model: ThuocTinhSanPham, as: "thuoc_tinh" },
        { model: HinhAnhSanPham, as: "hinh_anh" },
      ],
      distinct: true,
      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limitNumber);

    res.status(200).json({
      data: rows,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalItems: count,
    });
  } catch (error) {
    console.error("Lỗi server khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.getAllDanhMuc = async (req, res) => {
  try {
    const list = await DanhMuc.findAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Lỗi!" });
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

exports.getSanPhamBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const sanPham = await SanPham.findOne({
      where: { slug: slug },
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
      can_nang,
      chieu_dai,
      chieu_rong,
      chieu_cao,
      meta_title,
      meta_description,
    } = req.body;

    let bien_the = [];
    let thuoc_tinh = [];

    if (req.body.bien_the) {
      try {
        bien_the = JSON.parse(req.body.bien_the);
      } catch (e) {
        console.error("Lỗi parse bien_the", e);
      }
    }
    if (req.body.thuoc_tinh) {
      try {
        thuoc_tinh = JSON.parse(req.body.thuoc_tinh);
      } catch (e) {
        console.error("Lỗi parse thuoc_tinh", e);
      }
    }

    if (!ten_san_pham) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Tên sản phẩm không được để trống!" });
    }

    const slug = generateSlug(ten_san_pham);

    // 3. Lưu thông tin chung vào CSDL
    const sanPhamMoi = await SanPham.create(
      {
        ten_san_pham,
        slug,
        danh_muc_id: danh_muc_id ? Number(danh_muc_id) : null,
        nha_cung_cap_id: nha_cung_cap_id ? Number(nha_cung_cap_id) : null,
        mo_ta_ngan,
        mo_ta_day_du,
        thuong_hieu,
        trang_thai: trang_thai || "active",
        noi_bat: noi_bat === "true" || noi_bat === true,
        luot_xem: 0,
        can_nang: can_nang ? Number(can_nang) : null,
        chieu_dai: chieu_dai ? Number(chieu_dai) : null,
        chieu_rong: chieu_rong ? Number(chieu_rong) : null,
        chieu_cao: chieu_cao ? Number(chieu_cao) : null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
      },
      { transaction: t },
    );

    const newProductId = sanPhamMoi.id;

    // 4. Lưu mảng Biến thể vào CSDL
    if (bien_the && bien_the.length > 0) {
      const dataBienThe = bien_the.map((bt) => ({
        ...bt,
        san_pham_id: newProductId,
        gia_goc: Number(bt.gia_goc) || 0,
        gia_ban: Number(bt.gia_ban) || 0,
        ton_kho: Number(bt.ton_kho) || 0,
      }));
      await BienTheSanPham.bulkCreate(dataBienThe, { transaction: t });
    }

    // 5. Lưu mảng Thuộc tính vào CSDL
    if (thuoc_tinh && thuoc_tinh.length > 0) {
      const dataThuocTinh = thuoc_tinh.map((tt) => ({
        ...tt,
        san_pham_id: newProductId,
        thu_tu: Number(tt.thu_tu) || 1,
      }));
      await ThuocTinhSanPham.bulkCreate(dataThuocTinh, { transaction: t });
    }

    // 6. XỬ LÝ LƯU HÌNH ẢNH
    if (req.files && req.files.length > 0) {
      const dataHinhAnh = req.files.map((file, index) => ({
        san_pham_id: newProductId,
        url_anh: `/uploads/${file.filename}`,
        alt_text: ten_san_pham,
        la_anh_chinh: index === 0,
      }));
      await HinhAnhSanPham.bulkCreate(dataHinhAnh, { transaction: t });
    } else if (req.body.hinh_anh) {
      try {
        let hinh_anh_arr = JSON.parse(req.body.hinh_anh);
        if (hinh_anh_arr && hinh_anh_arr.length > 0) {
          const dataHinhAnh = hinh_anh_arr.map((ha, index) => ({
            san_pham_id: newProductId,
            url_anh: ha.url_anh,
            alt_text: ha.alt_text || ten_san_pham,
            la_anh_chinh:
              ha.la_anh_chinh !== undefined ? ha.la_anh_chinh : index === 0,
          }));
          await HinhAnhSanPham.bulkCreate(dataHinhAnh, { transaction: t });
        }
      } catch (e) {
        console.error("Lỗi parse hinh_anh", e);
      }
    }

    await t.commit();

    res.status(201).json({
      message: "Thêm sản phẩm và chi tiết thành công!",
      data: sanPhamMoi,
    });
  } catch (error) {
    await t.rollback();
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm!" });
  }
};

exports.toggleTrangThai = async (req, res) => {
  try {
    const { id } = req.params;

    const sanPham = await SanPham.findByPk(id);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    const newStatus = sanPham.trang_thai === "active" ? "inactive" : "active";
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

exports.deleteSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findByPk(id);
    if (!sanPham || sanPham.trang_thai === "deleted") {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    sanPham.trang_thai = "deleted";
    await sanPham.save();
    res.status(200).json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      const errDetail = error.parent ? error.parent.message : "";

      if (errDetail.includes("DanhGiaSP")) {
        return res.status(400).json({
          message:
            "Không thể xóa! Sản phẩm này đang có đánh giá từ khách hàng.",
        });
      }
      if (errDetail.includes("ChiTietDonHang")) {
        return res.status(400).json({
          message: "Không thể xóa! Sản phẩm này đã phát sinh đơn hàng.",
        });
      }
      if (errDetail.includes("GioHang")) {
        return res.status(400).json({
          message: "Không thể xóa! Sản phẩm đang nằm trong giỏ hàng của khách.",
        });
      }

      return res.status(400).json({
        message:
          "Không thể xóa vì sản phẩm đang liên kết với dữ liệu khác (Đơn hàng/Đánh giá)!",
      });
    }
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm." });
  }
};

// API cập nhật sản phẩm
exports.updateSanPham = async (req, res) => {
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
    } = req.body;

    let bien_the = [];
    let thuoc_tinh = [];
    let hinh_anh_giu_lai = [];

    if (req.body.bien_the)
      try {
        bien_the = JSON.parse(req.body.bien_the);
      } catch (e) {}
    if (req.body.thuoc_tinh)
      try {
        thuoc_tinh = JSON.parse(req.body.thuoc_tinh);
      } catch (e) {}
    if (req.body.hinh_anh)
      try {
        hinh_anh_giu_lai = JSON.parse(req.body.hinh_anh);
      } catch (e) {}

    const sanPham = await SanPham.findByPk(id);
    if (!sanPham) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    await sanPham.update(
      {
        ten_san_pham,
        thuong_hieu,
        danh_muc_id: danh_muc_id ? Number(danh_muc_id) : null,
        nha_cung_cap_id: nha_cung_cap_id ? Number(nha_cung_cap_id) : null,
        mo_ta_ngan,
        mo_ta_day_du,
        trang_thai,
        noi_bat: noi_bat === "true" || noi_bat === true,
      },
      { transaction: t },
    );

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

    if (bien_the && bien_the.length > 0) {
      const newBienThe = bien_the.map((bt) => ({
        ...bt,
        san_pham_id: id,
        gia_goc: Number(bt.gia_goc) || 0,
        gia_ban: Number(bt.gia_ban) || 0,
        ton_kho: Number(bt.ton_kho) || 0,
      }));
      await BienTheSanPham.bulkCreate(newBienThe, { transaction: t });
    }

    if (thuoc_tinh && thuoc_tinh.length > 0) {
      const newThuocTinh = thuoc_tinh.map((tt) => ({
        ...tt,
        san_pham_id: id,
        thu_tu: Number(tt.thu_tu) || 1,
      }));
      await ThuocTinhSanPham.bulkCreate(newThuocTinh, { transaction: t });
    }

    let tatCaAnh = [];

    if (hinh_anh_giu_lai && hinh_anh_giu_lai.length > 0) {
      hinh_anh_giu_lai.forEach((ha) => {
        tatCaAnh.push({
          san_pham_id: id,
          url_anh: ha.url_anh,
          alt_text: ha.alt_text || ten_san_pham,
          la_anh_chinh: ha.la_anh_chinh || false,
        });
      });
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        tatCaAnh.push({
          san_pham_id: id,
          url_anh: `/uploads/${file.filename}`,
          alt_text: ten_san_pham,
          la_anh_chinh: false,
        });
      });
    }

    if (tatCaAnh.length > 0 && !tatCaAnh.some((a) => a.la_anh_chinh)) {
      tatCaAnh[0].la_anh_chinh = true;
    }

    if (tatCaAnh.length > 0) {
      await HinhAnhSanPham.bulkCreate(tatCaAnh, { transaction: t });
    }

    await t.commit();
    res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    await t.rollback();
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm!" });
  }
};

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
        { model: BienTheSanPham, as: "bien_the" },
        { model: HinhAnhSanPham, as: "hinh_anh" },
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
