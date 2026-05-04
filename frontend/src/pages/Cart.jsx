import React, { useState, useContext, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../config/api";
import { StoreContext } from "../context/StoreContext";

const Cart = () => {
  const navigate = useNavigate();
  const { storeConfig } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart.map((item) => ({
      ...item,
      selected: true,
    }));
  });

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, []);

  const saveCartToLocal = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartItems(newCart);
  };

  // --- LOGIC XỬ LÝ GIỎ HÀNG ---
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.gia_ban * item.so_luong,
    0,
  );

  const selectedCount = selectedItems.length;
  const isAllSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newCart = cartItems.map((item) => ({
      ...item,
      selected: newSelectedState,
    }));
    saveCartToLocal(newCart);
  };

  const handleSelectItem = (variantId) => {
    const newCart = cartItems.map((item) =>
      item.variantId === variantId
        ? { ...item, selected: !item.selected }
        : item,
    );
    saveCartToLocal(newCart);
  };

  const updateQuantity = (variantId, delta) => {
    const newCart = cartItems.map((item) => {
      if (item.variantId === variantId) {
        const newQuantity = item.so_luong + delta;
        return { ...item, so_luong: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    saveCartToLocal(newCart);
  };

  const handleRemoveItem = (variantId) => {
    const newCart = cartItems.filter((item) => item.variantId !== variantId);
    saveCartToLocal(newCart);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleRemoveSelected = () => {
    if (selectedCount === 0)
      return toast.error("Vui lòng chọn sản phẩm cần xóa!");
    const newCart = cartItems.filter((item) => !item.selected);
    saveCartToLocal(newCart);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getImageUrl = (url) => {
    if (!url) return "../assets/images/NoImage.webp";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 pb-32 md:pb-12">
      <Header />
      <Toaster position="bottom-right" />

      <main className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden text-gray-600 hover:text-black transition-colors"
            title="Quay lại"
          >
            <Icons.ArrowLeftLong className="w-7 h-7" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-700">
            Giỏ hàng của bạn
          </h1>
        </div>

        {/* THANH TIÊU ĐỀ CỘT */}
        <div className="hidden md:flex bg-white rounded shadow-sm items-center p-4 mb-4 text-sm text-gray-500 font-medium">
          <div className="w-[45%] flex items-center gap-4">
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer accent-[#e30019]"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <span>Sản Phẩm</span>
          </div>
          <div className="w-[15%] text-center">Đơn Giá</div>
          <div className="w-[15%] text-center">Số Lượng</div>
          <div className="w-[15%] text-center">Số Tiền</div>
          <div className="w-[10%] text-center">Thao Tác</div>
        </div>

        {/* DANH SÁCH ITEM */}
        <div className="bg-white rounded shadow-sm mb-4 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <img
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/9bdd8040b334d31946f49e36beaf32db.png"
                alt="Giỏ hàng trống"
                className="w-30 h-30 mb-4 opacity-40"
              />
              <p>Giỏ hàng của bạn còn trống</p>
              <Link to="/">
                <button className="mt-4 bg-[#e30019] hover:bg-red-700 text-white px-8 py-2 rounded font-medium transition cursor-pointer">
                  Mua sắm ngay
                </button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-col md:flex-row md:items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors gap-4"
              >
                {/* Checkbox & Thông tin SP */}
                <div className="w-full md:w-[45%] flex items-start gap-3 md:gap-4">
                  <div className="pt-1 md:pt-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-[#e30019]"
                      checked={item.selected}
                      onChange={() => handleSelectItem(item.variantId)}
                    />
                  </div>
                  <img
                    src={getImageUrl(item.hinh_anh)}
                    alt={item.ten_san_pham}
                    className="w-20 h-20 md:w-20 md:h-20 object-contain rounded p-1 bg-white border border-gray-50"
                  />
                  <div className="flex-1 flex flex-col pr-0 md:pr-4">
                    <h3 className="font-medium text-[13px] md:text-sm text-gray-800 hover:text-[#e30019] cursor-pointer line-clamp-2 leading-snug mb-1">
                      {item.ten_san_pham}
                    </h3>
                    <p className="text-[11px] md:text-[12px] text-gray-500 line-clamp-2">
                      Phân loại:{" "}
                      <span className="font-medium text-gray-700">
                        {item.dung_luong || ""}{" "}
                        {item.mau_sac ? `- ${item.mau_sac}` : ""}
                      </span>
                    </p>
                    {/* Giá hiển thị trên mobile */}
                    <div className="md:hidden mt-1 flex items-center justify-between">
                      <span className="text-[#e30019] font-bold text-sm">
                        {formatPrice(item.gia_ban)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-between md:contents">
                  {/* Đơn Giá (Desktop) */}
                  <div className="hidden md:block w-[15%] text-center text-sm font-medium text-gray-600">
                    {formatPrice(item.gia_ban)}
                  </div>

                  {/* Số Lượng */}
                  <div className="w-auto md:w-[15%] flex justify-center">
                    <div className="flex border border-gray-300 rounded text-gray-600 overflow-hidden h-7 md:h-8">
                      <button
                        onClick={() => updateQuantity(item.variantId, -1)}
                        className="w-7 md:w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 border-r border-gray-300 cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.so_luong}
                        readOnly
                        className="w-8 md:w-10 text-center text-[12px] md:text-sm outline-none bg-white font-semibold text-gray-800"
                      />
                      <button
                        onClick={() => updateQuantity(item.variantId, 1)}
                        className="w-7 md:w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 border-l border-gray-300 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Số Tiền (Thành tiền) */}
                  <div className="w-auto md:w-[15%] text-center text-sm font-bold text-[#e30019]">
                    <span className="md:hidden text-[11px] text-gray-400 font-normal mr-1">
                      Thành tiền:
                    </span>
                    {formatPrice(item.gia_ban * item.so_luong)}
                  </div>

                  {/* Thao Tác Xóa */}
                  <div className="w-auto md:w-[10%] text-right md:text-center">
                    <button
                      onClick={() => handleRemoveItem(item.variantId)}
                      className="text-[13px] md:text-sm font-medium text-gray-500 hover:text-[#e30019] cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Icons.Delete className="w-4 h-4 md:hidden" />
                      <span className="hidden md:inline">Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white fixed md:sticky bottom-[66px] md:bottom-0 left-0 right-0 md:left-auto md:right-auto z-[100] border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-2 md:p-4 gap-2">
              <div className="flex items-center gap-2 md:gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-[12px] md:text-sm text-gray-600 hover:text-black font-medium shrink-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer accent-[#e30019]"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                  <span className="md:hidden">Tất cả</span>
                  <span className="hidden md:inline">
                    Chọn Tất Cả ({cartItems.length})
                  </span>
                </label>
                <button
                  onClick={handleRemoveSelected}
                  className="hidden md:flex text-sm font-medium text-gray-500 hover:text-[#e30019] cursor-pointer items-center gap-1"
                >
                  <Icons.Delete className="w-4 h-4" />
                  Xóa
                </button>
              </div>

              <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <div className="text-right">
                  <div className="text-[12px] md:text-sm text-gray-500 leading-tight">
                    Tạm tính:
                  </div>
                  <div className="text-base md:text-2xl font-bold text-[#e30019] leading-tight">
                    {formatPrice(
                      storeConfig?.lam_tron_tien
                        ? Math.round(totalAmount / 1000) * 1000
                        : totalAmount,
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className={`px-5 md:px-10 py-2 md:py-3 rounded-full md:rounded-lg text-white font-bold text-sm md:text-xl transition-all cursor-pointer shadow-md ${
                    selectedCount > 0
                      ? "bg-[#e30019] hover:bg-red-700 active:scale-95"
                      : "bg-gray-300 cursor-not-allowed shadow-none"
                  }`}
                  disabled={selectedCount === 0}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
