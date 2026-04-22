import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const brands = ["iPhone", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Nokia", "ASUS"];

const needs = [
  { id: "chup-anh", name: "Chụp ảnh, quay phim", icon: "📸" },
  { id: "choi-game", name: "Chơi game mượt", icon: "🎮" },
  { id: "pin-trau", name: "Pin trâu sạc nhanh", icon: "🔋" },
  { id: "mong-nhe", name: "Mỏng nhẹ, cao cấp", icon: "✨" },
];

const mockPhones = Array(15).fill({
  id: 1,
  slug: "iphone-15-pro-max-256gb",
  ten_san_pham: "iPhone 15 Pro Max 256GB - Chính hãng VN/A",
  luot_xem: 5200,
  hinh_anh: [{ url_anh: "", la_anh_chinh: true }],
  bien_the: [{ gia_goc: 34990000, gia_ban: 29990000 }]
});

const featuredPhones = mockPhones.slice(0, 4);

const DienThoai = () => {
  const [activeSort, setActiveSort] = useState("Mới nhất");

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-4 max-w-7xl flex-grow">
        
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span className="hover:text-[#e30019] cursor-pointer">Trang chủ</span>
          <span>›</span>
          <span className="font-bold text-gray-800">Điện thoại</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Hãng Điện thoại</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand, idx) => (
                <button key={idx} className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium hover:border-[#e30019] hover:text-[#e30019] transition-colors">
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Chọn theo nhu cầu</h3>
            <div className="flex flex-wrap gap-2">
              {needs.map((need, idx) => (
                <button key={idx} className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:border-[#201D8A] hover:bg-blue-50 transition-colors">
                  <span className="text-lg">{need.icon}</span>
                  {need.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-gradient-to-b from-[#e30019] to-red-800 rounded-xl p-4 md:p-6 mb-8 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-black text-yellow-300 uppercase italic flex items-center gap-2">
              <span className="text-3xl">🔥</span> ĐIỆN THOẠI NỔI BẬT
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featuredPhones.map((prod, index) => (
              <ProductCard key={index} product={prod} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-800 uppercase">Tất cả Điện thoại</h2>
            
            <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm text-sm">
              <span className="px-3 text-gray-500 font-medium">Sắp xếp theo:</span>
              {["Mới nhất", "Bán chạy", "Giá Thấp - Cao", "Giá Cao - Thấp"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  className={`px-4 py-1.5 rounded-md transition-colors ${activeSort === sort ? "bg-[#e30019] text-white font-bold" : "bg-transparent text-gray-700 hover:bg-gray-100"}`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {mockPhones.map((prod, index) => (
              <ProductCard key={index} product={prod} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button className="bg-white border-2 border-[#201D8A] text-[#201D8A] hover:bg-[#201D8A] hover:text-white font-bold py-2.5 px-12 rounded-lg transition-colors shadow-sm">
              Xem thêm 234 Điện thoại khác ▾
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DienThoai;