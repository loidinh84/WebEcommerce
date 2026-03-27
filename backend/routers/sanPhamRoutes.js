const express = require("express");
const router = express.Router();
const sanPhamController = require("../controllers/sanPhamController");

router.get("/", sanPhamController.getAllSanPham);
router.get("/:id", sanPhamController.getSanPhamById);
router.post("/", sanPhamController.createSanPham);
router.put("/:id/status", sanPhamController.toggleTrangThai);
router.delete("/:id", sanPhamController.deleteSanPham);
router.put("/:id", sanPhamController.updateSanPham);

module.exports = router;
