import React, { useState, useEffect, useContext } from "react";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as Icons from "../assets/icons/index";
import BASE_URL from "../config/api";

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        // Chỉ lấy những banner có vi_tri là main_slider và đang active
        const res = await fetch(`${BASE_URL}/api/banners?vi_tri=homepage`);
        if (res.ok) {
          const data = await res.json();
          setSlides(data);
        }
      } catch (error) {
        console.error("Lỗi tải banner trang chủ:", error);
      }
    };
    fetchActiveBanners();
  }, []);

  const goTo = (idx) => {
    if (animating || slides.length === "0") return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(
      () => goTo((current + 1) % slides.length),
      4500,
    );
    return () => clearInterval(interval);
  }, [current, slides.length]);

  const slide = slides[current];

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* === SLIDESHOW CHÍNH === */}
      <div className="flex-1 relative rounded-xl overflow-hidden shadow-md min-h-[300px] group bg-gray-100">
        {slides.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Đang tải Banner...
          </div>
        ) : (
          <>
            <div
              className={`absolute inset-0 transition-opacity loading="eager" duration-300 ${
                animating ? "opacity-0" : "opacity-100"
              }`}
            >
              <img
                src={`${BASE_URL}${slide.hinh_anh_url}`}
                alt={slide.tieu_de || "Banner"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
            </div>

            {/* Nội dung Overlay */}
            <div
              className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300 ${
                animating
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {/* Chỉ hiện tiêu đề nếu Admin có nhập */}
              {slide.tieu_de && (
                <h2 className="text-white text-xl font-bold leading-tight mb-4 drop-shadow-lg max-w-lg">
                  {slide.tieu_de}
                </h2>
              )}

              {/* Nút Xem ngay trỏ về đường dẫn Admin nhập */}
              {slide.duong_dan && (
                <Link to={slide.duong_dan}>
                  <button className="text-sm font-bold px-6 py-2.5 rounded-full w-fit transition hover:scale-105 active:scale-95 shadow-lg bg-[#4A44F2] text-white cursor-pointer">
                    Xem ngay
                  </button>
                </Link>
              )}
            </div>

            {/* Dots điều hướng */}
            <div className="absolute bottom-3 right-4 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            {/* Nút prev/next */}
            <button
              onClick={() =>
                goTo((current - 1 + slides.length) % slides.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
            >
              <Icons.ArrowLeftLong />
            </button>
            <button
              onClick={() => goTo((current + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
            >
              <Icons.ArrowRightLong />
            </button>
          </>
        )}
      </div>

      {/* === CỘT PHẢI: Đăng nhập + Deal sinh viên === */}
      <div className="w-full lg:w-[240px] flex flex-col gap-3 h-full">
        {/* Khối đăng nhập */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <img src={Logo} alt="Logo" className="h-8 w-8 rounded-full" />
            <h3 className="font-bold text-gray-800 text-base leading-tight">
              Chào mừng đến LTLShop
            </h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {isLoggedIn
              ? "Kiểm tra tiến độ giao hàng và nhận ưu đãi riêng cho bạn."
              : "Đăng nhập để xem giá thành viên & tích điểm mỗi đơn hàng!"}
          </p>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <>
                {/* Khi ĐÃ đăng nhập */}
                <Link to="/profile" className="flex-1">
                  <button className="w-full py-1.5 rounded-lg text-sm font-semibold bg-[#4A44F2] text-white hover:bg-[#3a34e0] transition cursor-pointer">
                    Hồ sơ
                  </button>
                </Link>
                <Link to="/orders" className="flex-1">
                  <button className="w-full py-1.5 rounded-lg text-sm font-semibold border border-[#4A44F2] text-[#4A44F2] hover:bg-[#4A44F2]/5 transition cursor-pointer">
                    Đơn hàng
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <button className="w-full py-1.5 rounded-lg text-sm font-semibold bg-[#4A44F2] text-white hover:bg-[#3a34e0] transition cursor-pointer">
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/register" className="flex-1">
                  <button className="w-full py-1.5 rounded-lg text-sm font-semibold border border-[#4A44F2] text-[#4A44F2] hover:bg-[#4A44F2]/5 transition cursor-pointer">
                    Đăng ký
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Khối deal sinh viên */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <div className="bg-[#4A44F2] py-2 px-4 text-white text-sm font-bold text-center">
            Ưu đãi sinh viên
          </div>
          <ul className="p-3 space-y-1">
            {[
              { icon: <Icons.School />, text: "Đăng ký nhận ưu đãi" },
              { icon: <Icons.School />, text: "Deal hot học sinh sinh viên" },
              { icon: <Icons.School />, text: "Laptop ưu đãi khủng" },
              { icon: <Icons.School />, text: "Quà tặng kèm hấp dẫn" },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#4A44F2]/5 hover:text-[#4A44F2] transition text-sm text-gray-700"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
