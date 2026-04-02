const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Khi có request POST tới /chat, gọi hàm chatWithAI trong controller
router.post("/chat", aiController.chatWithAI);

module.exports = router;
