import React from "react";
import ProductCard from "./ProductCard";

// Nhận các biến từ trang Home truyền vào
const ProductSection = ({ tab1, tab2, banners, filters, products }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-6">
      {/* --- CỘT TRÁI: 2 Banner Quảng Cáo --- */}
      <div className="hidden lg:flex lg:w-1/4 xl:w-1/5 flex-col gap-4">
        <div className="w-full h-auto bg-blue-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-95">
          <img
            src={banners[0]}
            alt="Banner 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-auto bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-95">
          <img
            src={banners[1]}
            alt="Banner 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* --- CỘT PHẢI: Tab, Lọc & Lưới Sản Phẩm --- */}
      <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col">
        {/* 1. Khu vực Tab (Lấy tên từ biến tab1, tab2) */}
        <div className="flex border-b border-gray-200 mb-4 pb-2">
          <div className="w-1/2 text-center text-blue-600 font-bold text-xl cursor-pointer border-b-2 border-blue-600 pb-2">
            {tab1}
          </div>
          {tab2 && (
            <div className="w-1/2 text-center text-gray-600 font-medium text-xl cursor-pointer hover:text-blue-500 pb-2">
              {tab2}
            </div>
          )}
        </div>

        {/* 2. Hàng nút Lọc Hãng (Lấy từ biến filters) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((brand, index) => (
            <button
              key={index}
              className="border border-gray-300 rounded-full px-3 py-1 text-[18px] font-medium text-gray-800 hover:border-blue-500 hover:text-blue-600 transition"
            >
              {brand}
            </button>
          ))}
        </div>

        {/* 3. Lưới Sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((prod, idx) => (
            <ProductCard key={idx} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
