const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Khi có request POST tới /chat, gọi hàm chatWithAI trong controller
router.post("/chat", aiController.chatWithAI);
// Khi có request GET tới /history, gọi hàm getChatHistory trong controller
router.get("/history", aiController.getChatHistory);
// HÀM MỚI: Xóa lịch sử chat
router.delete("/history", aiController.clearHistory);
// Route cho Build PC
router.post("/build-pc", aiController.buildPcWithAI);

module.exports = router;
