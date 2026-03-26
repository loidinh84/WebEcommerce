const express = require("express");
const router = express.Router();
const sanPhamController = require("../controllers/sanPhamController");

router.get("/", sanPhamController.getAllSanPham);
router.post("/", sanPhamController.createSanPham);

module.exports = router;
