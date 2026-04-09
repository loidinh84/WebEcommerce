import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AiBuilder = () => {
  // 1. DÙNG LOCAL STORAGE ĐỂ GIỮ LẠI TIN NHẮN KHI F5
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("ltl_ai_messages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            sender: "bot",
            text: "Chào bạn! Mình là AI chuyên gia Build PC của LTLShop. Bạn đang muốn ráp một bộ máy với tài chính khoảng bao nhiêu và dùng để làm gì (Chơi game, Làm đồ họa, hay Văn phòng)?",
          },
        ];
  });

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openCategory, setOpenCategory] = useState(null);
  const [suggestedOptions, setSuggestedOptions] = useState([]);

  // 2. DÙNG LOCAL STORAGE ĐỂ GIỮ LẠI CẤU HÌNH KHI F5
  const [currentBuild, setCurrentBuild] = useState(() => {
    const savedBuild = localStorage.getItem("ltl_ai_build");
    return savedBuild
      ? JSON.parse(savedBuild)
      : {
          cpu: null,
          mainboard: null,
          ram: null,
          vga: null,
          ssd: null,
          psu: null,
          case: null,
        };
  });

  const chatContainerRef = useRef(null);

  // Lưu tin nhắn vào Local Storage mỗi khi có tin mới
  useEffect(() => {
    localStorage.setItem("ltl_ai_messages", JSON.stringify(messages));
  }, [messages]);

  // Lưu cấu hình vào Local Storage mỗi khi chọn/xóa linh kiện
  useEffect(() => {
    localStorage.setItem("ltl_ai_build", JSON.stringify(currentBuild));
  }, [currentBuild]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userText },
    ]);
    setInputText("");
    setIsLoading(true);
    setSuggestedOptions([]);
    setOpenCategory(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai/build-pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.text || "Để mình tìm kiếm linh kiện phù hợp nhé...",
        },
      ]);

      if (data.options && data.options.length > 0) {
        setSuggestedOptions(data.options);
        const suggestedType = data.options[0].type?.toLowerCase() || "cpu";
        setOpenCategory(suggestedType);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Xin lỗi, đường truyền đang bị lỗi!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectComponent = async (item) => {
    const typeKey = item.type ? item.type.toLowerCase() : "cpu";

    setCurrentBuild((prev) => ({ ...prev, [typeKey]: item }));
    setOpenCategory(null);
    setSuggestedOptions([]);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: `Mình chọn ${item.name}` },
    ]);

    setIsLoading(true);

    const buildQuyTrinh = [
      "cpu",
      "mainboard",
      "ram",
      "vga",
      "ssd",
      "psu",
      "case",
    ];
    const tenLinhKien = {
      cpu: "CPU (Vi xử lý)",
      mainboard: "Mainboard (Bo mạch chủ)",
      ram: "RAM (Bộ nhớ trong)",
      vga: "VGA (Card đồ họa)",
      ssd: "SSD (Ổ cứng)",
      psu: "PSU (Nguồn)",
      case: "Case (Vỏ máy)",
    };

    const viTriHienTai = buildQuyTrinh.indexOf(typeKey);
    let cauLenhChoAI = "";

    if (viTriHienTai !== -1 && viTriHienTai < buildQuyTrinh.length - 1) {
      const monTiepTheo = buildQuyTrinh[viTriHienTai + 1];
      cauLenhChoAI = `Tôi đã chọn ${item.name}. Hãy tìm trong kho hàng và tư vấn ít nhất 3 lựa chọn tương thích cho món TIẾP THEO BẮT BUỘC LÀ: ${tenLinhKien[monTiepTheo]}. Hãy trả về thuộc tính type là "${monTiepTheo}". TUYỆT ĐỐI KHÔNG quay lại tư vấn ${tenLinhKien[typeKey]} nữa!`;
    } else {
      cauLenhChoAI = `Tôi đã chọn xong ${item.name}. Dàn PC của tôi đã hoàn tất trọn bộ 7 linh kiện! Hãy cho tôi một lời chúc mừng và đánh giá độ mạnh của dàn máy này. BẮT BUỘC trả về mảng options rỗng [].`;
    }

    try {
      const response = await fetch("http://localhost:5000/api/ai/build-pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cauLenhChoAI }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: data.text },
      ]);

      if (data.options && data.options.length > 0) {
        setSuggestedOptions(data.options);
        const newSuggestedType = data.options[0].type?.toLowerCase() || "cpu";
        setOpenCategory(newSuggestedType);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. HÀM XỬ LÝ XÓA SẢN PHẨM KHỎI CẤU HÌNH
  const handleRemoveComponent = (typeKey) => {
    setCurrentBuild((prev) => ({ ...prev, [typeKey]: null }));
  };

  // 4. HÀM LÀM MỚI TOÀN BỘ (RESET)
  const handleResetBuild = () => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa toàn bộ cấu hình và đoạn chat để làm lại từ đầu?",
      )
    ) {
      localStorage.removeItem("ltl_ai_build");
      localStorage.removeItem("ltl_ai_messages");
      setCurrentBuild({
        cpu: null,
        mainboard: null,
        ram: null,
        vga: null,
        ssd: null,
        psu: null,
        case: null,
      });
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Chào bạn! Mình là AI chuyên gia Build PC của LTLShop. Bạn đang muốn ráp một bộ máy với tài chính khoảng bao nhiêu và dùng để làm gì?",
        },
      ]);
      setSuggestedOptions([]);
      setOpenCategory(null);
    }
  };

  const categories = [
    { key: "cpu", label: "CPU - Vi xử lý" },
    { key: "mainboard", label: "Mainboard - Bo mạch" },
    { key: "ram", label: "RAM - Bộ nhớ trong" },
    { key: "vga", label: "VGA - Card màn hình" },
    { key: "ssd", label: "SSD - Ổ cứng" },
    { key: "psu", label: "PSU - Nguồn" },
    { key: "case", label: "Case - Vỏ máy" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-[#201D8A] uppercase mb-2">
              Tư Vấn Build PC Cùng AI
            </h1>
          </div>
          {/* NÚT LÀM MỚI TOÀN BỘ */}
          <button
            onClick={handleResetBuild}
            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Làm mới lại từ đầu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: KHUNG CHAT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[700px] overflow-hidden">
            <div className="bg-[#4A44F2] text-white p-4 font-bold flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isLoading ? "bg-yellow-400 animate-bounce" : "bg-green-400"}`}
              ></div>
              AI Chuyên Gia Build PC (Trực tuyến)
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3.5 ${msg.sender === "user" ? "bg-[#4A44F2] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-400 rounded-xl rounded-bl-none shadow-sm p-3 text-sm italic">
                    AI đang lục tìm kho hàng...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                placeholder="VD: Mình có 15 triệu, muốn ráp máy đồ họa..."
                className="flex-1 border rounded-full px-4 py-2.5 outline-none focus:border-[#4A44F2] text-sm bg-gray-50 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-[#e30019] hover:bg-red-700 text-white px-8 py-2.5 rounded-full font-bold transition cursor-pointer disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: BÀN LÀM VIỆC */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 h-fit sticky top-24">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-[#201D8A]">
                Cấu Hình Của Bạn
              </h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-normal">
                {Object.values(currentBuild).filter((i) => i !== null).length}/7
                linh kiện
              </span>
            </div>

            <div className="space-y-3 mb-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {categories.map((part) => {
                const isSelected = currentBuild[part.key];
                const isSuggestingHere =
                  suggestedOptions &&
                  suggestedOptions.some(
                    (opt) => opt.type?.toLowerCase() === part.key,
                  );
                const isOpen = openCategory === part.key;

                return (
                  <div
                    key={part.key}
                    className={`border rounded-lg transition-all duration-300 ${isOpen ? "border-[#4A44F2] shadow-md bg-white" : "border-dashed border-gray-300 bg-gray-50"}`}
                  >
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <p
                          className={`text-[11px] font-bold uppercase ${isOpen ? "text-[#4A44F2]" : "text-gray-500"}`}
                        >
                          {part.label}
                        </p>
                        {isSelected ? (
                          <p
                            className={`font-bold text-sm mt-0.5 line-clamp-1 ${isOpen ? "text-gray-400 line-through" : "text-[#4A44F2]"}`}
                          >
                            {isSelected.name}
                          </p>
                        ) : (
                          <p className="text-[13px] text-gray-400 italic mt-0.5">
                            Đang chờ chọn...
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {isSelected && !isOpen && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-600 text-sm whitespace-nowrap">
                              {formatPrice(isSelected.price)}
                            </span>
                            {/* NÚT THÙNG RÁC ĐỂ XÓA LINH KIỆN */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Ngăn không cho click mở ô Dropdown
                                handleRemoveComponent(part.key);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md"
                              title="Xóa linh kiện này"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[18px] w-[18px]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        {isSuggestingHere && (
                          <span
                            className={`transform transition-transform text-[#4A44F2] ${isOpen ? "rotate-180" : "rotate-0"}`}
                          >
                            ▼
                          </span>
                        )}
                      </div>
                    </div>

                    {isOpen && isSuggestingHere && (
                      <div className="border-t border-gray-100 p-2 space-y-2 bg-blue-50/30 rounded-b-lg">
                        <p className="text-xs font-semibold text-[#4A44F2] px-1 flex items-center gap-1">
                          <span className="animate-pulse">⚡</span> AI đề xuất:
                        </p>
                        {suggestedOptions
                          .filter((opt) => opt.type?.toLowerCase() === part.key)
                          .map((opt, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-gray-200 rounded p-2.5 hover:border-[#4A44F2] shadow-sm transition cursor-pointer flex flex-col gap-2"
                              onClick={() => handleSelectComponent(opt)}
                            >
                              <div className="flex gap-3">
                                <img
                                  src={opt.image}
                                  alt={opt.name}
                                  className="w-14 h-14 object-cover border rounded bg-gray-50"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-xs text-gray-800 leading-snug line-clamp-2 hover:text-[#4A44F2]">
                                    {opt.name}
                                  </h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                                    {opt.desc}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center border-t pt-2">
                                <span className="font-bold text-red-600 text-sm">
                                  {formatPrice(opt.price)}
                                </span>
                                <button className="bg-[#4A44F2] text-white text-[11px] px-3 py-1 rounded hover:bg-[#201D8A] font-medium">
                                  Chọn
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-auto">
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
