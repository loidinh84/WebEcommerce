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
import Logo from "../assets/images/logo.png";
import * as XLSX from "xlsx";
import * as htmlToImage from "html-to-image";

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
    dbId: "32",
    sub: "Vi xử lý",
    icon: <CompIcon name="cpu" />,
  },
  {
    key: "mainboard",
    label: "MAIN - BO MẠCH CHỦ",
    dbId: "33,56",
    sub: "Bo mạch chủ",
    icon: <CompIcon name="mainboard" />,
  },
  {
    key: "ram",
    label: "RAM - BỘ NHỚ TRONG",
    dbId: "34",
    sub: "Bộ nhớ trong",
    icon: <CompIcon name="ram" />,
  },
  {
    key: "ssd1",
    label: "Ổ CỨNG SSD 1",
    dbId: "35,57",
    sub: "Ổ cứng SSD",
    icon: <CompIcon name="ssd" />,
  },
  {
    key: "ssd2",
    label: "Ổ CỨNG SSD 2",
    dbId: "35,57",
    sub: "Ổ cứng SSD",
    icon: <CompIcon name="ssd" />,
  },
  {
    key: "hdd",
    label: "Ổ CỨNG HDD",
    dbId: "35",
    sub: "Ổ cứng HDD",
    icon: <CompIcon name="hdd" />,
  },
  {
    key: "vga",
    label: "VGA - CARD MÀN HÌNH",
    dbId: "37",
    sub: "Card đồ họa",
    icon: <CompIcon name="vga" />,
  },
  {
    key: "psu",
    label: "PSU - NGUỒN MÁY TÍNH",
    dbId: "36,58",
    sub: "Nguồn điện",
    icon: <CompIcon name="psu" />,
  },
  {
    key: "case",
    label: "CASE - VỎ MÁY TÍNH",
    dbId: "39",
    sub: "Vỏ máy tính",
    icon: <CompIcon name="case" />,
  },
  {
    key: "cooler_air",
    label: "TẢN NHIỆT KHÍ",
    dbId: "38,59",
    sub: "Tản nhiệt khí",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "cooler_aio",
    label: "TẢN NHIỆT NƯỚC AIO",
    dbId: "38,59",
    sub: "Tản nhiệt AIO",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "cooler_custom",
    label: "TẢN NHIỆT NƯỚC CUSTOM",
    dbId: "38,59",
    sub: "Tản nhiệt Custom",
    icon: <CompIcon name="cooler" />,
  },
  {
    key: "fan",
    label: "FAN TẢN NHIỆT",
    dbId: "38,59",
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
  const { user } = useContext(AuthContext);
  const shopName = storeConfig?.ten_cua_hang;
  const DEFAULT_MSG = getInitMsg(shopName);

  useEffect(() => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để sử dụng tính năng Build PC với AI!");
      navigate("/login");
    }
  }, [user, navigate]);

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
  const buildRef = useRef(null);

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
  const handleExportExcel = () => {
    // Chỉ lấy những linh kiện đã chọn
    const selectedItems = CATEGORIES.filter((cat) => build[cat.key]).map(
      (cat, index) => {
        const item = build[cat.key];
        return {
          STT: index + 1,
          "Loại linh kiện": cat.label,
          "Tên sản phẩm": item.name,
          "Đơn giá (VNĐ)": item.price,
        };
      },
    );

    if (selectedItems.length === 0) {
      toast.warning("Chưa có linh kiện nào được chọn!");
      return;
    }

    const totalPrice = Object.values(build).reduce(
      (acc, curr) => acc + (curr ? curr.price : 0),
      0,
    );

    selectedItems.push({
      STT: "",
      "Loại linh kiện": "TỔNG CỘNG",
      "Tên sản phẩm": "",
      "Đơn giá (VNĐ)": totalPrice,
    });

    const worksheet = XLSX.utils.json_to_sheet(selectedItems);

    // Căn chỉnh độ rộng cột
    worksheet["!cols"] = [
      { wch: 5 }, // STT
      { wch: 25 }, // Loại linh kiện
      { wch: 60 }, // Tên sản phẩm
      { wch: 15 }, // Đơn giá
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CauHinhPC");
    XLSX.writeFile(workbook, "CauHinhPC_BaoGia.xlsx");
    toast.success("Đã tải xuống báo giá Excel!");
  };

  const handleGenerateImage = async () => {
    if (!buildRef.current) return;

    try {
      toast.info("Đang tạo ảnh, vui lòng đợi...", { autoClose: 2000 });

      // Small delay to ensure the DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 300));

      const dataUrl = await htmlToImage.toPng(buildRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Tăng chất lượng ảnh tương đương scale: 2
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "CauHinhPC_BaoGia.png";
      link.click();
    } catch (error) {
      console.error("Lỗi tạo ảnh:", error);
      toast.error("Không thể tạo ảnh, vui lòng thử lại sau!");
    }
  };

  const fetchModalProducts = async (cat, search = "") => {
    setModalLoading(true);
    try {
      const url = new URL(`${BASE_URL}/api/sanPham/search`);
      url.searchParams.append("q", search);
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

  const selectedCount = useMemo(
    () => Object.values(build).filter(Boolean).length,
    [build],
  );
  const totalPrice = useMemo(
    () => Object.values(build).reduce((s, i) => s + (i?.price || 0), 0),
    [build],
  );

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
      <div className="relative overflow-hidden p-4">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(124,58,237,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-xl md:text-4xl font-bold text-slate-900 mb-1">
                Tư Vấn Build PC Với AI
              </h1>
              <p className="text-slate-600 text-sm">
                AI phân tích và đề xuất linh kiện tương thích, tối ưu ngân sách
                cho bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
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
              className="px-6 py-2 border-b border-slate-100 flex items-center justify-between"
              style={{
                background: "white",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                    <Icons.ChatAI className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none">
                    AI Tư vấn Build PC
                  </h3>
                  <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Luôn sẵn lòng phục vụ bạn!
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

            {/* Suggestions/Options Area */}
            {options.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Linh kiện gợi ý từ AI
                  </h4>
                  <button
                    onClick={() => setOptions([])}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Bỏ qua
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 p-3 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() =>
                        handleSelect({
                          id: Date.now() + idx,
                          type: opt.type,
                          name: opt.name,
                          price: opt.price,
                          image: opt.image,
                          desc: opt.desc,
                        })
                      }
                    >
                      <div className="flex gap-3">
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/150?text=No+Image")
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-purple-600">
                            {opt.name}
                          </h5>
                          <p className="text-[11px] font-bold text-red-500 mt-0.5">
                            {formatPrice(opt.price)}
                          </p>
                          <button className="mt-2 w-full py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            Chọn linh kiện này
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  className="flex-1 rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-50 transition-all focus:ring-1 focus:ring-purple-200"
                  style={{
                    background: THEME.bg,
                    border: `1px solid ${THEME.border}`,
                    color: THEME.textPrimary,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <h2 className="text-slate-800 font-bold text-sm flex items-center gap-2">
                  <Icons.Setting className="w-4 h-4 text-blue-600" />
                  Danh sách linh kiện
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {selectedCount}/{CATEGORIES.length} Đã chọn
                </span>
              </div>

              {/* Table Body */}
              <div
                className="divide-y divide-slate-100 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 350px)" }}
              >
                {CATEGORIES.map((cat, idx) => {
                  const selected = build[cat.key];
                  const isActive = openCat === cat.key;
                  return (
                    <div
                      key={cat.key}
                      className={`flex items-center p-3 hover:bg-slate-50/50 transition-all group ${
                        isActive ? "bg-purple-50 border-l-4 border-purple-500 shadow-sm" : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="w-8 text-slate-300 font-bold text-xs">
                        {idx + 1}.
                      </div>
                      <div className="w-24 md:w-32 flex-shrink-0">
                        <div className="text-xs font-bold text-slate-700">
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
                              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
                            >
                              Đổi
                            </button>
                            <button
                              onClick={() =>
                                setBuild((p) => ({ ...p, [cat.key]: null }))
                              }
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                            >
                              <Icons.Close className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
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
                    <p className="text-sm font-bold text-slate-600  ">
                      Tổng tiền tạm tính
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors group cursor-pointer"
                  >
                    <Icons.Close className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    Làm lại
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={handleAddAllToCart}
                    className="col-span-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Icons.ShoppingCart className="w-4 h-4 brightness-0 invert" />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 flex items-center justify-center gap-1 transition-all border border-slate-200 cursor-pointer"
                  >
                    <Icons.Transaction className="w-4 h-4" />
                    Tải excel
                  </button>
                  <button
                    onClick={handleGenerateImage}
                    className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 flex items-center justify-center gap-1 transition-all border border-slate-200 cursor-pointer"
                  >
                    <Icons.Picture className="w-4 h-4" />
                    Xem ảnh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TEMPLATE IN ẢNH ẨN */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div
          ref={buildRef}
          className="bg-white"
          style={{ width: "1200px", padding: "0" }}
        >
          {/* Header Banner */}
          <div
            className="flex"
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
              color: "white",
            }}
          >
            <div className="p-10 flex-1 border-r border-blue-400/30 flex items-center gap-6">
              <img
                src={
                  storeConfig?.logo_url
                    ? `${BASE_URL}${storeConfig.logo_url}`
                    : Logo
                }
                alt="Logo"
                className="w-32 h-32 object-contain"
                crossOrigin="anonymous"
              />
              <div>
                <h1 className="text-4xl font-black tracking-wider uppercase mb-3">
                  {storeConfig?.ten_cua_hang || "CỬA HÀNG MÁY TÍNH"}
                </h1>
                <p className="text-base text-blue-100 flex items-center gap-2 mb-2">
                  <Icons.Location className="w-5 h-5 brightness-0 invert" />
                  <span className="font-bold uppercase whitespace-nowrap">
                    Địa chỉ:
                  </span>{" "}
                  {storeConfig?.dia_chi || "Đang cập nhật"}
                </p>
                <p className="text-base text-blue-100 flex items-center gap-2 mb-2">
                  <Icons.Call className="w-5 h-5 brightness-0 invert" />
                  <span className="font-bold uppercase whitespace-nowrap">
                    Hotline:
                  </span>{" "}
                  {storeConfig?.so_dien_thoai || "Đang cập nhật"}
                </p>
                <p className="text-base text-blue-100 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 brightness-0 invert"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-bold uppercase">Email:</span>{" "}
                  {storeConfig?.email || "Đang cập nhật"}
                </p>
              </div>
            </div>
            <div className="p-10 flex-[0.8] flex flex-col justify-center items-end text-right">
              <h2 className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-4 drop-shadow-sm leading-[1.3]">
                XÂY DỰNG
                <br />
                CẤU HÌNH PC
              </h2>
              <p className="text-xl text-blue-100 font-medium">
                Ngày báo giá: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Body Table */}
          <div className="p-10 min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 px-4 font-bold text-slate-500 w-16 text-center">
                    STT
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-500 w-32">
                    Hình ảnh
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-500">
                    Thông tin linh kiện
                  </th>
                  <th className="py-4 px-4 font-bold text-slate-500 text-right w-48">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.filter((cat) => build[cat.key]).map((cat, idx) => {
                  const item = build[cat.key];
                  return (
                    <tr key={cat.key} className="border-b border-slate-100">
                      <td className="py-6 px-4 font-bold text-slate-400 text-center text-xl">
                        {idx + 1}
                      </td>
                      <td className="py-6 px-4">
                        <img
                          src={item.image || PLACEHOLDER_IMG}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                          crossOrigin="anonymous"
                        />
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">
                          {cat.label}
                        </div>
                        <div className="text-xl font-bold text-slate-800 leading-snug">
                          {item.name}
                        </div>
                        <div className="text-sm text-slate-500 mt-2">
                          Đơn giá: {formatPrice(item.price)} x 1
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right align-middle">
                        <div className="text-xl font-bold text-red-600">
                          {formatPrice(item.price)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Total */}
          <div className="px-10 pb-10">
            <div className="flex flex-col items-end border-t-2 border-slate-800 pt-8">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-2xl font-bold text-slate-600">
                  TỔNG CHI PHÍ:
                </span>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-center text-base text-slate-500 w-full italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700">
                  Quý khách lưu ý:
                </span>{" "}
                Giá bán, khuyến mại của sản phẩm và tình trạng còn hàng có thể
                thay đổi bất cứ lúc nào mà không kịp báo trước.
                <br />
                Mọi thông tin chi tiết xin vui lòng liên hệ Hotline:{" "}
                <span className="font-bold text-blue-600">
                  {storeConfig?.so_dien_thoai}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer theme="light" position="top-center" />

      {/* MODAL CHỌN LINH KIỆN THỦ CÔNG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
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
                className="rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer hover:text-red-500"
              >
                <Icons.Close className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="px-2 pb-1">
              <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder={`Tìm kiếm ${modalCat?.label}...`}
                  className="w-full pl-12 pr-4 py-2 bg-slate-100 border border-gray-200 rounded-xl text-slate-900 outline-none focus:ring-1 focus:ring-purple-200 transition-all"
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
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
                          type: modalCat?.key,
                          desc: product.mo_ta_ngan,
                        });
                      } catch (error) {
                        console.error("Lỗi khi chọn sản phẩm:", error);
                      } finally {
                        setIsModalOpen(false);
                      }
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
                    className="text-purple-600 text-xs font-bold mt-2 hover:underline cursor-pointer"
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
