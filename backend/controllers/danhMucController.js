const DanhMuc = require("../models/DanhMuc");
const SanPham = require("../models/SanPham");


// 1. THÊM DANH MỤC MỚI
exports.createDanhMuc = async (req, res) => {
  try {
    const { ten_danh_muc, slug, danh_muc_cha_id, mo_ta, thu_tu, trang_thai } =
      req.body;

    const newDanhMuc = await DanhMuc.create({
      ten_danh_muc,
      slug,
      danh_muc_cha_id: danh_muc_cha_id || null,
      mo_ta,
      thu_tu: thu_tu || 0,
      trang_thai: trang_thai || "active",
    });

    res.status(201).json(newDanhMuc);
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({ message: "Lỗi server khi tạo danh mục!" });
  }
};

// 2. CẬP NHẬT DANH MỤC
exports.updateDanhMuc = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_danh_muc, slug, danh_muc_cha_id, mo_ta, thu_tu, trang_thai } =
      req.body;

    const danhMuc = await DanhMuc.findByPk(id);
    if (!danhMuc) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    await danhMuc.update({
      ten_danh_muc,
      slug,
      danh_muc_cha_id: danh_muc_cha_id || null,
      mo_ta,
      thu_tu,
      trang_thai,
    });

    res.status(200).json({ message: "Cập nhật danh mục thành công!", danhMuc });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật danh mục!" });
  }
};

// 3. XÓA DANH MỤC
exports.deleteDanhMuc = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có Sản phẩm nào đang dùng danh mục này không
    const spCount = await SanPham.count({ where: { danh_muc_id: id } });
    if (spCount > 0) {
      return res.status(400).json({
        message: `Không thể xóa! Đang có ${spCount} sản phẩm thuộc danh mục này.`,
      });
    }

    // Kiểm tra xem nó có đang làm cha của danh mục nào khác không
    const childCount = await DanhMuc.count({ where: { danh_muc_cha_id: id } });
    if (childCount > 0) {
      return res.status(400).json({
        message: "Không thể xóa! Vui lòng xóa các danh mục con của nó trước.",
      });
    }

    await DanhMuc.destroy({ where: { id } });
    res.status(200).json({ message: "Đã xóa danh mục thành công!" });
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    res.status(500).json({ message: "Lỗi server khi xóa danh mục!" });
  }
};

// 4. ĐỔI TRẠNG THÁI
exports.toggleTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const danhMuc = await DanhMuc.findByPk(id);

    if (!danhMuc)
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });

    const newStatus = danhMuc.trang_thai === "active" ? "inactive" : "active";
    await danhMuc.update({ trang_thai: newStatus });

    res
      .status(200)
      .json({ message: "Đã cập nhật trạng thái!", trang_thai: newStatus });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi đổi trạng thái!" });
  }
};

// 5. LẤY DANH MỤC THEO SLUG (Public)
exports.getDanhMucBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const danhMuc = await DanhMuc.findOne({
      where: { slug: slug, trang_thai: "active" },
    });

    if (!danhMuc) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    res.status(200).json(danhMuc);
  } catch (error) {
    console.error("Lỗi lấy danh mục theo slug:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
// 6. LẤY DANH MỤC THEO ID (Public)
exports.getDanhMucById = async (req, res) => {
  try {
    const { id } = req.params;
    const danhMuc = await DanhMuc.findByPk(id);

    if (!danhMuc || danhMuc.trang_thai !== "active") {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    res.status(200).json(danhMuc);
  } catch (error) {
    console.error("Lỗi lấy danh mục theo id:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
