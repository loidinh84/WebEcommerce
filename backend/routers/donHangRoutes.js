const express = require("express");
const router = express.Router();
const DonHangController = require("../controllers/donHangController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/vanchuyen", DonHangController.getAllShippingUnits);
router.get("/thanhtoan", DonHangController.getAllPaymentMethods);
router.post("/dat-hang", DonHangController.createDonHang);
router.post("/check-voucher", DonHangController.checkVoucher);
router.get("/", verifyToken, isAdmin, DonHangController.getAdminOrders);
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  DonHangController.updateOrderStatus,
);

module.exports = router;
