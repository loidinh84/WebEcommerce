import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import BASE_URL from "../config/api";

const ProductSection = ({
  tab1,
  tab2,
  filters = [],
  isLoading,
  danhMucId,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const selectedBrand =
          activeFilter !== null ? filters[activeFilter] : "";

        let url = `${BASE_URL}/api/sanpham?danhMucId=${danhMucId}`;

        if (selectedBrand) {
          url += `&thuongHieu=${selectedBrand}`;
        }

        const res = await axios.get(url);
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lọc sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [danhMucId, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4A44F2]"></div>
        <span className="ml-3 text-gray-600 font-medium">Đang tải sản phẩm...</span>
      </div>
    );
  }

  return (
    // Đã bỏ thẻ bọc flex-row ngoài cùng để tránh bị chia cột
    <div className="w-full mt-6">
      
      {/* Khối màu trắng chứa toàn bộ nội dung */}
      <div className="w-full mx-auto flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        
        {/* 1. Tab */}
        <div className="flex border-b border-gray-100 mb-5">
          {[tab1, tab2].filter(Boolean).map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`relative px-6 py-2.5 text-base font-bold transition-colors ${
                activeTab === i
                  ? "text-[#4A44F2]"
                  : "text-gray-500 hover:text-[#4A44F2]"
              }`}
            >
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4A44F2] rounded-t-md" />
              )}
            </button>
          ))}

          <button className="ml-auto text-sm text-[#4A44F2] font-semibold hover:underline flex items-center gap-1 pr-1 cursor-pointer">
            Xem tất cả
          </button>
        </div>

        {/* 2. Filter hãng */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          <button
            onClick={() => setActiveFilter(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${
              activeFilter === null
                ? "bg-[#4A44F2] text-white border-[#4A44F2] shadow-md"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#4A44F2] hover:text-[#4A44F2]"
            }`}
          >
            Tất cả
          </button>
          {filters.map((brand, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(index)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${
                activeFilter === index
                  ? "bg-[#4A44F2] text-white border-[#4A44F2] shadow-md"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#4A44F2] hover:text-[#4A44F2]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* 3. Grid sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-72 rounded-xl"
                ></div>
              ))
          ) : products && products.length > 0 ? (
            products
              .slice(0, 10)
              .map((prod, idx) => <ProductCard key={idx} product={prod} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="font-medium text-lg">Chưa có sản phẩm nào</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;