import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config/api";
import { StoreContext } from "../context/StoreContext";
import * as Icons from "../assets/icons/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import NO_IMAGE from "../assets/images/NoImage.webp";

const THEME = {
  gradient: "linear-gradient(135deg,#7c3aed,#2563eb)",
  bg: "#f8fafc",
  chatBg: "#f1f5f9",
  border: "#e2e8f0",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
};

const PLACEHOLDER_IMG = NO_IMAGE;

const CompIcon = ({ name }) => {
  const iconMap = {
    cpu: <Icons.Memory className="w-5 h-5" />,
    mainboard: <Icons.Build className="w-5 h-5" />,
    ram: <Icons.Memory className="w-5 h-5" />,
    vga: <Icons.PC className="w-5 h-5" />,
    ssd: <Icons.Inventory className="w-5 h-5" />,
    psu: <Icons.Setting className="w-5 h-5" />,
    case: <Icons.Box className="w-5 h-5" />,
    cooler: <Icons.Support className="w-5 h-5" />,
    hdd: <Icons.Inventory className="w-5 h-5" />,
    monitor: <Icons.PC className="w-5 h-5" />,
    keyboard: <Icons.Keyboard className="w-5 h-5" />,
    mouse: <Icons.Mouse className="w-5 h-5" />,
  };

  return iconMap[name] || <Icons.Build className="w-5 h-5" />;
};

const CATEGORIES = [
  {
    key: "cpu",
    label: "CPU - BỘ VI XỬ LÝ",
    dbId: 32,
    sub: "Vi xử lý",
    icon: <CompIcon name="cpu" />,
  },
  {
    key: "mainboard",
    label: "MAIN - BO MẠCH CHỦ",
    dbId: 56,
    sub: "Bo mạch chủ",
    icon: <CompIcon name="mainboard" />,
  },
  {
    key: "ram",
    label: "RAM - BỘ NHỚ TRONG",
    dbId: 34,
    sub: "Bộ nhớ trong",
    icon: <CompIcon name="ram" />,
  },
  {
    key: "ssd1",
    label: "Ổ CỨNG SSD 1",
    dbId: 57,
    sub: "Ổ cứng SSD",
    icon: <CompIcon name="ssd" />,
  },
  {
    key: "ssd2",
    label: "Ổ CỨNG SSD 2",
    dbId: 57,
    sub: "Ổ cứng SSD",
    icon: <CompIcon name="ssd" />,
  },
  {
    key: "hdd",
    label: "Ổ CỨNG HDD",
    dbId: 35,
    sub: "Ổ cứng HDD",
    icon: <CompIcon name="hdd" />,
  },
  {
    key: "vga",
    label: "VGA - CARD MÀN HÌNH",
    dbId: 37,
    sub: "Card đồ họa",
    icon: <CompIcon name="vga" />,
  },
  {
    key: "psu",
    label: "PSU - NGUỒN MÁY TÍNH",
    dbId: 58,
    sub: "Nguồn điện",
    icon: <CompIcon name="psu" />,
  },
  {
    key: "case",
    label: "CASE - VỎ MÁY TÍNH",
    dbId: 39,
    sub: "Vỏ máy tính",
    icon: <CompIcon name="case" />,
  },
  {
    key: "cooler_air",
    label: "TẢN NHIỆT KHÍ",
    dbId: 59,
    sub: "Tản nhiệt khí",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "cooler_aio",
    label: "TẢN NHIỆT NƯỚC AIO",
    dbId: 59,
    sub: "Tản nhiệt AIO",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "cooler_custom",
    label: "TẢN NHIỆT NƯỚC CUSTOM",
    dbId: 59,
    sub: "Tản nhiệt Custom",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "fan",
    label: "FAN TẢN NHIỆT",
    dbId: 59,
    sub: "Quạt làm mát",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "monitor1",
    label: "MONITOR - MÀN HÌNH",
    dbId: 20,
    sub: "Màn hình",
    icon: <CompIcon name="monitor" />,
  },
  {
    key: "monitor2",
    label: "MONITOR - MÀN HÌNH 2",
    dbId: 20,
    sub: "Màn hình phụ",
    icon: <CompIcon name="monitor" />,
  },
  {
    key: "keyboard",
    label: "BÀN PHÍM",
    dbId: 27,
    sub: "Bàn phím",
    icon: <CompIcon name="keyboard" />,
  },
  {
    key: "mouse",
    label: "MOUSE - CHUỘT",
    dbId: 21,
    sub: "Chuột",
    icon: <CompIcon name="mouse" />,
  },
  {
    key: "pad",
    label: "PAD - BÀN DI CHUỘT",
    dbId: 6,
    sub: "Bàn di chuột",
    icon: <CompIcon name="mouse" />,
  },
  {
    key: "headphone",
    label: "TAI NGHE",
    dbId: 26,
    sub: "Tai nghe",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "speaker",
    label: "LOA",
    dbId: 6,
    sub: "Thiết bị âm thanh",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "chair",
    label: "GHẾ GAMING",
    dbId: 6,
    sub: "Ghế chơi game",
    icon: <CompIcon name="case" />,
  },
];

