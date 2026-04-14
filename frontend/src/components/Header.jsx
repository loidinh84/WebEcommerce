import React, { useState, useEffect, useRef, useContext } from "react";
import * as Icons from "../assets/icons/index";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsScrolled(false);
      }
      // Nếu lăn chuột xuống -> Ẩn thanh
      else if (currentScrollY > lastScrollY.current + 5) {
        setIsScrolled(true);
      }
      // Nếu lăn chuột lên -> Hiện thanh ngay lập tức
      else if (currentScrollY < lastScrollY.current - 5) {
        setIsScrolled(false);
      }

      // Lưu lại tọa độ hiện tại cho lần lăn chuột tiếp theo
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="bg-[#4A44F2] text-white font-sans shadow-md sticky top-0 z-50">
      {/* --- 1. THANH TOP BAR TRÊN CÙNG --- */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? "max-h-0 py-0 opacity-0" : "max-h-[50px] opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6 hidden lg:flex">
            <span className="flex items-center text-sm gap-1.5 hover:text-gray-200">
              <Icons.ChinhHang className=" w-4 h-4 brightness-0 invert" />
              Sản phẩm chính hãng - Xuất hóa đơn đầy đủ
            </span>

            <span className="flex items-center text-sm  gap-1.5 hover:text-gray-200">
              <Icons.Delivery className="w-4 h-4 brightness-0 invert" />
              Giao nhanh - miễn phí cho hóa đơn 300k
            </span>

            <span className="flex items-center text-sm gap-1.5 hover:text-gray-200">
              <Icons.Build className=" w-4 h-4 brightness-0 invert" />
              Lắp đặt tại nhà - Giao hàng tận tay
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="cursor-pointer text-sm hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <Icons.Bill className="w-4 h-4 brightness-0 invert" />
              Tra cứu đơn hàng
            </span>

            <span className="text-white/40">|</span>

            <span className="font-semibold cursor-pointer text-sm hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <Icons.Call className="w-4 h-4 gap-2 brightness-0 invert" />
              055.956.9340
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. THANH HEADER CHÍNH --- */}
      <div className="container mx-auto flex items-center px-4 justify-start gap-4">
        <Link to="/">
          <div
            className="flex gap-1 bg-white/10 shadow cursor-pointer px-3 py-1.5 rounded-full shadow-lg my-3"
            onClick={() => {
              if (window.location.pathname === "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
          >
            <img
              src={Logo}
              alt="LTL Shop Logo"
              className="h-10 w-auto object-contain"
            />{" "}
            <span className="brightness font-bold pl-1.5  text-xl justify-center items-center flex">
              LTLShop
            </span>
          </div>
        </Link>

        {/* Hai nút Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex cursor-pointer items-center gap-2 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition">
            <Icons.DanhMuc className="w-5 h-5 brightness-0" />
            <span className="font-medium text-[15px] text-gray-900">
              Thông tin shop
            </span>
            <Icons.ArrowDown className="w-5 h-5 text-gray-600" />
          </button>

          <button className="flex cursor-pointer items-center gap-1 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition ">
            <Icons.DanhMuc className="w-5 h-5 brightness-0" />
            <span className="font-medium text-[15px] text-gray-900">
              Danh mục
            </span>
            <Icons.ArrowDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 relative">
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icons.Search className="w-6 h-6 brightness-0 cursor-pointer" />
          </button>
          <input
            type="text"
            placeholder="Hôm nay bạn muốn mua gì?"
            className="w-full py-2.5 pl-10 pr-4 rounded-lg text-gray-800 bg-white outline-none shadow-inner text-[14px]"
          />
        </div>

        {/* --- CỤM NÚT BẤM BÊN PHẢI ĐÃ ĐƯỢC GẮN LOGIC --- */}
        <div className="flex items-center gap-1 text-sm flex-shrink-0 font-medium">
          <button
            onClick={() => navigate("/cart")}
            className="flex cursor-pointer hover:bg-white/10 hover:border-white px-4 py-2 rounded-lg text-sm items-center gap-1 hover:text-gray-200 transition"
          >
            <span>Giỏ hàng</span>
            <Icons.ShoppingCart className="w-5 h-5 brightness-0 invert" />
          </button>

          {user ? (
            <div
              className="relative group py-2"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="flex items-center gap-3 hover:bg-white/10 transition bg-black/10 px-4 py-1.5 rounded-lg cursor-pointer">
                <span className="text-white text-base font-bold truncate max-w-[150px] text-right">
                  {user.ho_ten || user.so_dien_thoai}
                </span>
                <img
                  src={
                    user.anh_dai_dien ||
                    `https://ui-avatars.com/api/?name=${user.ho_ten || user.so_dien_thoai || "User"}&background=random`
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white object-cover"
                />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 text-gray-800 z-50 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#4A44F2] transition flex items-center gap-3 cursor-pointer"
                  >
                    Hồ sơ tài khoản
                  </button>

                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#4A44F2] transition flex items-center gap-3 cursor-pointer"
                  >
                    Đơn hàng của tôi
                  </button>

                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-3 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Nút Đăng Ký */}
              <Link to="/register">
                <button className="flex text-[16px] cursor-pointer items-center gap-1 text-xl hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <Icons.User className="w-7 h-7 brightness-0 invert" />
                  <span>Đăng Ký</span>
                </button>
              </Link>

              {/* Nút Đăng Nhập */}
              <Link to="/login">
                <button className="flex cursor-pointer items-center gap-1 text-[16px] hover:bg-[#4A44F2] transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <Icons.User className="w-7 h-7 brightness-0 invert" />
                  <span>Đăng nhập</span>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
