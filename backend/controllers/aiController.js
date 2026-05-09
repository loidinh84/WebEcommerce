const { GoogleGenerativeAI } = require("@google/generative-ai");
const SanPham = require("../models/SanPham");
const BienTheSanPham = require("../models/BienTheSanPham");
const ChatHistory = require("../models/ChatHistory");

exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findAll({
      order: [["createdAt", "ASC"]],
      limit: 50,
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = req.body;

    // Lấy data sản phẩm
    const listSP = await SanPham.findAll({
      attributes: ["ten_san_pham"],
      limit: 50,
    });
    const chuoiSanPham = listSP.map((sp) => sp.ten_san_pham).join(", ");

    // Lệnh tối cao (Kỷ luật thép)
    const systemInstruction = `
      Bạn là Chuyên gia tư vấn cao cấp của LTLShop, có kiến thức sâu rộng về phần cứng máy tính và Gaming Gear.
      
      PHONG CÁCH TƯ VẤN:
      1. Nhiệt tình, chuyên nghiệp, luôn đặt lợi ích của khách hàng lên hàng đầu.
      2. Biết khen ngợi những lựa chọn thông minh của khách.
      3. Khi khách chào hỏi, hãy chào lại thật nồng nhiệt và giới thiệu các chương trình khuyến mãi hiện có.
      4. Nếu khách hỏi giá, hãy tư vấn khoảng giá thị trường và mời khách liên hệ Hotline để có giá ưu đãi nhất.
      5. HỖ TRỢ TOÀN DIỆN: Bạn tư vấn được tất cả từ linh kiện PC cho đến Màn hình, Bàn phím, Chuột, Tai nghe, và cả Ghế Gaming.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // Lấy lịch sử và chuyển sang format chuẩn của Gemini
    const oldMessages = await ChatHistory.findAll({
      order: [["createdAt", "ASC"]],
      limit: 10,
    });
    const historyGemini = oldMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Bắt đầu chat
    const chatSession = model.startChat({ history: historyGemini });
    const result = await chatSession.sendMessage(message);
    const botReply = result.response.text();

    // Lưu SQL
    await ChatHistory.create({ role: "user", text: message });
    await ChatHistory.create({ role: "bot", text: botReply });

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Lỗi Gemini Chat:", error);
    const errorMsg = error.status === 503 
      ? "Hệ thống AI đang quá tải, bạn vui lòng đợi 1 phút rồi thử lại nhé!" 
      : "Rất tiếc, AI đang gặp chút sự cố kỹ thuật!";
    res.status(200).json({ reply: errorMsg });
  }
};

exports.buildPcWithAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message, currentBuild } = req.body;
    
    // Chuyển build hiện tại sang text để AI đọc
    const buildText = currentBuild ? Object.entries(currentBuild)
      .filter(([_, val]) => val !== null)
      .map(([key, val]) => `- ${key.toUpperCase()}: ${val.name} (${val.price}đ)`)
      .join("\n") : "Chưa chọn gì";

    // 1. CHỈ LẤY SẢN PHẨM ĐANG BÁN
    const listSP = await SanPham.findAll({
      where: {
        trang_thai: "active",
      },
      include: [{ model: BienTheSanPham, as: "bien_the" }],
      limit: 150,
    });

    const khoHang = listSP.map((sp) => ({
      ten: sp.ten_san_pham,
      gia: sp.bien_the?.[0]?.gia_ban || 0,
      anh: sp.hinh_anh || "https://placehold.co/80",
    }));

    // 2. PROMPT CHUYÊN BIỆT: ÉP CHIA NGÂN SÁCH VÀ NHIỀU LỰA CHỌN
    const systemInstruction = `
      Bạn là Chuyên gia Build PC & Gaming Setup chuyên nghiệp. Nhiệm vụ của bạn là giúp khách hàng sở hữu dàn máy mơ ước.
      
      QUY TẮC TƯ VẤN CAO CẤP:
      1. CẤU HÌNH HIỆN TẠI:
      ${buildText}
      => Hãy phân tích cấu hình này, khen ngợi nếu nó hợp lý hoặc cảnh báo nếu có sự mất cân đối. Đừng hỏi lại những gì khách đã chọn.

      2. PHẠM VI TƯ VẤN RỘNG: Bạn hỗ trợ trọn gói 21 món linh kiện. TUYỆT ĐỐI KHÔNG ĐƯỢC TỪ CHỐI tư vấn bất kỳ món nào trong danh sách 21 món (đặc biệt là Chuột, Bàn phím, Màn hình, Ghế). Nếu khách hỏi, bạn BẮT BUỘC phải đưa ra gợi ý từ kho hàng.
      3. TƯ DUY TỐI ƯU: Nếu khách có ngân sách cụ thể, hãy phân bổ tiền cực kỳ thông minh giữa hiệu năng (CPU/VGA) và thẩm mỹ (Case/Fan/Gear).
      4. ĐA DẠNG LỰA CHỌN: Mỗi món cần đề xuất 3-4 phương án (Giá rẻ - Hiệu năng - Cao cấp) để khách dễ chọn.

      KHO HÀNG HIỆN CÓ: ${JSON.stringify(khoHang)}.
      
      BẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON NHƯ SAU, KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO KHÁC BÊN NGOÀI JSON:
      {
        "text": "Lời tư vấn ráp máy (Ngắn gọn, chuyên nghiệp, nhiệt tình)",
        "options": [
          {
            "type": "cpu", 
            "name": "Tên linh kiện từ KHO HÀNG",
            "price": 1000000,
            "image": "Link ảnh từ KHO HÀNG",
            "desc": "Ưu điểm ngắn gọn"
          }
        ]
      }
      
      LƯU Ý: Nếu khách hàng chưa chọn xong các linh kiện trước đó (CPU, Mainboard...), hãy nhắc nhở họ chọn các bước quan trọng đó trước để có thể tư vấn PSU/VGA chính xác nhất.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    const chatSession = model.startChat({ history: [] });
    const result = await chatSession.sendMessage(message);
    const rawReply = result.response.text();

    let botResponseData;
    try {
      // Bug Fix: Sử dụng regex không tham lam để chỉ lấy khối JSON ĐẦU TIÊN
      const jsonMatch = rawReply.match(/\{[\s\S]*?\}/); 
      let cleanJson = jsonMatch ? jsonMatch[0] : rawReply;
      
      botResponseData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Lỗi parse JSON AI:", e.message);
      // Fallback: Tuyệt đối không để trả về lỗi 500
      const textOnly = rawReply.replace(/\{[\s\S]*\}/g, "").split("{")[0].trim();
      botResponseData = { 
        text: textOnly || "Mình đã tìm được những linh kiện tuyệt vời nhất cho bạn, cùng xem nhé!", 
        options: [] 
      };
    }

    res.status(200).json(botResponseData);
  } catch (error) {
    console.error("Lỗi Gemini Build PC:", error.message);
    res.status(200).json({ 
      text: "AI đang bận một chút, bạn nhấn gửi lại để mình tư vấn tiếp nhé!", 
      options: [] 
    });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    // Xóa sạch toàn bộ dữ liệu trong bảng ChatHistory
    await ChatHistory.destroy({ where: {} });
    res.status(200).json({ message: "Đã xóa sạch trí nhớ AI!" });
  } catch (error) {
    console.error("Lỗi xóa lịch sử:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.compareProductsAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const { product1, product2 } = req.body;

    if (!product1 || !product2) {
      return res
        .status(400)
        .json({
          message: "Vui lòng cung cấp thông tin 2 sản phẩm cần so sánh.",
        });
    }

    const systemInstruction = `
      Bạn là chuyên gia tư vấn công nghệ của Shop. 
      Nhiệm vụ của bạn là so sánh 2 sản phẩm dựa trên thông số kỹ thuật được cung cấp nếu sản phẩm không có hãy lên mạng và tìm lấy những thông tin liên quan.
      
      YÊU CẦU:
      1. Phân tích khách quan, chính xác dựa trên dữ liệu.
      2. Nêu bật điểm mạnh, điểm yếu của từng sản phẩm.
      3. Đưa ra lời khuyên chọn mua phù hợp với từng nhu cầu (ví dụ: "chọn A nếu thích chụp ảnh, chọn B nếu cần chơi game").
      4. Ngôn từ thân thiện, dễ hiểu, KHÔNG quá dài dòng.

      BẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON NHƯ SAU (Không có markdown block \`\`\`json):
      {
        "summary": "Một câu tóm tắt chung về sự khác biệt chính giữa 2 sản phẩm",
        "product1": {
          "pros": ["ưu điểm 1", "ưu điểm 2"],
          "cons": ["nhược điểm 1"]
        },
        "product2": {
          "pros": ["ưu điểm 1", "ưu điểm 2"],
          "cons": ["nhược điểm 1"]
        },
        "verdict": "Kết luận chi tiết: Ai nên mua sản phẩm nào?"
      }
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    const prompt = `
      Sản phẩm 1:
      - Tên: ${product1.name}
      - Giá: ${product1.price}
      - Thông số: ${JSON.stringify(product1.specs)}

      Sản phẩm 2:
      - Tên: ${product2.name}
      - Giá: ${product2.price}
      - Thông số: ${JSON.stringify(product2.specs)}
    `;

    const result = await model.generateContent(prompt);
    const rawReply = result.response.text();

    let botResponseData;
    try {
      const cleanJson = rawReply
        .replace(/^[\\s\\S]*?\\{/, "{") // Remove any prefix text before first {
        .replace(/\\}[^}]*$/, "}"); // Remove any suffix text after last }
      botResponseData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Lỗi parse JSON từ Gemini:", e, rawReply);
      return res.status(500).json({ message: "Lỗi xử lý ngôn ngữ AI" });
    }

    res.status(200).json(botResponseData);
  } catch (error) {
    console.error("Lỗi Compare AI:", error);
    res.status(500).json({ message: "Lỗi kết nối AI" });
  }
};

exports.checkProductType = async (req, res) => {
  try {
    const { product1Name, product2Name } = req.body;
    if (!product1Name || !product2Name) {
      return res
        .status(400)
        .json({ error: "Vui lòng cung cấp tên 2 sản phẩm" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Nhiệm vụ của bạn là kiểm tra xem 2 sản phẩm sau đây có cùng chủng loại (ví dụ: cùng là điện thoại, cùng là laptop, cùng là chuột, cùng là máy tính bảng, v.v) hay không.
      Đừng phân biệt "cũ" và "mới" (ví dụ "Điện thoại cũ iPhone 13" và "Điện thoại iPhone 15" vẫn là cùng chủng loại).
      Sản phẩm 1: "${product1Name}"
      Sản phẩm 2: "${product2Name}"
      
      BẮT BUỘC trả về ĐÚNG định dạng JSON như sau, không kèm bất kỳ text nào khác (không có markdown block \`\`\`json):
      {
        "isSameType": true hoặc false,
        "reason": "Giải thích ngắn gọn"
      }
    `;

    const result = await model.generateContent(prompt);
    const rawReply = result.response.text();
    let cleanJson = rawReply
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    // Xử lý loại bỏ text thừa xung quanh
    cleanJson = cleanJson.replace(/^[\s\S]*?\{/, "{").replace(/\}[^}]*$/, "}");
    const botResponseData = JSON.parse(cleanJson);

    res.json(botResponseData);
  } catch (error) {
    console.error("Lỗi check type AI:", error);
    // Fallback to true if AI fails, so we don't block the user unnecessarily
    res.json({ isSameType: true, reason: "Bỏ qua kiểm tra do lỗi AI" });
  }
};
