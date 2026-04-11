const express = require("express");
const router = express.Router();
const DonHangController = require("../controllers/donHangController");

router.get("/vanchuyen", DonHangController.getAllShippingUnits);
router.get("/thanhtoan", DonHangController.getAllPaymentMethods);
router.post("/dat-hang", DonHangController.createDonHang);

module.exports = router;
