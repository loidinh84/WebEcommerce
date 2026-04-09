import React, { useState, useEffect, useContext } from "react";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as Icons from "../assets/icons/index";

const slides = [
  {
    image:
      "https://cdn.hstatic.net/files/200000722513/article/gearvn-pc-gvn-t9-slider_b3446f40a7e44494846d5b8cb88cbbe0_master.png",
    tag: "Flash Sale hôm nay",
    title: "PC Gaming GVN T9",
    desc: "Hiệu năng đỉnh cao — giá ưu đãi chỉ trong hôm nay",
    cta: "Xem ngay",
    ctaLink: "/products",
    accent: "#4A44F2",
  },
  {
    image:
      "https://tinhocpnn.com/wp-content/uploads/2022/11/banner-may-tinh-choi-game-gia-re-may-tinh-do-hoa-gia-re-tphcm-1.png",
    tag: "Mới về",
    title: "Máy tính Gaming giá rẻ",
    desc: "Cấu hình mạnh — chiến mọi tựa game AAA mượt mà",
    cta: "Khám phá",
    ctaLink: "/products?cat=pc",
    accent: "#E85D04",
  },
  {
    image: "https://hqcomputer.com/assets/uploads/banner-03.jpg",
    tag: "Ưu đãi sinh viên",
    title: "Laptop học tập & làm việc",
    desc: "Giảm thêm 5% cho sinh viên — xuất trình thẻ khi nhận hàng",
    cta: "Đăng ký ngay",
    ctaLink: "/student-deal",
    accent: "#0D9488",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(
      () => goTo((current + 1) % slides.length),
      4500,
    );
    return () => clearInterval(interval);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* === SLIDESHOW CHÍNH === */}
      <div className="flex-1 relative rounded-xl overflow-hidden shadow-md min-h-[300px] group">
        {/* Ảnh nền */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient tối ở góc trái để text dễ đọc */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
        </div>

        {/* Text overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300 ${
            animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <span
            className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-2 w-fit"
            style={{ background: slide.accent, color: "#fff" }}
          >
            {slide.tag}
          </span>
          <h2 className="text-white text-2xl font-bold leading-tight mb-1 drop-shadow">
            {slide.title}
          </h2>
          <p className="text-white/80 text-sm mb-4 max-w-xs">{slide.desc}</p>
          <Link to={slide.ctaLink}>
            <button
              className="text-sm font-bold px-5 py-2 rounded-full w-fit transition hover:scale-105 active:scale-95 shadow"
              style={{ background: slide.accent, color: "#fff" }}
            >
              {slide.cta}
            </button>
          </Link>
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
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
        >
          ‹
        </button>
        <button
          onClick={() => goTo((current + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
        >
          ›
        </button>
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
              { icon: "🔥", text: "Đăng ký nhận ưu đãi" },
              { icon: "🔥", text: "Deal hot học sinh sinh viên" },
              { icon: "💻", text: "Laptop ưu đãi khủng" },
              { icon: "🎁", text: "Quà tặng kèm hấp dẫn" },
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
