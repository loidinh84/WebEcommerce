import React from "react";
import * as Icons from "../assets/icons/index";
import Logo from "../assets/images/logo.png";

const Header = () => {
  return (
    // Bao bọc toàn bộ bằng thẻ <header>
    <header className="bg-[#4A44F2] text-white font-sans shadow-md">
      {/* --- 1. THANH TOP BAR TRÊN CÙNG --- */}
      <div className="text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Cụm cam kết bên trái */}
          {/* Thêm gap để các icon không dính nhau, hidden lg:flex để Responsive */}
          <div className="flex items-center gap-6 hidden lg:flex">
            <span className="flex items-center gap-1.5 hover:text-gray-200">
              {/* Thêm brightness-0 invert để icon SVG đen biến thành trắng */}
              <img
                src={Icons.ChinhHang}
                alt="Chính hãng"
                className="brightness-0 invert"
              />
              Sản phẩm chính hãng - Xuất hóa đơn đầy đủ
            </span>

            <span className="flex items-center gap-1.5 hover:text-gray-200">
              <img
                src={Icons.Delivery}
                alt="Giao hàng"
                className="brightness-0 invert"
              />
              Giao nhanh - miễn phí cho hóa đơn 300k
            </span>

            <span className="flex items-center gap-1.5 hover:text-gray-200">
              <img
                src={Icons.Build}
                alt="Lắp đặt"
                className="brightness-0 invert"
              />
              Lắp đặt tại nhà - Giao hàng tận tay
            </span>
          </div>

          {/* Cụm thông tin bên phải */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="cursor-pointer hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <img
                src={Icons.Bill}
                alt="Bill"
                className="w-4 h-4 brightness-0 invert"
              />
              Tra cứu đơn hàng
            </span>

            <span className="text-white/40">|</span>

            <span className="font-semibold cursor-pointer hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <img
                src={Icons.Call}
                alt="Call"
                className="w-4 h-4 gap-2 brightness-0 invert"
              />
              055.956.9340
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. THANH HEADER CHÍNH --- */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-white/10 shadow cursor-pointer px-2 py-1.5 rounded-full shadow-lg">
          <img
            src={Logo}
            alt="LTL Shop Logo"
            className="h-15 w-auto object-contain"
          />{" "}
          <span className="text-red-500 font-extrabold text-2xl justify-center items-center flex">
            L
          </span>
          <span className="text-purple-700 font-extrabold text-2xl justify-center items-center flex">
            T
          </span>
          <span className="text-cyan-400  font-extrabold text-2xl justify-center items-center flex">
            L
          </span>
          <span className="text-red-300 font-extrabold text-2xl justify-center items-center flex">
            Shop
          </span>
        </div>

        {/* Hai nút Dropdown */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="flex cursor-pointer items-center gap-2 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition">
            <img
              src={Icons.DanhMuc}
              alt="Shop Info"
              className="w-7 h-7 brightness-0"
            />
            <span className="font-medium text-xl text-gray-900">
              Thông tin shop
            </span>
            <img
              src={Icons.ArrowDown}
              alt="Arrow Down"
              className="w-6 h-6 brightness-0"
            />
          </button>

          <button className="flex cursor-pointer items-center gap-2 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition ">
            <img
              src={Icons.DanhMuc}
              alt="Category"
              className="w-7 h-7 brightness-0"
            />
            <span className="font-medium text-xl text-gray-900">Danh mục</span>
            <img
              src={Icons.ArrowDown}
              alt="Arrow Down"
              className="w-6 h-6 brightness-0"
            />
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 relative mx-2">
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img
              src={Icons.Search}
              alt="Search"
              className="w-7 h-7 brightness-0 cursor-pointer"
            />
          </button>
          <input
            type="text"
            placeholder="Hôm nay bạn muốn mua gì?"
            className="w-full py-2.5 pl-11 pr-4 text-xl rounded-lg text-gray-800 bg-white outline-none shadow-inner text-sm"
          />
        </div>

        {/* Cụm nút bấm bên phải */}
        <div className="flex items-center space-x-4 text-sm flex-shrink-0 font-medium">
          <button className="flex cursor-pointer hover:bg-white/10 hover:border-white px-4 py-2 rounded-lg text-xl items-center gap-1 hover:text-gray-200 transition">
            <span>Giỏ hàng</span>
            <img
              src={Icons.ShoppingCart}
              alt="Cart"
              className="w-7 h-7 brightness-0 invert"
            />
          </button>

          {/* Nút Đăng Ký */}
          <button className="flex cursor-pointer items-center gap-1 text-xl  hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
            <img
              src={Icons.User}
              alt="User"
              className="w-7 h-7 brightness-0 invert"
            />
            <span>Đăng Ký</span>
          </button>

          {/* Nút Đăng Nhập */}
          <button className="flex cursor-pointer items-center gap-1 text-xl  hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
            <img
              src={Icons.User}
              alt="User"
              className="w-7 h-7 brightness-0 invert"
            />
            <span>Đăng nhập</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
