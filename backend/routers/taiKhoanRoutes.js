const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");

router.get("/", taiKhoanController.getAllRTaiKhoan);
router.post("/", taiKhoanController.createTaiKhoan);
router.post("/login", taiKhoanController.loginTaiKhoan);
router.get("/dashboard/:id", taiKhoanController.getUserFullDashboard);
router.get("/:id", taiKhoanController.getProfile);
router.get("/order-detail/:id", taiKhoanController.getOrderDetail);

module.exports = router;
