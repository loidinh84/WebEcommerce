import React, { useState } from "react";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      text: "Chào ông chủ! Tôi có thể hỗ trợ gì về các thiết bị điện tử không ạ?",
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Thêm tin nhắn của người dùng
      setChatHistory([...chatHistory, { role: "user", text: message }]);
      setMessage("");

      // Giả lập bot trả lời sau 1s
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { role: "bot", text: "Nhân viên sẽ phản hồi ông ngay lập tức!" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Nút bấm tròn */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        )}
      </button>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white">
            <h3 className="font-bold text-lg">Hỗ trợ khách hàng</h3>
            <p className="text-xs opacity-80">Thường phản hồi trong vài phút</p>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 h-[350px] overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
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

export default ChatBox;
