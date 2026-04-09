import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AiBuilder = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Chào bạn! Mình là AI chuyên gia Build PC của LTLShop. Bạn đang muốn ráp một bộ máy với tài chính khoảng bao nhiêu và dùng để làm gì (Chơi game, Làm đồ họa, hay Văn phòng)?",
    },
  ]);
  const [inputText, setInputText] = useState("");

  // Bảng lưu trữ linh kiện khách đang chọn
  const [currentBuild, setCurrentBuild] = useState({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    ssd: null,
    psu: null,
    case: null,
  });

  const chatEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalPrice = Object.values(currentBuild).reduce(
    (sum, item) => sum + (item?.price || 0),
    0,
  );

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 1. Thêm tin nhắn của User
    const newUserMsg = { id: Date.now(), sender: "user", text: inputText };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");

    // 2. GIẢ LẬP AI PHẢN HỒI (Sau này ông chủ nối API vào đây)
    setTimeout(() => {
      // Ví dụ: AI phân tích thấy người dùng muốn build máy 20 củ -> Đề xuất CPU
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Với tầm giá và nhu cầu đó, LTLShop hiện có sẵn 2 mẫu CPU cực kỳ tối ưu. Bạn chọn mẫu nào để mình tìm Mainboard tương thích nhé:",
        options: [
          {
            type: "cpu",
            name: "Intel Core i5-12400F",
            price: 3200000,
            image: "https://via.placeholder.com/80", // Thay bằng link ảnh thật
            desc: "6 nhân 12 luồng, quốc dân cho Gaming",
          },
          {
            type: "cpu",
            name: "AMD Ryzen 5 5600X",
            price: 3500000,
            image: "https://via.placeholder.com/80",
            desc: "Hiệu năng đa nhiệm tuyệt vời",
          },
        ],
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  // Xử lý khi khách hàng click chọn 1 linh kiện AI đề xuất
  const handleSelectComponent = (item) => {
    // 1. Cập nhật vào bảng Cấu hình bên phải
    setCurrentBuild((prev) => ({ ...prev, [item.type]: item }));

    // 2. Thêm tin nhắn thông báo đã chọn
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: `Mình chọn ${item.name}` },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: `Tuyệt vời! CPU ${item.name} cần đi với bo mạch chủ (Mainboard) Socket phù hợp. Đây là các lựa chọn tốt nhất trên web của LTLShop hiện tại:`,
      },
      // Sau này chỗ này gọi API lấy Mainboard từ Backend
    ]);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#201D8A] uppercase mb-2">
            Tư Vấn Build PC Cùng AI
          </h1>
          <p className="text-gray-600">
            Trả lời vài câu hỏi, AI sẽ giúp bạn cấu hình dàn máy tối ưu nhất
            trong tầm giá!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: KHUNG CHAT VỚI AI (Chiếm 2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[650px] overflow-hidden">
            <div className="bg-[#4A44F2] text-white p-4 font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              AI Chuyên Gia Build PC (Trực tuyến)
            </div>

            {/* Vùng hiển thị tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${msg.sender === "user" ? "bg-[#4A44F2] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>

                    {/* Hiển thị các Option linh kiện AI đề xuất */}
                    {msg.options && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.options.map((opt, idx) => (
                          <div
                            key={idx}
                            className="border border-[#4A44F2] rounded-lg p-3 hover:bg-blue-50 transition cursor-pointer flex flex-col justify-between h-full bg-white"
                            onClick={() => handleSelectComponent(opt)}
                          >
                            <div className="flex gap-3 mb-2">
                              <img
                                src={opt.image}
                                alt={opt.name}
                                className="w-16 h-16 object-contain bg-gray-100 rounded"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-[#201D8A] leading-tight">
                                  {opt.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {opt.desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 border-t pt-2">
                              <span className="font-bold text-red-600 text-sm">
                                {formatPrice(opt.price)}
                              </span>
                              <button className="bg-[#4A44F2] text-white text-xs px-2 py-1 rounded hover:bg-[#201D8A]">
                                Chọn
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Vùng nhập liệu */}
            <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="VD: Mình có 15 triệu, muốn build máy chơi Valorant..."
                className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-[#4A44F2] text-sm bg-gray-50"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#e30019] hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition cursor-pointer"
              >
                Gửi
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG TỔNG HỢP CẤU HÌNH (Chiếm 1/3) */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 h-fit sticky top-24">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-[#201D8A]">
              Cấu Hình Đã Chọn
            </h2>

            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {/* Danh sách linh kiện tĩnh để hiển thị layout */}
              {[
                { key: "cpu", label: "CPU - Vi xử lý" },
                { key: "mainboard", label: "Mainboard - Bo mạch" },
                { key: "ram", label: "RAM - Bộ nhớ trong" },
                { key: "vga", label: "VGA - Card màn hình" },
                { key: "ssd", label: "SSD - Ổ cứng" },
                { key: "psu", label: "PSU - Nguồn" },
                { key: "case", label: "Case - Vỏ máy" },
              ].map((part) => (
                <div
                  key={part.key}
                  className="border border-dashed border-gray-300 rounded p-3 flex justify-between items-center bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      {part.label}
                    </p>
                    {currentBuild[part.key] ? (
                      <p className="font-bold text-sm text-[#4A44F2] mt-1 line-clamp-1">
                        {currentBuild[part.key].name}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-1">
                        Đang chờ chọn...
                      </p>
                    )}
                  </div>
                  {currentBuild[part.key] && (
                    <span className="font-bold text-red-600 text-sm ml-2">
                      {formatPrice(currentBuild[part.key].price)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-gray-700 text-lg">
                  TỔNG TIỀN:
                </span>
                <span className="font-bold text-2xl text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Link to="/cart">
                <button
                  className={`w-full py-3 rounded font-bold text-white transition ${totalPrice > 0 ? "bg-[#e30019] hover:bg-red-700 cursor-pointer shadow-lg" : "bg-gray-400 cursor-not-allowed"}`}
                  disabled={totalPrice === 0}
                >
                  {totalPrice > 0
                    ? "THÊM TẤT CẢ VÀO GIỎ HÀNG"
                    : "HÃY CHỌN LINH KIỆN"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AiBuilder;
