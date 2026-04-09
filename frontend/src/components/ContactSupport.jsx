import React, { useState, useEffect, useRef } from "react";
import * as Images from "../assets/images/index";
import * as Icons from "../assets/icons/index";

const ContactSupport = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Bạn ơi, tôi hơi lag, đợi tôi tí nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // HÀM MỚI: Xóa lịch sử chat
  const handleClearHistory = async () => {
    if (!window.confirm("Ông chủ có chắc muốn xóa sạch trí nhớ của AI không?"))
      return;

    // 1. Xóa ngay trên giao diện
    setMessages([
      {
        role: "bot",
        text: "Đã xóa lịch sử! Chào bạn, tôi có thể giúp gì cho bạn?",
      },
    ]);

    // 2. Gọi API để xóa sạch trong SQL Database
    try {
      await fetch("http://localhost:5000/api/ai/history", { method: "DELETE" });
    } catch (error) {
      console.error("Lỗi xóa lịch sử:", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans text-gray-800">
      {/* ... (Phần Menu và Nút Khiếu Nại giữ nguyên không đổi) ... */}
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

      <button
        onClick={() => {
          setShowMenu(!showMenu);
          if (showChat) setShowChat(false);
        }}
        className={`bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 font-bold transition-all cursor-pointer active:scale-95 ${showMenu ? "ring-4 ring-red-200" : ""}`}
      >
        Liên hệ{" "}
        <img
          src={Icons.Support}
          className="w-6 h-6 brightness-0"
          alt="Support"
        />
      </button>

      {/* ... (Phần form Feedback giữ nguyên) ... */}

      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          {/* HEADER CHAT CÓ THÊM NÚT XÓA */}
          <div className="bg-red-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${isLoading ? "bg-yellow-400 animate-bounce" : "bg-green-400"}`}
              ></div>
              <span className="font-bold">LTLShop Support</span>
            </div>

            {/* THÊM NÚT TẠI ĐÂY */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Xóa lịch sử trò chuyện"
                className="hover:bg-red-600 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              <button
                onClick={() => setShowChat(false)}
                className="hover:bg-red-600 p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>
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