const EMPTY_BUILD = CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat.key]: null }),
  {},
);

const getInitMsg = (shopName) => [
  {
    id: 1,
    sender: "bot",
    text: `Chào bạn! Mình là AI chuyên gia Build PC của ${shopName || "cửa hàng"}.\n\nBạn muốn ráp bộ máy với ngân sách bao nhiêu và dùng để làm gì?\n\nVí dụ: "15 triệu, chơi game" hoặc "20 triệu, làm đồ họa"`,
  },
];

const formatPrice = (p) =>
  p
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(p)
    : "0đ";

export default function AiBuilder() {
  const navigate = useNavigate();
  const { storeConfig } = useContext(StoreContext);
  const shopName = storeConfig?.ten_cua_hang;
  const DEFAULT_MSG = getInitMsg(shopName);

  const [messages, setMessages] = useState(() => {
    try {
      const s = localStorage.getItem("ltl_ai_messages");
      return s ? JSON.parse(s) : DEFAULT_MSG;
    } catch {
      return DEFAULT_MSG;
    }
  });
  const [build, setBuild] = useState(() => {
    try {
      const s = localStorage.getItem("ltl_ai_build");
      return s ? JSON.parse(s) : EMPTY_BUILD;
    } catch {
      return EMPTY_BUILD;
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [openCat, setOpenCat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCat, setModalCat] = useState(null);
  const [modalSearch, setModalSearch] = useState("");
  const [modalProducts, setModalProducts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const limitedMessages = messages.slice(-50);
    localStorage.setItem("ltl_ai_messages", JSON.stringify(limitedMessages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem("ltl_ai_build", JSON.stringify(build));
  }, [build]);
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 1 && storeConfig?.ten_cua_hang) {
        return getInitMsg(storeConfig.ten_cua_hang);
      }
      return prev;
    });
  }, [storeConfig?.ten_cua_hang]);
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages]);

  const addMsg = (sender, text) =>
    setMessages((p) => [
      ...p,
      { id: Date.now() + Math.random(), sender, text },
    ]);

  const callAPI = async (msg) => {
    const res = await fetch(`${BASE_URL}/api/ai/build-pc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        currentBuild: build,
      }),
    });
    return await res.json();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    addMsg("user", text);
    setLoading(true);
    setOptions([]);
    setOpenCat(null);
    try {
      const data = await callAPI(text);
      addMsg("bot", data.text || "Để mình tìm kiếm linh kiện phù hợp...");
      if (data.options?.length > 0) {
        setOptions(data.options);
        setOpenCat(data.options[0].type?.toLowerCase() || "cpu");
      }
    } catch {
      toast.error("Lỗi kết nối AI, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (item) => {
    // Bug 1: Thông minh hóa việc map type từ AI
    let typeKey = (item.type || "cpu").toLowerCase();

    // Nếu AI trả về type chung chung, map vào slot tương ứng
    if (typeKey === "ssd") typeKey = build.ssd1 ? "ssd2" : "ssd1";
    if (typeKey === "monitor")
      typeKey = build.monitor1 ? "monitor2" : "monitor1";
    if (typeKey === "cooler") typeKey = "cooler_air";

    setBuild((p) => ({ ...p, [typeKey]: item }));
    setOpenCat(null);
    setOptions([]);
    addMsg("user", `Mình chọn ${item.name}`);
    toast.success(`Đã thêm ${item.name}`, { autoClose: 1500 });
    setLoading(true);
    setIsModalOpen(false);

    // Tìm linh kiện tiếp theo để gợi ý
    const order = CATEGORIES.map((c) => c.key);
    const labels = CATEGORIES.reduce(
      (acc, c) => ({ ...acc, [c.key]: c.label }),
      {},
    );
    const currentIndex = order.indexOf(typeKey);

    let nextCatKey = null;
    if (currentIndex !== -1 && currentIndex < order.length - 1) {
      // Tìm mục tiếp theo chưa được chọn
      for (let i = currentIndex + 1; i < order.length; i++) {
        if (!build[order[i]]) {
          nextCatKey = order[i];
          break;
        }
      }
    }

    let prompt;
    if (nextCatKey) {
      prompt = `Tôi đã chọn ${item.name}. Hãy tư vấn ít nhất 3 lựa chọn tương thích cho ${labels[nextCatKey]} tiếp theo. type phải là "${nextCatKey}".`;
    } else {
      prompt = `Tôi đã chọn xong ${item.name}. Cấu hình đã đầy đủ! Hãy đánh giá tổng quan và chúc mừng. Trả về options là [].`;
    }

    try {
      const data = await callAPI(prompt);
      addMsg("bot", data.text || "");
      if (data.options?.length > 0) {
        setOptions(data.options);
        setOpenCat(data.options[0].type?.toLowerCase());
      }
    } catch {
      toast.error("Không thể lấy đề xuất linh kiện!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Làm lại từ đầu?",
      text: "Xóa toàn bộ cấu hình và lịch sử chat hiện tại?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#374151",
      confirmButtonText: "Đồng ý, xóa hết!",
      cancelButtonText: "Hủy",
      background: "#ffffff",
      color: "#0f172a",
      customClass: {
        confirmButton: "text-white",
        cancelButton: "text-slate-600",
      },
    });

    if (result.isConfirmed) {
      localStorage.removeItem("ltl_ai_build");
      localStorage.removeItem("ltl_ai_messages");
      setBuild(EMPTY_BUILD);
      setMessages(DEFAULT_MSG);
      setOptions([]);
      setOpenCat(null);
      toast.success("Đã làm mới cấu hình!");
    }
  };

  const fetchModalProducts = async (cat, search = "") => {
    setModalLoading(true);
    try {
      // API search hỗ trợ danhMucId để lọc chính xác theo loại linh kiện
      const url = new URL(`${BASE_URL}/api/sanPham/search`);
      url.searchParams.append("q", search); // Tìm kiếm theo tên (nếu có)
      if (cat?.dbId) {
        url.searchParams.append("danhMucId", cat.dbId);
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.hits) {
        setModalProducts(data.hits.slice(0, 15));
      } else {
        setModalProducts([]);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      setModalProducts([]);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && modalCat) {
      const timer = setTimeout(() => {
        fetchModalProducts(modalCat, modalSearch);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [modalSearch, modalCat, isModalOpen]);

  const handleOpenModal = (cat) => {
    setModalCat(cat);
    setModalSearch("");
    setIsModalOpen(true);
  };

  const handleAddAllToCart = () => {
    const selectedItems = Object.values(build).filter(Boolean);
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một linh kiện!");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    selectedItems.forEach((item) => {
      // Bug 2: Phân biệt các linh kiện khác nhau kể cả khi cùng sản phẩm (Vd: 2 thanh RAM giống hệt nhau)
      // Dùng key là categoryKey để phân biệt trong giỏ hàng nếu cần,
      // hoặc đơn giản là cộng dồn số lượng nếu đã tồn tại cùng variantId.
      const variantId = item.variantId || item.id;
      const existingIdx = currentCart.findIndex(
        (c) => c.variantId === variantId,
      );

      if (existingIdx > -1) {
        currentCart[existingIdx].so_luong += 1;
      } else {
        currentCart.push({
          id: item.id,
          variantId: variantId,
          ten_san_pham: item.name,
          hinh_anh: item.image,
          gia_ban: item.price,
          so_luong: 1,
        });
      }
    });

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`Đã thêm ${selectedItems.length} linh kiện vào giỏ!`);
    navigate("/cart");
  };

  const selectedCount = useMemo(() => Object.values(build).filter(Boolean).length, [build]);
  const totalPrice = useMemo(() => Object.values(build).reduce(
    (s, i) => s + (i?.price || 0),
    0,
  ), [build]);

  return (
    <div
      style={{
        backgroundColor: THEME.bg,
        minHeight: "100vh",
      }}
      className="font-sans text-slate-800"
    >
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden py-6 px-4">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(124,58,237,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  }}
                >
                  <Icons.ChatAI className="w-6 h-6 brightness-0 invert" />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-purple-600"
                  style={{
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  AI Build PC
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
                Tư Vấn Build PC{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg,#4f46e5,#9333ea)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Cùng AI
                </span>
              </h1>
              <p className="text-slate-600 text-sm">
                AI phân tích kho hàng thực tế — đề xuất linh kiện tương thích,
                tối ưu ngân sách
              </p>
            </div>
            {/* Đã xóa box trùng lặp ở đây */}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* CHAT */}
          <div
            className="lg:col-span-3 rounded-2xl overflow-hidden flex flex-col bg-white shadow-xl border border-slate-200"
            style={{
              height: "calc(100vh - 220px)",
              minHeight: "500px",
            }}
          >
            {/* Header chat */}
            <div
              className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
              style={{
                background: "white",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                    <Icons.ChatAI className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none">
                    AI Chuyên Gia Build PC
                  </h3>
                  <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                    Trực tuyến — Sẵn sàng tư vấn
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(124,58,237,0.1) transparent",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.sender === "bot" && (
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
                      style={{
                        background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                      }}
                    >
                      <Icons.ChatAI className="w-4 h-4 brightness-0 invert" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.sender === "user"
                        ? {
                            background:
                              "linear-gradient(135deg,#7c3aed,#2563eb)",
                            color: "white",
                            borderBottomRightRadius: "4px",
                            boxShadow: "0 4px 12px rgba(124,58,237,0.2)",
                          }
                        : {
                            background: THEME.chatBg,
                            color: "#334155",
                            border: `1px solid ${THEME.border}`,
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                    }}
                  >
                    <Icons.ChatAI className="w-4 h-4 brightness-0 invert" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: "1px solid #f1f5f9" }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  disabled={loading}
                  placeholder="VD: 20 triệu, muốn ráp máy chơi game mạnh..."
                  className="flex-1 rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-50 transition-all focus:ring-2 focus:ring-purple-200"
                  style={{
                    background: THEME.bg,
                    border: `1px solid ${THEME.border}`,
                    color: THEME.textPrimary,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROFESSIONAL TABLE BUILDER */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h2 className="text-slate-800 font-bold text-sm flex items-center gap-2">
                  <Icons.Setting className="w-4 h-4 text-blue-600" />
                  DANH SÁCH LINH KIỆN
                </h2>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {selectedCount}/{CATEGORIES.length} ĐÃ CHỌN
                </span>
              </div>

              {/* Table Body */}
              <div
                className="divide-y divide-slate-100 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 350px)" }}
              >
                {CATEGORIES.map((cat, idx) => {
                  const selected = build[cat.key];
                  return (
                    <div
                      key={cat.key}
                      className="flex items-center p-3 hover:bg-slate-50/50 transition-colors group"
                    >
                      <div className="w-8 text-slate-300 font-bold text-xs">
                        {idx + 1}.
                      </div>
                      <div className="w-24 md:w-32 flex-shrink-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          {cat.label}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 px-2">
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={selected.image || PLACEHOLDER_IMG}
                              alt={selected.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = PLACEHOLDER_IMG;
                              }}
                              className="w-10 h-10 object-cover rounded border border-slate-100 bg-white"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {selected.name}
                              </p>
                              <p className="text-[10px] text-red-500 font-bold mt-0.5">
                                {formatPrice(selected.price)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-300 italic">
                            Chưa chọn linh kiện
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {selected ? (
                          <>
                            <button
                              onClick={() => handleOpenModal(cat)}
                              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold hover:bg-blue-100 transition-all"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() =>
                                setBuild((p) => ({ ...p, [cat.key]: null }))
                              }
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Icons.Close className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-1"
                          >
                            <Icons.Add className="w-3 h-3" />
                            Chọn
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Footer / Summary */}
              <div className="bg-slate-50/50 p-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tổng tiền tạm tính
                    </p>
                    <p className="text-xl font-black text-red-600">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Icons.Add className="w-4 h-4 rotate-45" />
                    Làm lại
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={handleAddAllToCart}
                    className="col-span-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Icons.ShoppingCart className="w-4 h-4 brightness-0 invert" />
                    THÊM VÀO GIỎ HÀNG
                  </button>
                  <button
                    onClick={() =>
                      toast.info(
                        "Tính năng Tải báo giá Excel đang được phát triển!",
                      )
                    }
                    className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 flex items-center justify-center gap-2 transition-all border border-slate-200"
                  >
                    <Icons.Inventory className="w-4 h-4" />
                    TẢI EXCEL
                  </button>
                  <button
                    onClick={() =>
                      toast.info(
                        "Tính năng Xem ảnh cấu hình đang được phát triển!",
                      )
                    }
                    className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 flex items-center justify-center gap-2 transition-all border border-slate-200"
                  >
                    <Icons.PC className="w-4 h-4" />
                    XEM ẢNH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer theme="light" position="bottom-right" />

      {/* MODAL CHỌN LINH KIỆN THỦ CÔNG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <CompIcon name={modalCat?.key} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Chọn {modalCat?.label}
                  </h3>
                  <p className="text-slate-500 text-sm">{modalCat?.sub}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
              >
                <Icons.Close className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-4 pb-1">
              <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder={`Tìm kiếm ${modalCat?.label}...`}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 outline-none focus:ring-1 focus:ring-purple-200 transition-all"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Product List */}
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-3">
              {modalLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">
                    Đang tìm sản phẩm phù hợp...
                  </p>
                </div>
              ) : modalProducts.length > 0 ? (
                modalProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group cursor-pointer"
                    onClick={() => {
                      // Bug 4: Xử lý format hình ảnh từ Backend (hinh_anh là array hoặc string)
                      let imgUrl = product.hinh_anh;
                      if (Array.isArray(product.hinh_anh)) {
                        imgUrl =
                          product.hinh_anh.find((a) => a.la_anh_chinh)
                            ?.url_anh || product.hinh_anh[0]?.url_anh;
                      } else if (
                        product.hinh_anh_list &&
                        product.hinh_anh_list.length > 0
                      ) {
                        imgUrl =
                          product.hinh_anh_list.find((a) => a.la_anh_chinh)
                            ?.url_anh || product.hinh_anh_list[0]?.url_anh;
                      }

                      handleSelect({
                        id: product.id,
                        variantId: product.bien_the?.[0]?.id || product.id,
                        name: product.ten_san_pham,
                        price:
                          product.gia_ban || product.bien_the?.[0]?.gia_ban,
                        image: imgUrl || PLACEHOLDER_IMG,
                        type: modalCat.key,
                        desc: product.mo_ta_ngan,
                      });
                    }}
                  >
                    <img
                      src={
                        (Array.isArray(product.hinh_anh)
                          ? product.hinh_anh.find((a) => a.la_anh_chinh)
                              ?.url_anh || product.hinh_anh[0]?.url_anh
                          : product.hinh_anh_list?.[0]?.url_anh ||
                            product.hinh_anh) || PLACEHOLDER_IMG
                      }
                      alt={product.ten_san_pham}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                      className="w-16 h-16 object-cover rounded-xl bg-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                        {product.ten_san_pham}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                        {product.mo_ta_ngan}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-red-500 font-bold">
                          {formatPrice(product.gia_ban)}
                        </span>
                        {product.ton_kho > 0 ? (
                          <span className="text-[10px] text-green-600 font-bold px-2 py-0.5 bg-green-50 rounded-full">
                            Còn hàng
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-400 font-bold px-2 py-0.5 bg-red-50 rounded-full">
                            Hết hàng
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-200 opacity-0 group-hover:opacity-100 transition-all">
                      Chọn
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icons.Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <button
                    onClick={() => setModalSearch("")}
                    className="text-purple-600 text-xs font-bold mt-2 hover:underline"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
