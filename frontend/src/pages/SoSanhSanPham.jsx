import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Images from "../assets/images/index";

// --- MOCK DATA: KHO SẢN PHẨM MẪU ---
const productDatabase = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
    price: 29490000,
    specs: {
      screen: "6.7 inch, Super Retina XDR OLED, 120Hz",
      os: "iOS 17",
      chip: "Apple A17 Pro 6 nhân",
      ram: "8 GB",
      storage: "256 GB",
      cameraBack: "Chính 48 MP & Phụ 12 MP, 12 MP",
      cameraFront: "12 MP",
      battery: "4422 mAh, 20W",
    },
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 5G",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/305658/samsung-galaxy-s24-ultra-grey-thumb-600x600.jpg",
    price: 25990000,
    specs: {
      screen: "6.8 inch, Dynamic AMOLED 2X, 120Hz",
      os: "Android 14",
      chip: "Snapdragon 8 Gen 3 for Galaxy",
      ram: "12 GB",
      storage: "256 GB",
      cameraBack: "Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP",
      cameraFront: "12 MP",
      battery: "5000 mAh, 45W",
    },
  },
  {
    id: 3,
    name: "Xiaomi 14 Pro 5G",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/319665/xiaomi-14-black-thumb-600x600.jpg",
    price: 22990000,
    specs: {
      screen: "6.73 inch, AMOLED, 120Hz",
      os: "HyperOS (Android 14)",
      chip: "Snapdragon 8 Gen 3",
      ram: "12 GB",
      storage: "256 GB",
      cameraBack: "3 camera 50 MP",
      cameraFront: "32 MP",
      battery: "4880 mAh, 120W",
    },
  },
];

// Danh sách các trường thông số cần so sánh
const specKeys = [
  { key: "screen", label: "Màn hình" },
  { key: "os", label: "Hệ điều hành" },
  { key: "chip", label: "Chip (CPU)" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Lưu trữ" },
  { key: "cameraBack", label: "Camera sau" },
  { key: "cameraFront", label: "Camera trước" },
  { key: "battery", label: "Pin & Sạc" },
];

const SoSanhSanPham = () => {
  // Mặc định lấy 2 sản phẩm đầu tiên vào bảng so sánh
  const [compareList, setCompareList] = useState([
    productDatabase[0],
    productDatabase[1],
  ]);
  const [highlightDiff, setHighlightDiff] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Thêm sản phẩm vào bảng so sánh (Tối đa 3 sản phẩm)
  const handleAddProduct = (product) => {
    if (compareList.find((p) => p.id === product.id)) {
      alert("Sản phẩm này đã có trong bảng so sánh!");
      return;
    }
    if (compareList.length >= 3) {
      alert("Chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc!");
      return;
    }
    setCompareList([...compareList, product]);
  };

  // Xóa sản phẩm khỏi bảng so sánh
  const handleRemoveProduct = (id) => {
    setCompareList(compareList.filter((p) => p.id !== id));
  };

  // Hàm kiểm tra xem một thông số có khác biệt giữa các sản phẩm đang so sánh hay không
  const isDifferent = (key) => {
    if (compareList.length < 2) return false;
    const firstValue = compareList[0].specs[key];
    return !compareList.every((p) => p.specs[key] === firstValue);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800 pb-12">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e30019] uppercase tracking-wide">
            So Sánh Sản Phẩm
          </h1>

          {/* Nút Toggle Highlight Khác biệt */}
          {compareList.length > 1 && (
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={highlightDiff}
                  onChange={() => setHighlightDiff(!highlightDiff)}
                />
                <div
                  className={`block w-10 h-6 rounded-full transition-colors ${highlightDiff ? "bg-[#e30019]" : "bg-gray-300"}`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${highlightDiff ? "transform translate-x-4" : ""}`}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-700">
                Làm nổi bật điểm khác biệt
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* =======================================================
              CỘT TRÁI: BẢNG SO SÁNH (CHIẾM 3/4)
              ======================================================= */}
          <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {compareList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4 opacity-50">⚖️</div>
                <p className="text-lg">
                  Chưa có sản phẩm nào được chọn để so sánh.
                </p>
                <p className="text-sm mt-2">
                  Vui lòng chọn sản phẩm từ danh sách bên phải.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  {/* HEADER BẢNG: HÌNH ẢNH & TÊN & NÚT XÓA */}
                  <thead className="bg-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="w-1/4 p-4 border-b border-r border-gray-100 text-left align-bottom bg-gray-50/50">
                        <span className="font-bold text-gray-600 text-base">
                          Tính năng & <br />
                          Thông số
                        </span>
                      </th>
                      {compareList.map((product) => (
                        <th
                          key={product.id}
                          className="p-4 border-b border-gray-100 text-center relative group min-w-[200px]"
                        >
                          {/* Nút Xóa */}
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="absolute top-2 right-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-sm"
                            title="Xóa khỏi so sánh"
                          >
                            ✕
                          </button>

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-contain mx-auto mb-3"
                          />
                          <h3 className="font-bold text-gray-800 line-clamp-2 hover:text-[#e30019] cursor-pointer transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[#e30019] font-black text-lg mt-2">
                            {formatPrice(product.price)}
                          </p>
                          <button className="mt-3 bg-[#e30019] text-white font-bold py-1.5 px-6 rounded hover:bg-red-800 transition-colors w-full">
                            MUA NGAY
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* BODY BẢNG: SO SÁNH THÔNG SỐ */}
                  <tbody>
                    {specKeys.map((spec, index) => {
                      const diff = highlightDiff && isDifferent(spec.key);
                      return (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${diff ? "bg-red-50/40" : ""}`}
                        >
                          <td className="p-4 border-r border-gray-100 font-bold text-gray-600 bg-gray-50/30">
                            {spec.label}
                          </td>
                          {compareList.map((product) => (
                            <td
                              key={product.id}
                              className={`p-4 text-center text-gray-800 leading-relaxed ${diff ? "text-[#e30019] font-medium" : ""}`}
                            >
                              {product.specs[spec.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* =======================================================
              CỘT PHẢI: KHO SẢN PHẨM GỢI Ý THÊM (CHIẾM 1/4)
              ======================================================= */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md border border-gray-200 p-5 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-[#201D8A] border-b pb-3 mb-4 flex items-center gap-2">
              <span className="text-xl"></span> Thêm sản phẩm vào so sánh
            </h2>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm outline-none focus:border-[#e30019]"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">⌕</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
              {productDatabase.map((prod) => {
                const isAdded = compareList.some((p) => p.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    className="flex gap-3 items-center border border-gray-100 p-2 rounded-lg hover:border-[#e30019] transition-colors bg-gray-50"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 object-contain bg-white rounded p-1 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">
                        {prod.name}
                      </h4>
                      <p className="text-[#e30019] font-bold text-sm mt-1">
                        {formatPrice(prod.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddProduct(prod)}
                      disabled={isAdded}
                      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-lg transition-colors ${
                        isAdded
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-100 text-[#201D8A] hover:bg-[#201D8A] hover:text-white cursor-pointer"
                      }`}
                      title={isAdded ? "Đã thêm" : "Thêm vào so sánh"}
                    >
                      {isAdded ? "✓" : "+"}
                    </button>
                  </div>
                );
              })}
            </div>

            {compareList.length >= 3 && (
              <p className="text-xs text-red-500 italic mt-3 text-center">
                *Đã đạt giới hạn 3 sản phẩm so sánh.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SoSanhSanPham;
