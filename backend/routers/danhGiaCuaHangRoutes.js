const express = require("express");
const router = express.Router();
const controller = require("../controllers/danhGiaCuaHangController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Route công khai lấy đánh giá hiện trang chủ
router.get("/top", controller.getTopReviews);

// Route cho khách hàng gửi đánh giá (cần đăng nhập)
router.post("/", verifyToken, controller.createReview);

module.exports = router;
