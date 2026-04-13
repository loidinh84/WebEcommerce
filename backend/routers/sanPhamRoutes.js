const express = require("express");
const router = express.Router();
const sanPhamController = require("../controllers/sanPhamController");
const upload = require("../config/upload");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// 1. CÁC ROUTE CỐ ĐỊNH
router.get("/danhMuc", verifyToken, isAdmin, sanPhamController.getAllDanhMuc);
router.get(
  "/nhaCungCap",
  verifyToken,
  isAdmin,
  sanPhamController.getAllNhaCungCap,
);
router.get("/", sanPhamController.getAllSanPham);
router.get(
  "/tatCaSanPham",
  verifyToken,
  isAdmin,
  sanPhamController.getAdminSanPham,
);

// Thêm mới sản phẩm
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("hinh_anh_files", 10),
  sanPhamController.createSanPham,
);

// 2. CÁC ROUTE CÓ BIẾN
router.get("/:id", sanPhamController.getSanPhamById);
router.get("/:id/tuong-tu", sanPhamController.getSanPhamTuongTu);
router.get("/:id/danh-gia", sanPhamController.getDanhGiaBySanPham);

// User đánh giá
router.post("/:id/danh-gia", verifyToken, sanPhamController.createDanhGia);

// Admin
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.array("hinh_anh_files", 10),
  sanPhamController.updateSanPham,
);
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  sanPhamController.toggleTrangThai,
);
router.delete("/:id", verifyToken, isAdmin, sanPhamController.deleteSanPham);

module.exports = router;
