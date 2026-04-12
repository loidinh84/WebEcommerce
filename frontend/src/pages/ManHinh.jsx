import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";
import BASE_URL from "../config/api";

// --- MOCK DATA DÀNH CHO MÀN HÌNH ---
const brands = ["ASUS", "LG", "Samsung", "Dell", "Acer", "MSI", "ViewSonic", "Gigabyte", "AOC", "HKC"];
const needs = [
  { id: "gaming", name: "Gaming (144Hz+)"},
  { id: "do-hoa", name: "Đồ họa - Chuẩn màu"},
  { id: "van-phong", name: "Văn phòng - Học tập" },
  { id: "man-cong", name: "Màn hình Cong"},
  { id: "do-phan-giai-cao", name: "Độ phân giải 2K/4K"},
];

const mockMonitors = Array(15).fill({
  id: 1,
  name: "Màn hình LG UltraGear 24GN650-B 24\" IPS 144Hz 1ms",
  oldPrice: 5490000,
  newPrice: 3990000,
  discount: "27%",
  installment: "Trả góp 0%",
  tags: ["24 inch", "Tấm nền IPS", "144Hz", "1ms", "FHD"],
  rating: 4.9,
  reviews: 312,
  image: "https://cdn.tgdd.vn/Products/Images/5697/276161/lg-24gn650-b-238-inch-fhd-144hz-1ms-110422-031122-600x600.jpg"
});

const featuredMonitors = mockMonitors.slice(0, 4); // Lấy 4 sản phẩm đưa lên SẢN PHẨM NỔI BẬT

// --- COMPONENT THẺ SẢN PHẨM MÀN HÌNH ---
const MonitorCard = ({ product }) => {
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all relative flex flex-col h-full group cursor-pointer">
      {/* Tag Trả Góp / Giảm Giá */}
      <div className="absolute top-0 left-0 flex gap-1 z-10">
        {product.installment && (
          <span className="bg-[#f59e0b] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg rounded-tl-lg shadow-sm">
            {product.installment}
          </span>
        )}
        {product.discount && (
          <span className="bg-[#e30019] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg rounded-bl-lg shadow-sm">
            Giảm {product.discount}
          </span>
        )}
      </div>
      
      {/* Hình ảnh */}
      <div className="relative pt-6 pb-2 flex justify-center items-center overflow-hidden">
        <img src={product.image} alt={product.name} className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Thông số kỹ thuật (Tags Màn hình) */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {product.tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-medium px-1.5 py-0.5 rounded border border-blue-100">
            {tag}
          </span>
        ))}
      </div>

      {/* Tên sản phẩm */}
      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#e30019] transition-colors leading-snug">
        {product.name}
      </h3>

      {/* Đánh giá */}
      <div className="flex items-center gap-1 mb-2 text-xs">
        <span className="text-yellow-400">★★★★★</span>
        <span className="text-gray-400">({product.reviews})</span>
      </div>

      {/* Giá */}
      <div className="mt-auto">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-gray-400 line-through text-xs font-medium">{formatPrice(product.oldPrice)}</span>
        </div>
        <span className="text-[#e30019] font-bold text-lg leading-none block mb-3">{formatPrice(product.newPrice)}</span>
      </div>

      {/* Nút Mua */}
      <button className="w-full bg-[#f8f9fa] border border-gray-200 text-[#201D8A] group-hover:bg-[#201D8A] group-hover:border-[#201D8A] group-hover:text-white text-sm font-bold py-2 rounded transition-colors">
        MUA NGAY
      </button>
    </div>
  );
};

const ManHinh = () => {
  const [activeSort, setActiveSort] = useState("Mới nhất");

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 pb-12">
      <Header />

      <main className="container mx-auto px-4 py-4 max-w-7xl">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span className="hover:text-[#e30019] cursor-pointer">Trang chủ</span>
          <span>›</span>
          <span className="font-bold text-gray-800">Màn hình máy tính</span>
        </div>


        {/* BỘ LỌC TÌM KIẾM NỔI BẬT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mb-8">
          
          {/* Lọc theo Thương hiệu */}
          <div className="mb-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-[#e30019]">|</span> Thương hiệu
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {brands.map((brand, idx) => (
                <button key={idx} className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium hover:border-[#e30019] hover:text-[#e30019] transition-colors bg-white">
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Lọc theo Nhu cầu & Tần số quét */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-[#e30019]">|</span> Lọc theo nhu cầu
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {needs.map((need, idx) => (
                <button key={idx} className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:border-[#201D8A] hover:bg-blue-50 transition-colors bg-white">
                  <span className="text-lg">{need.icon}</span>
                  {need.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SẢN PHẨM NỔI BẬT (KHUNG ĐỎ) */}
        <section className="bg-gradient-to-b from-[#e30019] to-red-800 rounded-xl p-4 md:p-6 mb-8 shadow-md relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
          
          <div className="flex justify-between items-center mb-5 relative z-10">
            <h2 className="text-xl md:text-3xl font-black text-yellow-300 uppercase italic flex items-center gap-2 drop-shadow-md">
              <span className="text-3xl md:text-4xl">🔥</span> MÀN HÌNH NỔI BẬT
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
            {featuredMonitors.map((prod, index) => (
              <MonitorCard key={index} product={prod} />
            ))}
          </div>
        </section>

        {/* DANH SÁCH MÀN HÌNH CHÍNH */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <h2 className="text-xl font-bold text-gray-800 uppercase border-l-4 border-[#201D8A] pl-3">
              Tất cả Màn hình
            </h2>
            
            {/* Thanh Sắp Xếp */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm text-sm">
              <span className="px-3 text-gray-500 font-medium hidden md:inline">Sắp xếp:</span>
              {["Mới nhất", "Bán chạy", "Giá Thấp - Cao", "Giá Cao - Thấp"].map((sort) => (
                <button 
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  className={`px-3 md:px-4 py-1.5 rounded-md transition-colors font-medium ${activeSort === sort ? "bg-[#e30019] text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"}`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {mockMonitors.map((prod, index) => (
              <MonitorCard key={index} product={prod} />
            ))}
          </div>

          {/* Nút Xem Thêm */}
          <div className="flex justify-center mt-10">
            <button className="bg-white border-2 border-[#201D8A] text-[#201D8A] hover:bg-[#201D8A] hover:text-white font-bold py-3 px-14 rounded-lg transition-colors shadow-sm text-base">
              Xem thêm 85 Màn hình khác ▾
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ManHinh;