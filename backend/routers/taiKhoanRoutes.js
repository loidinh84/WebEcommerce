const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");
const DiaChiGiaoHang = require("../models/DiaChiGiaoHang");

router.get("/", taiKhoanController.getAllRTaiKhoan);
router.post("/", taiKhoanController.createTaiKhoan);
router.post("/login", taiKhoanController.loginTaiKhoan);
router.get("/dashboard/:id", taiKhoanController.getUserFullDashboard);
router.get("/:id", taiKhoanController.getProfile);
router.get("/order-detail/:id", taiKhoanController.getOrderDetail);
router.get("/:id/dia-chi", taiKhoanController.getDiaChiByUser);

module.exports = router;
