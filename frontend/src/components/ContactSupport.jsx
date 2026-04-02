import React, { useState, useEffect, useRef } from "react";
import * as Images from "../assets/images/index";
import * as Icons from "../assets/icons/index";

const ContactSupport = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo mảng rỗng, dữ liệu sẽ được đổ vào từ useEffect
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);

  // 1. Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. LẤY LỊCH SỬ TỪ DATABASE KHI VỪA LOAD TRANG (GIỐNG SHOPEE)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ai/history");
        const data = await response.json();

        if (data && data.length > 0) {
          setMessages(data);
        } else {
          // Nếu DB trống, hiện câu chào mặc định
          setMessages([
            {
              role: "bot",
              text: "Chào bạn nhé! Tôi là trợ lý của LTLShop đây. Bạn đang cần tôi tư vấn món đồ công nghệ nào không?",
            },
          ]);
        }
      } catch (error) {
        console.error("Không thể lấy lịch sử chat:", error);
      }
    };

    fetchHistory();
  }, []);

  // 3. Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    // Cập nhật giao diện ngay lập tức cho người dùng thấy
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Chỉ cần gửi tin nhắn hiện tại, Backend sẽ tự lục DB lấy history
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();
      // Thêm câu trả lời của AI vào danh sách hiển thị
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Bạn ơi, tôi hơi lag, đợi tôi tí nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans text-gray-800">
      {/* 1. Menu lựa chọn */}
      {showMenu && (
        <div className="flex flex-col items-end gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <button
            onClick={() => {
              setShowFeedback(true);
              setShowMenu(false);
            }}
            className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={Icons.KhieuNai}
              className="w-6 h-6 brightness-50 opacity-80 group-hover:opacity-100"
              alt="support"
            />
            Khiếu nại | Góp ý
          </button>

          <button
            onClick={() => window.open("https://zalo.me/SĐT_CỦA_BẠN", "_blank")}
            className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={Images.Zalo}
              className="w-5 h-5 group-hover:scale-110"
              alt="zalo"
            />
            Liên hệ Zalo
          </button>

          <button
            onClick={() => {
              setShowChat(true);
              setShowMenu(false);
            }}
            className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={Icons.ChatAI}
              className="w-6 h-6 brightness-50 opacity-80 group-hover:opacity-100"
              alt="chat"
            />
            Chat với AI
          </button>
        </div>
      )}

      {/* 2. Nút Liên hệ chính */}
      <button
        onClick={() => {
          setShowMenu(!showMenu);
          if (showChat) setShowChat(false);
        }}
        className={`bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 font-bold transition-all cursor-pointer active:scale-95 ${showMenu ? "ring-4 ring-red-200" : ""}`}
      >
        Liên hệ
        <img
          src={Icons.Support}
          className="w-6 h-6 brightness-0"
          alt="Support"
        />
      </button>

      {/* 3. Popup Khiếu nại */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-500 p-4 text-white flex justify-between items-center font-bold">
              <span>Gửi Khiếu nại & Góp ý</span>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-red-500"
                placeholder="Họ và tên"
              />
              <input
                type="tel"
                className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-red-500"
                placeholder="Số điện thoại"
              />
              <textarea
                rows="4"
                className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-red-500 resize-none"
                placeholder="Nội dung bạn cần góp ý..."
              ></textarea>
              <button className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors cursor-pointer">
                Gửi phản hồi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Khung Chat AI */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-red-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${isLoading ? "bg-yellow-400 animate-bounce" : "bg-green-400"}`}
              ></div>
              <span className="font-bold">LTLShop Support</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="hover:bg-red-600 p-1 rounded-full cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 bg-gray-50 p-4 text-sm overflow-y-auto space-y-4 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-red-500 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-100 rounded-bl-none font-medium"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start italic text-gray-400 text-xs px-2">
                Tôi đang suy nghĩ...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-400"
              placeholder="Bạn hỏi tôi gì đi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;
