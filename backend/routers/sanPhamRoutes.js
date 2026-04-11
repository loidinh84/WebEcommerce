// backend/routes/sanPhamRoutes.js (Tôi giả sử tên file của Bro là vậy)
const express = require("express");
const router = express.Router();
const sanPhamController = require("../controllers/sanPhamController");
// Import middleware upload vừa tạo
const upload = require("../config/upload"); 

router.get("/", sanPhamController.getAllSanPham);
router.get("/:id", sanPhamController.getSanPhamById);

// THÊM MIDDLEWARE UPLOAD VÀO ROUTE POST VÀ PUT
// 'hinh_anh_files' là tên trường (field) mà Frontend sẽ dùng để đính kèm file
router.post("/", upload.array('hinh_anh_files', 10), sanPhamController.createSanPham);
router.put("/:id", upload.array('hinh_anh_files', 10), sanPhamController.updateSanPham);

router.put("/:id/status", sanPhamController.toggleTrangThai);
router.delete("/:id", sanPhamController.deleteSanPham);
router.get("/:id/tuong-tu", sanPhamController.getSanPhamTuongTu);
router.get("/:id/danh-gia", sanPhamController.getDanhGiaBySanPham);
router.post("/:id/danh-gia", sanPhamController.createDanhGia);

module.exports = router;