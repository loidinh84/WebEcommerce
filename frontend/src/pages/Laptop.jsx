import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";

// --- MOCK DATA ---
const brands = [
  "MacBook",
  "ASUS",
  "Lenovo",
  "Dell",
  "HP",
  "Acer",
  "MSI",
  "Gigabyte",
];
const needs = [
  { id: "gaming", name: "Gaming" },
  { id: "do-hoa", name: "Đồ họa - Kỹ thuật" },
  { id: "van-phong", name: "Học tập - Văn phòng" },
  { id: "mong-nhe", name: "Mỏng nhẹ cao cấp" },
];

const mockLaptops = Array(15).fill({
  id: 1,
  name: "Laptop ASUS TUF Gaming F15 FX507ZC4 i5 12500H/16GB/512GB/RTX3050",
  oldPrice: 24990000,
  newPrice: 19990000,
  discount: "20%",
  installment: "Trả góp 0%",
  tags: ['15.6" 144Hz', "Core i5", "16GB RAM", "512GB SSD", "RTX 3050"],
  rating: 4.8,
  reviews: 124,
  image:
    "https://cdn.tgdd.vn/Products/Images/44/301634/asus-tuf-gaming-f15-fx507zc4-i5-hn074w-thumb-600x600.jpg",
});

const featuredLaptops = mockLaptops.slice(0, 4); // Lấy 4 sản phẩm làm nổi bật

// --- COMPONENT THẺ SẢN PHẨM ---
const LaptopCard = ({ product }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-lg transition-all relative flex flex-col h-full group cursor-pointer">
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
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thông số kỹ thuật (Tags) */}
      <div className="flex flex-wrap gap-1 mb-2">
        {product.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200"
          >
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
          <span className="text-gray-400 line-through text-xs font-medium">
            {formatPrice(product.oldPrice)}
          </span>
        </div>
        <span className="text-[#e30019] font-bold text-lg leading-none block mb-3">
          {formatPrice(product.newPrice)}
        </span>
      </div>

      {/* Nút Mua */}
      <button className="w-full bg-[#f8f9fa] border border-gray-200 text-[#201D8A] group-hover:bg-[#201D8A] group-hover:border-[#201D8A] group-hover:text-white text-sm font-bold py-2 rounded transition-colors">
        MUA NGAY
      </button>
    </div>
  );
};

const Laptop = () => {
  const [activeSort, setActiveSort] = useState("Mới nhất");

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-4 max-w-7xl">
        {/* BREADCRUMB */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span className="hover:text-[#e30019] cursor-pointer">Trang chủ</span>
          <span>›</span>
          <span className="font-bold text-gray-800">Laptop</span>
        </div>

        {/* BỘ LỌC TÌM KIẾM NỔI BẬT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          {/* Lọc theo Hãng */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Hãng Laptop</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand, idx) => (
                <button
                  key={idx}
                  className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium hover:border-[#e30019] hover:text-[#e30019] transition-colors"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Lọc theo Nhu cầu */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Chọn theo nhu cầu</h3>
            <div className="flex flex-wrap gap-2">
              {needs.map((need, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:border-[#201D8A] hover:bg-blue-50 transition-colors"
                >
                  <span className="text-lg">{need.icon}</span>
                  {need.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SẢN PHẨM NỔI BẬT (KHUNG ĐỎ) */}
        <section className="bg-gradient-to-b from-[#e30019] to-red-800 rounded-xl p-4 md:p-6 mb-8 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-black text-yellow-300 uppercase italic flex items-center gap-2">
              <span className="text-3xl">🔥</span> SẢN PHẨM NỔI BẬT
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featuredLaptops.map((prod, index) => (
              <LaptopCard key={index} product={prod} />
            ))}
          </div>
        </section>

        {/* DANH SÁCH SẢN PHẨM CHÍNH */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-800 uppercase">
              Tất cả Laptop
            </h2>

            {/* Thanh Sắp Xếp */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm text-sm">
              <span className="px-3 text-gray-500 font-medium">
                Sắp xếp theo:
              </span>
              {["Mới nhất", "Bán chạy", "Giá Thấp - Cao", "Giá Cao - Thấp"].map(
                (sort) => (
                  <button
                    key={sort}
                    onClick={() => setActiveSort(sort)}
                    className={`px-4 py-1.5 rounded-md transition-colors ${activeSort === sort ? "bg-[#e30019] text-white font-bold" : "bg-transparent text-gray-700 hover:bg-gray-100"}`}
                  >
                    {sort}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {mockLaptops.map((prod, index) => (
              <LaptopCard key={index} product={prod} />
            ))}
          </div>

          {/* Nút Xem Thêm */}
          <div className="flex justify-center mt-8">
            <button className="bg-white border-2 border-[#201D8A] text-[#201D8A] hover:bg-[#201D8A] hover:text-white font-bold py-2.5 px-12 rounded-lg transition-colors shadow-sm">
              Xem thêm 145 Laptop khác ▾
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Laptop;
