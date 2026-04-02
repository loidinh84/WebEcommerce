const { GoogleGenerativeAI } = require("@google/generative-ai");
const SanPham = require("../models/SanPham");
const ChatHistory = require("../models/ChatHistory");

// 1. Hàm lấy lịch sử chat từ Database (Dùng khi vừa load trang web)
exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findAll({
      order: [["createdAt", "ASC"]],
      limit: 50,
    });
    res.status(200).json(history);
  } catch (error) {
    console.error("Lỗi lấy lịch sử:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Hàm xử lý Chat chính
exports.chatWithAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Không tìm thấy API Key!");

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = req.body; // Không cần nhận history từ frontend nữa
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    // --- BƯỚC 1: LẤY LỊCH SỬ TỪ DATABASE SQL ---
    const oldMessages = await ChatHistory.findAll({
      order: [["createdAt", "ASC"]],
      limit: 20, // Lấy 20 câu gần nhất để AI nhớ ngữ cảnh
    });

    const lichSu = oldMessages
      .map((msg) => `${msg.role === "user" ? "Khách" : "AI"}: ${msg.text}`)
      .join("\n");

    // --- BƯỚC 2: KÉO DỮ LIỆU SẢN PHẨM ---
    let chuoiSanPham = "Đang cập nhật...";
    const listSP = await SanPham.findAll({
      attributes: ["ten_san_pham"],
      limit: 50,
    });
    if (listSP.length > 0) {
      chuoiSanPham = listSP.map((sp) => sp.ten_san_pham).join(", ");
    }

    const homNay = new Date().toLocaleDateString("vi-VN");

    // --- BƯỚC 3: TẠO PROMPT ---
    const prompt = `
      Bạn là trợ lý AI thông minh của LTLShop. Hôm nay là ${homNay}.
      Sản phẩm có sẵn: ${chuoiSanPham}
      
      === LỊCH SỬ CHAT VỪA QUA (LẤY TỪ DATABASE) ===
      ${lichSu}
      ==============================================

      Câu hỏi mới của khách: "${message}"
      Nhiệm vụ: Trả lời ngắn gọn, dựa vào lịch sử và data sản phẩm. Xưng "Tôi" và "Bạn".
    `;

    const result = await model.generateContent(prompt);
    const botReply = result.response.text();

    // --- BƯỚC 4: LƯU CẢ 2 TIN VÀO SQL SERVER ---
    // Lưu tin khách nhắn
    await ChatHistory.create({ role: "user", text: message });
    // Lưu tin AI trả lời
    await ChatHistory.create({ role: "bot", text: botReply });

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Lỗi AI Controller:", error);
    res.status(500).json({ reply: "Bạn ơi, tôi hơi lag, đợi tôi tí nhé!" });
  }
};
