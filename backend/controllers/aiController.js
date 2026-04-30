const { GoogleGenerativeAI } = require("@google/generative-ai");
const SanPham = require("../models/SanPham");
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
      Bạn là nhân viên CSKH của LTLShop. Ngày ${new Date().toLocaleDateString("vi-VN")}để treck thông tin sản phẩm mới nhất hiện tại, không càn nói ngày tháng ra đâu.
      Danh sách sản phẩm: [${chuoiSanPham}].

      KỶ LUẬT BẮT BUỘC PHẢI TUÂN THỦ:
      1. KHI KHÁCH CHỈ CHÀO HỎI (Vd: "hi", "hello", "alo", "chào", "y"): BẠN CHỈ ĐƯỢC CHÀO LẠI VÀ HỎI HỌ CẦN GIÚP GÌ. TUYỆT ĐỐI CẤM TỰ Ý NHẮC ĐẾN HOẶC GỢI Ý BẤT KỲ TÊN SẢN PHẨM NÀO.
      2. Chỉ tư vấn thông tin khi khách HỎI ĐÍCH DANH sản phẩm đó hoặc nhờ tư vấn theo nhu cầu.
      3. Nếu khách hỏi giá, đáp: "Giá đang được cập nhật, vui lòng liên hệ hotline".
      4. Trả lời ngắn gọn, lịch sự.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
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
    console.error(error);
    res.status(500).json({ reply: "Xin lỗi tôi đang lag!" });
  }
};

exports.buildPcWithAI = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = req.body;

    // 1. CHỈ LẤY SẢN PHẨM ĐANG BÁN
    // (Lưu ý: Thuộc hạ đang giả sử cột trạng thái bán trong DB của ông chủ là 'trang_thai: 1' hoặc 'so_luong > 0'. Ông chủ nhớ đổi tên cột này cho đúng với DB thực tế nhé!)
    const listSP = await SanPham.findAll({
      where: {
        trang_thai: 1, // Chỉ lấy hàng đang bán (Ông chủ sửa lại điều kiện này cho khớp DB)
      },
      limit: 150, // Tăng limit lên để AI có nhiều "đồ chơi" cân đo đong đếm hơn
    });

    const khoHang = listSP.map((sp) => ({
      ten: sp.ten_san_pham,
      gia: sp.gia,
      anh: sp.hinh_anh || "https://via.placeholder.com/80",
    }));

    // 2. PROMPT CHUYÊN BIỆT: ÉP CHIA NGÂN SÁCH VÀ NHIỀU LỰA CHỌN
    const systemInstruction = `
      Bạn là AI Kỹ Thuật của LTLShop, TRÁCH NHIỆM DUY NHẤT LÀ TƯ VẤN RÁP MÁY TÍNH ĐỂ BÀN (DESKTOP PC).
      KHO HÀNG HIỆN CÓ: ${JSON.stringify(khoHang)}.
      
      QUY TẮC BÁN HÀNG TỐI THƯỢNG:
      1. TUYỆT ĐỐI KHÔNG tư vấn LAPTOP, MÀN HÌNH, CHUỘT, BÀN PHÍM. Chỉ tư vấn linh kiện PC (CPU, Mainboard, RAM, VGA, SSD, PSU, Case).
      2. NGHIỆP VỤ KẾ TOÁN (RẤT QUAN TRỌNG): Khi khách hàng nói ra tổng ngân sách (Ví dụ: 15 triệu, 20 triệu), BẠN PHẢI TỰ ĐỘNG PHÂN BỔ TỶ LỆ TIỀN cho 7 món linh kiện sao cho hợp lý (VD: VGA chiếm khoảng 30-40%, CPU chiếm 20% tổng ngân sách...). CÁC ĐỀ XUẤT CỦA BẠN PHẢI NẰM ĐÚNG TRONG PHẦN NGÂN SÁCH ĐÃ CHIA, tuyệt đối không tư vấn 1 món linh kiện quá đắt làm lố tổng tiền của khách.
      3. MỖI LẦN TƯ VẤN MỘT LOẠI LINH KIỆN, BẠN BẮT BUỘC PHẢI ĐỀ XUẤT ÍT NHẤT 3 ĐẾN 4 LỰA CHỌN KHÁC NHAU (nằm trong tầm tiền vừa phân bổ) để khách hàng so sánh.

      BẮT BUỘC TRẢ VỀ CHUẨN JSON NHƯ SAU:
      {
        "text": "Lời tư vấn ráp máy (VD: Với ngân sách 15 triệu của bạn, mình sẽ trích khoảng 3 triệu cho CPU. Dưới đây là 3 mẫu CPU ngon nhất trong khoảng giá này để bạn chọn...)",
        "options": [
          {
            "type": "cpu", 
            "name": "Tên linh kiện số 1",
            "price": 1000000,
            "image": "Link ảnh",
            "desc": "Ưu điểm của con này là giá rẻ..."
          },
          {
            "type": "cpu", 
            "name": "Tên linh kiện số 2",
            "price": 1500000,
            "image": "Link ảnh",
            "desc": "Hiệu năng cân bằng, rất đáng tiền..."
          },
          {
            "type": "cpu", 
            "name": "Tên linh kiện số 3",
            "price": 2500000,
            "image": "Link ảnh",
            "desc": "Con quái vật hiệu năng trong phân khúc..."
          }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: systemInstruction,
    });

    const chatSession = model.startChat({ history: [] });
    const result = await chatSession.sendMessage(message);
    const rawReply = result.response.text();

    let botResponseData;
    try {
      const cleanJson = rawReply
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      botResponseData = JSON.parse(cleanJson);
    } catch (e) {
      botResponseData = { text: rawReply, options: [] };
    }

    res.status(200).json(botResponseData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ text: "Hệ thống Build PC đang bảo trì!", options: [] });
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
      return res.status(400).json({ message: "Vui lòng cung cấp thông tin 2 sản phẩm cần so sánh." });
    }

    const systemInstruction = `
      Bạn là chuyên gia tư vấn công nghệ của LTLShop. 
      Nhiệm vụ của bạn là so sánh 2 sản phẩm dựa trên thông số kỹ thuật được cung cấp.
      
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
      return res.status(400).json({ error: "Vui lòng cung cấp tên 2 sản phẩm" });
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
    let cleanJson = rawReply.replace(/```json/gi, "").replace(/```/g, "").trim();
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
