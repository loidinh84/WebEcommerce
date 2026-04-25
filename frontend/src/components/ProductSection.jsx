import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import BASE_URL from "../config/api";

const EMPTY_ARRAY = [];

const ProductSection = ({
  tab1,
  tab2,
  filters = EMPTY_ARRAY,
  danhMucId1,
  danhMucId2,
  viewAllLink = "#",
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh mục ID hiện tại dựa trên tab
  const currentDanhMucId = activeTab === 0 ? danhMucId1 : danhMucId2;

  // Effect 1: Lấy danh sách thương hiệu
  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      if (!currentDanhMucId) {
        setBrands([]);
        return;
      }
      try {
        const res = await axios.get(
          `${BASE_URL}/api/sanPham/thuong-hieu/${currentDanhMucId}`
        );
        if (isMounted) {
          setBrands(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error("Lỗi lấy thương hiệu:", error);
        if (isMounted) setBrands([]);
      }
    };
    fetchBrands();
    return () => { isMounted = false; };
  }, [currentDanhMucId]);

  // Effect 2: Lấy danh sách sản phẩm
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      if (!currentDanhMucId) return;

      try {
        setLoading(true);
        let selectedBrand = "";

        if (activeFilter !== null) {
          const currentBrands = brands.length > 0 ? brands : filters;
          selectedBrand = currentBrands[activeFilter] || "";
        }

        const url = `${BASE_URL}/api/sanPham?danhMucId=${currentDanhMucId}${
          selectedBrand ? `&thuongHieu=${encodeURIComponent(selectedBrand)}` : ""
        }`;

        const res = await axios.get(url);
        if (isMounted) {
          const data = res.data.data || res.data;
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [currentDanhMucId, activeFilter, brands, activeTab]); // Thêm activeTab vào đây

  const handleTabChange = (index) => {
    if (index === activeTab) return;
    
    const nextId = index === 0 ? danhMucId1 : danhMucId2;
    setLoading(true);
    setActiveTab(index);
    setActiveFilter(null);
    setProducts([]);
    
    // Chỉ xóa brands nếu danh mục thực sự thay đổi
    if (nextId !== currentDanhMucId) {
      setBrands([]);
    }
  };

  return (
    <div className="w-full mt-8 group/section">
      {/* Khối container chính */}
      <div className="w-full mx-auto flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 lg:p-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* 1. Header: Tab & View All */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 mb-2 gap-3">
          <div className="flex gap-2">
            {[
              { label: tab1, id: danhMucId1 },
              { label: tab2, id: danhMucId2 },
            ]
              .filter((item) => item.label)
              .map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleTabChange(i)}
                  className={`relative px-6 py-1 text-lg font-medium cursor-pointer transition-all duration-300 ${
                    activeTab === i
                      ? "text-[#4A44F2]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {item.label}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[4px] bg-[#4A44F2] rounded-t-full transition-all duration-300 transform ${
                      activeTab === i
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    }`}
                  />
                </button>
              ))}
          </div>

          <a
            href={viewAllLink}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#4A44F2] transition-colors group/all pr-1 hover:underline"
          >
            Xem tất cả
          </a>
        </div>

        {/* 2. Bộ lọc hãng (Brands) */}
        {((brands && brands.length > 0) || (filters && filters.length > 0)) && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`rounded-xl px-4.5 py-1 text-sm font-medium transition-all duration-300 border ${
                activeFilter === null
                  ? "bg-[#4A44F2] text-white border-[#4A44F2] shadow-[0_4px_12px_rgba(74,68,242,0.25)]"
                  : "bg-gray-50 border-gray-100 text-gray-600 hover:border-[#4A44F2] hover:text-[#4A44F2] hover:bg-white"
              }`}
            >
              Tất cả
            </button>
            {(brands.length > 0 ? brands : filters).map((brand, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(index)}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-300 border ${
                  activeFilter === index
                    ? "bg-[#4A44F2] text-white border-[#4A44F2] shadow-[0_4px_12px_rgba(74,68,242,0.25)]"
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:border-[#4A44F2] hover:text-[#4A44F2] hover:bg-white"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {/* 3. Grid sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {loading ? (
            Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                </div>
              ))
          ) : products && products.length > 0 ? (
            products.slice(0, 10).map((prod, idx) => (
              <div
                key={prod.id || idx}
                className="transition-all duration-500 transform"
              >
                <ProductCard product={prod} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-400 text-lg">
                Hết hàng hoặc chưa có sản phẩm
              </span>
              <p className="text-gray-400 text-sm mt-1">
                Vui lòng quay lại sau nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
