import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "PC TTG GAMING i5 12400F - 16GB DDR4- RTX 3060 8GB OC WHITE",
      specs: "CPU: i5 12400F | RAM: 16GB DDR4 | SSD: 500GB",
      price: 23680000,
      quantity: 1,
      image: Images.Logo,
      selected: true,
    },
    {
      id: 2,
      name: "PC TTG GAMING PRO i5 12600KF - 16GB DDR4 - RX 6600 XT 8GB OC",
      specs: "CPU: i5 12600KF | RAM: 16GB DDR4 | SSD: 500GB",
      price: 23180000,
      quantity: 1,
      image: Images.Logo,
      selected: false,
    },
  ]);

  // --- LOGIC XỬ LÝ GIỎ HÀNG ---
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const selectedCount = selectedItems.length;
  const isAllSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    setCartItems(
      cartItems.map((item) => ({ ...item, selected: newSelectedState })),
    );
  };

  const handleSelectItem = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc muốn bỏ sản phẩm này khỏi giỏ hàng?")) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedCount === 0) return;
    if (
      window.confirm(`Bạn có chắc muốn xóa ${selectedCount} sản phẩm đã chọn?`)
    ) {
      setCartItems(cartItems.filter((item) => !item.selected));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 pb-12">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-[#e30019] mb-6">Giỏ hàng</h1>

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
                className="w-32 h-32 mb-4 opacity-50"
              />
              <p>Giỏ hàng của bạn còn trống</p>
              <Link to="/">
                <button className="mt-4 bg-[#e30019] hover:bg-red-700 text-white px-8 py-2 rounded uppercase font-medium transition cursor-pointer">
                  MUA NGAY
                </button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox & Thông tin SP */}
                <div className="w-[45%] flex items-start gap-4">
                  <div className="pt-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-[#e30019]"
                      checked={item.selected}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain border rounded p-1 bg-white"
                  />
                  <div className="flex flex-col pr-4">
                    <h3 className="font-medium text-sm text-gray-800 hover:text-[#e30019] cursor-pointer line-clamp-2 leading-snug mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[12px] text-gray-500 line-clamp-2">
                      Phân loại: {item.specs}
                    </p>
                  </div>
                </div>

                {/* Đơn Giá */}
                <div className="w-[15%] text-center text-sm font-medium text-gray-600">
                  {formatPrice(item.price)}
                </div>

                {/* Số Lượng */}
                <div className="w-[15%] flex justify-center">
                  <div className="flex border border-gray-300 rounded text-gray-600 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-7 flex items-center justify-center bg-white hover:bg-gray-100 border-r border-gray-300 cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="w-10 h-7 text-center text-sm outline-none bg-white font-medium"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-7 flex items-center justify-center bg-white hover:bg-gray-100 border-l border-gray-300 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Số Tiền */}
                <div className="w-[15%] text-center text-sm font-bold text-[#e30019]">
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* Thao Tác Xóa */}
                <div className="w-[10%] text-center">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
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
                className={`px-10 py-3 rounded text-white font-medium text-lg transition-colors cursor-pointer ${selectedCount > 0 ? "bg-[#e30019] hover:bg-red-700 shadow-md" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={selectedCount === 0}
              >
                Mua Hàng
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
