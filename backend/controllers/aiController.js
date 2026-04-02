const { GoogleGenerativeAI } = require("@google/generative-ai");
// Bổ sung import Model Sản Phẩm (Ông chủ nhớ check lại đường dẫn này nếu sai nhé)
const SanPham = require("../models/SanPham");

exports.chatWithAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Không tìm thấy API Key trong file .env!");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const { message, history } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. KÉO DỮ LIỆU THẬT TỪ DATABASE SQL LÊN
    let chuoiSanPham = "Đang cập nhật...";
    try {
      // Lấy danh sách tên sản phẩm (Giới hạn 50 cái để AI không bị quá tải bộ nhớ)
      const listSP = await SanPham.findAll({
        attributes: ["ten_san_pham"],
        limit: 50,
      });
      if (listSP && listSP.length > 0) {
        chuoiSanPham = listSP.map((sp) => sp.ten_san_pham).join(", ");
      }
    } catch (err) {
      console.error("Lỗi kéo DB cho AI:", err);
    }

    // 2. XỬ LÝ LỊCH SỬ CHAT
    let lichSu = "";
    if (history && history.length > 0) {
      lichSu = history
        .map((msg) => `${msg.role === "user" ? "Khách" : "AI"}: ${msg.text}`)
        .join("\n");
    }

    const homNay = new Date().toLocaleDateString("vi-VN");

    // 3. NHÉT DATA SQL VÀO LỜI DẶN AI
    const prompt = `
      Bạn là trợ lý AI thông minh của cửa hàng điện tử LTLShop.
      Thông tin hệ thống: Hôm nay là ${homNay}.
      Cách xưng hô: Luôn xưng là "Tôi" và gọi khách hàng là "Bạn".

      === DỮ LIỆU SẢN PHẨM CÓ THẬT ĐANG BÁN TRÊN WEB TẠI LTLSHOP ===
      ${chuoiSanPham}
      ===============================================================
      
      KIẾN THỨC BẮT BUỘC: 
      - Chỉ tư vấn dựa trên danh sách sản phẩm có thật ở trên.
      - Nếu khách hỏi sản phẩm không có trong danh sách, hãy nói: "Hiện tại LTLShop chưa có sẵn mã này, bạn tham khảo các mẫu khác nhé".
      - Không được tự bịa ra sản phẩm.

      === LỊCH SỬ TRÒ CHUYỆN TRƯỚC ĐÓ ===
      ${lichSu}
      ===================================
      
      Khách hàng vừa nhắn: "${message}"
      Nhiệm vụ: Trả lời ngắn gọn, súc tích, dựa trên lịch sử và dữ liệu sản phẩm có thật.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.status(200).json({ reply: response.text() });
  } catch (error) {
    console.error("Lỗi AI Controller:", error);
    res.status(500).json({ reply: "Bạn ơi, tôi hơi lag, đợi tôi tí nhé!" });
  }
};
