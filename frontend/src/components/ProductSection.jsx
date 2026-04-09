import React, { useState } from "react";
import ProductCard from "./ProductCard";

const ProductSection = ({
  tab1,
  tab2,
  sideWidget,
  filters,
  products,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-6">
      {/* === CỘT TRÁI: Widget thông minh (thay banner) === */}
      {sideWidget && (
        <div className="hidden lg:block lg:w-1/4 xl:w-1/5 flex-shrink-0">
          {sideWidget}
        </div>
      )}

      {/* === CỘT PHẢI: Tab, Lọc & Grid sản phẩm === */}
      <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* 1. Tab */}
        <div className="flex border-b border-gray-100 mb-4">
          {[tab1, tab2].filter(Boolean).map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`relative px-6 py-2.5 text-base font-semibold transition-colors ${
                activeTab === i
                  ? "text-[#4A44F2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A44F2] rounded-full" />
              )}
            </button>
          ))}

          {/* Nút "Xem tất cả" đẩy sang phải */}
          <button className="ml-auto text-sm text-[#4A44F2] font-medium hover:underline flex items-center gap-1 pr-1 cursor-pointer">
            Xem tất cả
          </button>
        </div>

        {/* 2. Filter hãng */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveFilter(null)}
            className={`rounded-full px-3 py-1 text-sm font-medium border transition ${
              activeFilter === null
                ? "bg-[#4A44F2] text-white border-[#4A44F2]"
                : "border-gray-200 text-gray-700 hover:border-[#4A44F2] hover:text-[#4A44F2]"
            }`}
          >
            Tất cả
          </button>
          {filters.map((brand, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(index)}
              className={`rounded-full px-3 py-1 text-sm font-medium border transition ${
                activeFilter === index
                  ? "bg-[#4A44F2] text-white border-[#4A44F2]"
                  : "border-gray-200 text-gray-700 hover:border-[#4A44F2] hover:text-[#4A44F2]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* 3. Grid sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {isLoading ? (
            // Hiển thị khung xương (Skeleton) khi đang tải dữ liệu
            Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-64 rounded-xl"
                ></div>
              ))
          ) : products && products.length > 0 ? (
            // Dữ liệu đã tải xong
            products
              .slice(0, 8)
              .map((prod, idx) => <ProductCard key={idx} product={prod} />)
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Chưa có sản phẩm nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
