import React, { useState } from "react";
import * as Images from "../assets/images/index";
import * as Icons from "../assets/icons/index";

const ContactSupport = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // State cho Khiếu nại

  const initialMessages = [
    {
      sender: "bot",
      text: "Chào bạn, tôi là AI hỗ trợ bán hàng điện tử. Bạn có thể hỏi tôi về sản phẩm, chính sách đổi trả, hoặc bất kỳ thắc mắc nào liên quan đến mua sắm.",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
      {/* 1. Danh sách các nút lựa chọn */}
      {showMenu && (
        <div className="flex flex-col items-end gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <button
            onClick={() => {
              setShowFeedback(true);
              setShowMenu(false);
            }}
            className="bg-white text-gray-800 px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={Icons.KhieuNai}
              className="w-6 h-6 brightness-50 opacity-80 group-hover:opacity-100 transition-opacity"
              alt="khieu nai"
            />
            Khiếu nại | Góp ý
          </button>

          <button className="bg-white text-gray-800 px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group">
            <img
              src={Images.Zalo}
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              alt="zalo"
            />
            Liên hệ Zalo
          </button>

          <button
            onClick={() => {
              setShowChat(true);
              setShowMenu(false);
            }}
            className="bg-white text-gray-800 px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={Icons.ChatAI}
              className="w-6 h-6 brightness-50 opacity-80 group-hover:opacity-100 transition-opacity"
              alt="chat"
            />
            Chat với AI
          </button>
        </div>
      )}

      {/* 2. Nút "Liên hệ" chính */}
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

      {/* 3. Giao diện Popup Khiếu nại | Góp ý (Giữa màn hình) */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-500 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Gửi Khiếu nại & Góp ý</h3>
              <button
                onClick={() => setShowFeedback(false)}
                className="hover:bg-red-600 p-1 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none transition-all"
                  placeholder="Nhập tên của bạn..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none"
                  placeholder="Để nhân viên gọi lại hỗ trợ..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Loại yêu cầu
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none cursor-pointer">
                  <option>Góp ý về dịch vụ</option>
                  <option>Khiếu nại sản phẩm lỗi</option>
                  <option>Hỏi về tình trạng đơn hàng</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nội dung
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 outline-none resize-none"
                  placeholder="Bạn hãy mô tả chi tiết vấn đề nhé..."
                ></textarea>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-200">
                Gửi phản hồi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hộp thoại Chat AI */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-red-500 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold">Hệ thống Chat AI</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="hover:bg-red-600 p-1.5 rounded-full text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 bg-gray-50 p-4 text-sm text-gray-800 overflow-y-auto space-y-4">
            {initialMessages.map((msg, index) => (
              <div key={index} className="flex justify-start">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm font-medium">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-red-400"
              placeholder="Nhập câu hỏi của bạn..."
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-colors">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;
