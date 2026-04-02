const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Khi có request POST tới /chat, gọi hàm chatWithAI trong controller
router.post("/chat", aiController.chatWithAI);
// Khi có request GET tới /history, gọi hàm getChatHistory trong controller
router.get("/history", aiController.getChatHistory);

module.exports = router;
