import React, { useState, useEffect, useRef } from "react";
import * as Icons from "../assets/icons/index";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Load trang và kiểm tra có user trong kho lưu trữ không
  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (loggedInUser && loggedInUser !== "undefined") {
      try {
        // Cố gắng dịch dữ liệu
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user từ bộ nhớ:", error);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Nếu đang ở sát trên cùng -> Luôn luôn hiện
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
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
            <span className="flex items-center gap-1.5 hover:text-gray-200">
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
      <div className="container mx-auto flex items-center px-4 py-4 justify-start gap-4">
        <Link to="/">
          <div
            className="flex gap-1 bg-white/10 shadow cursor-pointer px-4 py-1.5 rounded-full shadow-lg "
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
              className="h-12 w-auto object-contain"
            />{" "}
            <span className="brightness font-extrabold pl-1.5  text-2xl justify-center items-center flex">
              LTLShop
            </span>
          </div>
        </Link>

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

        {/* --- CỤM NÚT BẤM BÊN PHẢI ĐÃ ĐƯỢC GẮN LOGIC --- */}
        <div className="flex items-center space-x-4 text-sm flex-shrink-0 font-medium">
          <button className="flex cursor-pointer hover:bg-white/10 hover:border-white px-4 py-2 rounded-lg text-xl items-center gap-1 hover:text-gray-200 transition">
            <span>Giỏ hàng</span>
            <img
              src={Icons.ShoppingCart}
              alt="Cart"
              className="w-7 h-7 brightness-0 invert"
            />
          </button>

          {/* KIỂM TRA ĐIỀU KIỆN TẠI ĐÂY */}
          {user ? (
            /* 1. NẾU ĐÃ ĐĂNG NHẬP: HIỆN AVATAR VÀ TÊN */
            <div className="flex items-center gap-3 hover:bg-white/10 transition border border-white/40 px-3 py-1.5 rounded-lg cursor-pointer">
              {/* Tên hiển thị bên trái */}
              <span className="text-white text-base font-bold truncate max-w-[150px] text-right">
                {user.ho_ten || user.so_dien_thoai}
              </span>

              {/* Avatar hiển thị bên phải */}
              <img
                src={
                  user.anh_dai_dien ||
                  https://ui-avatars.com/api/?name=${user.ho_ten || user.so_dien_thoai || "User"}&background=random
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full border border-white object-cover"
              />
            </div>
          ) : (
            /* 2. NẾU CHƯA ĐĂNG NHẬP: HIỆN 2 NÚT */
            <>
              {/* Nút Đăng Ký */}
              <Link to="/register">
                <button className="flex cursor-pointer items-center gap-1 text-xl hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <img
                    src={Icons.User}
                    alt="User"
                    className="w-7 h-7 brightness-0 invert"
                  />
                  <span>Đăng Ký</span>
                </button>
              </Link>

              {/* Nút Đăng Nhập */}
              <Link to="/login">
                <button className="flex cursor-pointer items-center gap-1 text-xl hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <img
                    src={Icons.User}
                    alt="User"
                    className="w-7 h-7 brightness-0 invert"
                  />
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