import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import BASE_URL from "../config/api";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  // Filters
  const [activeBrand, setActiveBrand] = useState(null);
  const [activeSort, setActiveSort] = useState("Mới nhất");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const BRAND_LIMIT = 10;

  const location = useLocation();

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy brand từ URL query nếu có
      const params = new URLSearchParams(location.search);
      const initialBrand = params.get("brand");
      if (initialBrand) setActiveBrand(initialBrand);

      // Xác định slug là ID hay Chuỗi SEO
      const isId = /^\d+$/.test(slug);
      const endpoint = isId 
        ? `${BASE_URL}/api/sanpham/danh-muc/id/${slug}`
        : `${BASE_URL}/api/sanpham/danh-muc/slug/${slug}`;

      // Fetch danh mục
      const catRes = await axios.get(endpoint);
      const categoryData = catRes.data;
      setCategory(categoryData);

      // Fetch brands
      const brandsRes = await axios.get(
        `${BASE_URL}/api/sanpham/thuong-hieu/${categoryData.id}`,
      );
      setBrands(brandsRes.data || []);

      setPage(1);
      await fetchProducts(categoryData.id, initialBrand || null, activeSort, 1, true);
    } catch (err) {
      console.error(err);
      setError("Không tìm thấy danh mục này.");
    } finally {
      setLoading(false);
    }
  }, [slug, activeSort, location.search]);

  const fetchProducts = async (
    catId,
    brand = null,
    sort = "Mới nhất",
    pageNum = 1,
    reset = false,
  ) => {
    try {
      if (pageNum > 1) setLoadingMore(true);

      let url = `${BASE_URL}/api/sanpham?danhMucId=${catId}&page=${pageNum}&limit=10`;
      if (brand) url += `&thuongHieu=${encodeURIComponent(brand)}`;

      const res = await axios.get(url);
      const fetchedData = res.data.data || [];
      const totalP = res.data.totalPages || 1;

      let processedProducts = [...fetchedData];

      if (sort === "Giá Thấp - Cao") {
        processedProducts.sort((a, b) => {
          const priceA = a.bien_the?.[0]?.gia_ban || a.gia_ban || 0;
          const priceB = b.bien_the?.[0]?.gia_ban || b.gia_ban || 0;
          return priceA - priceB;
        });
      } else if (sort === "Giá Cao - Thấp") {
        processedProducts.sort((a, b) => {
          const priceA = a.bien_the?.[0]?.gia_ban || a.gia_ban || 0;
          const priceB = b.bien_the?.[0]?.gia_ban || b.gia_ban || 0;
          return priceB - priceA;
        });
      }

      if (reset) {
        setProducts(processedProducts);
      } else {
        setProducts((prev) => [...prev, ...processedProducts]);
      }

      setTotalPages(totalP);
      setLoadingMore(false);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  useEffect(() => {
    if (category) {
      setPage(1);
      fetchProducts(category.id, activeBrand, activeSort, 1, true);
    }
  }, [activeBrand, activeSort]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          page < totalPages &&
          category
        ) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(category.id, activeBrand, activeSort, nextPage, false);
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadingMore, page, totalPages, category, activeBrand, activeSort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#4A44F2] rounded-full animate-spin"></div>
          </div>
          <p className="mt-8 text-gray-400 font-bold  text-sm animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              Rất tiếc!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Không tìm thấy danh mục hoặc có lỗi xảy ra.
            </p>
            <Link
              to="/"
              className="bg-[#4A44F2] text-white px-10 py-3 rounded-xl font-bold hover:shadow-lg transition-all inline-block"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const visibleBrands = showAllBrands ? brands : brands.slice(0, BRAND_LIMIT);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      <Header />

      <main className="container mx-auto px-4 py-3 max-w-[1280px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 px-1">
          <Link
            to="/"
            className="hover:text-[#4A44F2] transition-colors font-medium"
          >
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">
            {category.ten_danh_muc}
          </span>
        </nav>

        {/* Category Info & Filters */}
        <div className="bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100 p-4 mb-4 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-medium text-gray-900 ">
              {category.ten_danh_muc}
            </h1>
          </div>

          {/* Brands Selection */}
          {brands.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                {brands.length > BRAND_LIMIT && (
                  <button
                    onClick={() => setShowAllBrands(!showAllBrands)}
                    className="text-[#4A44F2] text-sm font-medium hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer group"
                  >
                    <span>
                      {showAllBrands
                        ? "Thu gọn"
                        : `Xem tất cả ${brands.length}`}
                    </span>
                    <span
                      className={`transition-transform duration-300 ${showAllBrands ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {visibleBrands.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setActiveBrand(activeBrand === brand ? null : brand)
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                      activeBrand === brand
                        ? "bg-[#4A44F2] text-white border-[#4A44F2] shadow-xl shadow-indigo-100"
                        : "bg-blue-50 border-blue-200 text-gray-500 hover:border-[#4A44F2] hover:text-[#4A44F2] hover:bg-white"
                    }`}
                  >
                    {brand.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-start items-center border-t border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
              {["Mới nhất", "Bán chạy", "Giá Thấp - Cao", "Giá Cao - Thấp"].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => setActiveSort(option)}
                    className={`px-3  py-2 rounded-xl text-sm  font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeSort === option
                        ? "bg-white shadow-md text-[#4A44F2] border border-gray-50"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Products Display */}
        {products.length > 0 ? (
          <div className="pb-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {products.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="transform transition-all duration-500"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Sentinel for Infinite Scroll */}
            <div
              ref={loaderRef}
              className="flex flex-col items-center justify-center mt-5"
            >
              {loadingMore ? (
                <>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#4A44F2] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#4A44F2] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#4A44F2] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    Đang tải thêm...
                  </p>
                </>
              ) : page >= totalPages && products.length > 0 ? (
                <div className="flex flex-col items-center opacity-40">
                  <div className=" w-20 bg-gray-300 mb-4"></div>
                  <p className="text-gray-400 text-xs font-medium">
                    Bạn đã xem hết sản phẩm trong mục này
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl py-10 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-15 h-15 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-[#4A44F2] opacity-[0.03] rounded-full animate-ping"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-300 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400 max-w-sm mx-auto font-medium text-lg leading-relaxed">
              Hiện tại chúng tôi chưa có sản phẩm nào phù hợp với lựa chọn này.
              Thử chọn hãng khác xem sao nhé!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
