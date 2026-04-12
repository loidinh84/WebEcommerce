import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../config/api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart.map((item) => ({
      ...item,
      selected: true,
    }));
  });

  const saveCartToLocal = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
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
    if (!url) return "https://via.placeholder.com/150";
    return url.startsWith("http") ? url : `${BASE_URL}/uploads/${url}`;
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 pb-12">
      <Header />
      <Toaster position="bottom-right" />

      <main className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Giỏ hàng của bạn
        </h1>

        {/* THANH TIÊU ĐỀ CỘT */}
        <div className="bg-white rounded shadow-sm flex items-center p-4 mb-4 text-sm text-gray-500 font-medium">
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
        <div className="bg-white rounded shadow-sm mb-4">
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
                className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox & Thông tin SP */}
                <div className="w-[45%] flex items-start gap-4">
                  <div className="pt-2">
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
                    className="w-20 h-20 object-contain rounded p-1 bg-white"
                  />
                  <div className="flex flex-col pr-4">
                    <h3 className="font-medium text-sm text-gray-800 hover:text-[#e30019] cursor-pointer line-clamp-2 leading-snug mb-1">
                      {item.ten_san_pham}
                    </h3>
                    <p className="text-[12px] text-gray-500 line-clamp-2">
                      Phân loại:{" "}
                      <span className="font-medium text-gray-700">
                        {item.dung_luong || ""}{" "}
                        {item.mau_sac ? `- ${item.mau_sac}` : ""}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Đơn Giá */}
                <div className="w-[15%] text-center text-sm font-medium text-gray-600">
                  {formatPrice(item.gia_ban)}
                </div>

                {/* Số Lượng */}
                <div className="w-[15%] flex justify-center">
                  <div className="flex border border-gray-300 rounded text-gray-600 overflow-hidden h-8">
                    <button
                      onClick={() => updateQuantity(item.variantId, -1)}
                      className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 border-r border-gray-300 cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.so_luong}
                      readOnly
                      className="w-10 text-center text-sm outline-none bg-white font-semibold text-gray-800"
                    />
                    <button
                      onClick={() => updateQuantity(item.variantId, 1)}
                      className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 border-l border-gray-300 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Số Tiền */}
                <div className="w-[15%] text-center text-sm font-bold text-[#e30019]">
                  {formatPrice(item.gia_ban * item.so_luong)}
                </div>

                {/* Thao Tác Xóa */}
                <div className="w-[10%] text-center">
                  <button
                    onClick={() => handleRemoveItem(item.variantId)}
                    className="text-sm font-medium text-gray-600 hover:text-[#e30019] cursor-pointer transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white rounded shadow-sm p-4 flex justify-between items-center sticky bottom-0 z-10 border-t-2 border-gray-100">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-black">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-[#e30019]"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                Chọn Tất Cả ({cartItems.length})
              </label>
              <button
                onClick={handleRemoveSelected}
                className="text-sm font-medium text-gray-600 hover:text-[#e30019] cursor-pointer"
              >
                Xóa
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-800">
                Tổng thanh toán (
                <span className="text-[#e30019] font-bold">
                  {selectedCount}
                </span>{" "}
                Sản phẩm):
                <span className="text-2xl font-bold text-[#e30019] ml-2">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className={`px-7 py-2 rounded text-white font-medium text-xl transition-colors cursor-pointer ${selectedCount > 0 ? "bg-[#e30019] hover:bg-red-700 shadow-md" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={selectedCount === 0}
              >
                Mua ngay
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
