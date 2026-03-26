const express = require("express");
const router = express.Router();
const taiKhoanController = require("../controllers/taiKhoanController");

router.get("/", taiKhoanController.getAllRTaiKhoan);
router.post("/", taiKhoanController.createTaiKhoan);
router.get("/:id", taiKhoanController.getProfile);
router.post("/login", taiKhoanController.loginTaiKhoan);

module.exports = router;
