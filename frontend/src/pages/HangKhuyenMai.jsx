import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Images from "../assets/images/index";
import { Link } from "react-router-dom";

// --- MOCK DATA DÀNH CHO TRANG KHUYẾN MÃI ---
const categories = [
  { id: "all", name: "Trang chủ Sale" },
  { id: "phone", name: "Điện Thoại" },
  { id: "laptop", name: "Laptop" },
  { id: "accessory", name: "Phụ Kiện" },
  { id: "screen", name: "Màn Hình" },
];

const flashSaleProducts = Array(10).fill({
  id: 1,
  name: "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
  oldPrice: 34990000,
  newPrice: 29490000,
  discount: "15%",
  sold: 85,
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s", // Ảnh lấy từ Home của ông chủ
});

const hotTrendProducts = Array(10).fill({
  id: 2,
  name: "Laptop Gaming Acer Nitro 5 Eagle",
  oldPrice: 24990000,
  newPrice: 19990000,
  discount: "20%",
  sold: 42,
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
});

// --- COMPONENT THẺ SẢN PHẨM FLASH SALE ---
const SaleProductCard = ({ product }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="bg-white rounded-xl p-3 border-2 border-transparent hover:border-[#e30019] transition-all relative flex flex-col h-full group overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(227,0,25,0.2)] cursor-pointer">
      {/* Badge Flash Sale */}
      <div className="absolute top-0 left-0 bg-gradient-to-r from-[#e30019] to-[#ff6b00] text-white text-[11px] font-bold px-3 py-1 rounded-br-lg z-10">
        FLASH SALE
      </div>

      {/* Badge Giảm Phần Trăm (Góc phải) */}
      <div className="absolute top-0 right-0 bg-[#ffd124] text-[#e30019] text-[12px] font-black px-2 py-1 rounded-bl-lg z-10">
        -{product.discount}
      </div>

      {/* Hình ảnh */}
      <div className="relative pt-6 flex justify-center items-center overflow-hidden mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-36 h-36 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Tên sản phẩm */}
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#e30019] transition-colors">
        {product.name}
      </h3>

      {/* Giá */}
      <div className="mt-auto mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-400 line-through text-xs">
            {formatPrice(product.oldPrice)}
          </span>
        </div>
        <span className="text-[#e30019] font-bold text-lg leading-none block">
          {formatPrice(product.newPrice)}
        </span>
      </div>

      {/* Tiến độ bán (Thanh hỏa tốc) */}
      <div className="w-full bg-[#ffcaca] h-4 rounded-full relative overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff6b00] to-[#e30019]"
          style={{ width: `${product.sold}%` }}
        ></div>
        <span className="absolute inset-0 flex justify-center items-center text-[10px] font-bold text-white drop-shadow">
          ĐÃ BÁN {product.sold}
        </span>
      </div>

      {/* Nút Mua Ngay */}
      <button className="w-full bg-[#e30019] text-white text-sm font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
        MUA NGAY
      </button>
    </div>
  );
};

// --- COMPONENT TIÊU ĐỀ DẢI BĂNG (RIBBON) ---
const SectionTitle = ({ title }) => (
  <div className="flex justify-center relative my-8">
    <div className="bg-gradient-to-r from-[#cc0000] via-[#e30019] to-[#cc0000] text-yellow-300 px-12 py-3 rounded-full font-black text-2xl z-10 relative shadow-[0_4px_10px_rgba(227,0,25,0.3)] border-2 border-yellow-400 uppercase tracking-wider">
      {title}
    </div>
    {/* Đường line chạy ngang */}
    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e30019] opacity-30 -z-0"></div>
  </div>
);

// --- TRANG CHÍNH ---
const HangKhuyenMai = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="bg-[#fdeded] min-h-screen font-sans">
      <Header />

      {/* TẦNG 1: HERO BANNER ĐỎ RỰC */}
      <div className="w-full bg-gradient-to-r from-[#b30000] via-[#e30019] to-[#b30000] pt-12 pb-16 relative overflow-hidden flex justify-center items-center border-b-4 border-yellow-400">
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-yellow-300 font-black text-3xl md:text-5xl tracking-widest drop-shadow-lg mb-2 uppercase">
            SIÊU SALE BÙNG NỔ
          </h2>
          <h1 className="text-white font-black text-4xl md:text-6xl uppercase drop-shadow-md">
            HÀNG MỚI CẬP BẾN <br /> GIẢM ĐẾN{" "}
            <span className="text-yellow-400 text-6xl md:text-8xl italic">
              50%
            </span>
          </h1>
          <div className="mt-6 flex gap-4">
            <span className="bg-yellow-400 text-red-700 font-bold px-6 py-2 rounded-full text-lg shadow-lg animate-bounce">
              DUY NHẤT HÔM NAY
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12 max-w-7xl">
        {/* TẦNG 2: THANH TAB DANH MỤC NỔI */}
        <div className="bg-white rounded-xl shadow-lg p-2 -mt-8 relative z-20 mx-auto max-w-4xl flex justify-between items-center overflow-x-auto gap-2 scrollbar-hide border border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex flex-col items-center justify-center flex-1 min-w-[100px] py-3 px-2 rounded-lg transition-all ${
                activeTab === cat.id
                  ? "bg-red-50 border-2 border-[#e30019] shadow-inner"
                  : "border-2 border-transparent hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span
                className={`text-sm font-bold whitespace-nowrap ${activeTab === cat.id ? "text-[#e30019]" : "text-gray-600"}`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* TẦNG 3: DEAL SỐC MỖI NGÀY */}
        <section>
          <SectionTitle title="⚡ Deal Sốc Mỗi Ngày ⚡" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {flashSaleProducts.map((prod, index) => (
              <SaleProductCard key={index} product={prod} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button className="bg-white border-2 border-[#e30019] text-[#e30019] hover:bg-[#e30019] hover:text-white font-bold py-3 px-12 rounded-lg transition-colors shadow-md text-lg">
              XEM THÊM DEAL SỐC
            </button>
          </div>
        </section>

        {/* TẦNG 4: SẢN PHẨM HOT TREND */}
        <section className="mt-8">
          <SectionTitle title="🔥 Sản Phẩm Hot Trend 🔥" />
          <div className="bg-gradient-to-b from-[#ffcccc] to-[#fdeded] rounded-2xl p-4 md:p-6 border border-red-200 shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {hotTrendProducts.map((prod, index) => (
                <SaleProductCard key={index} product={prod} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HangKhuyenMai;
