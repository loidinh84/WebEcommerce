import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Icons from "../assets/icons/index";
import BASE_URL from "../config/api";

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

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
    <div className="w-full h-full">
      {/* === SLIDESHOW BANNER FULL WIDTH === */}
      <div className="relative rounded-xl overflow-hidden shadow-md min-h-[200px] sm:min-h-[240px] lg:min-h-[340px] group bg-gray-100">
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
              className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-6 transition-all duration-300 ${
                animating
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {slide.tieu_de && (
                <h2 className="text-white text-base sm:text-xl font-bold leading-tight mb-3 drop-shadow-lg max-w-lg">
                  {slide.tieu_de}
                </h2>
              )}
              {slide.duong_dan && (
                <Link to={slide.duong_dan}>
                  <button className="text-sm font-bold px-5 py-2 rounded-full w-fit transition hover:scale-105 active:scale-95 shadow-lg bg-[#4A44F2] text-white cursor-pointer">
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
    </div>
  );
};

export default HeroBanner;
