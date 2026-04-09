import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

// Dữ liệu giả lập danh sách đơn hàng
const mockOrderHistory = [
  {
    id: "#01195S2507000881",
    date: "13/07/2026",
    status: "Đã giao",
    shopName: "LTL Official Store",
    products: [
      {
        name: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
        variant: "Titan Tự nhiên",
        price: 29490000,
        oldPrice: 34990000,
        qty: 1,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
      },
    ],
    totalAmount: 29490000,
  },
  {
    id: "#00176S2408000264",
    date: "04/08/2026",
    status: "Đang giao",
    shopName: "LTL Accessories",
    products: [
      {
        name: "Tai nghe Bluetooth AirPods Pro 3",
        variant: "Trắng",
        price: 5490000,
        oldPrice: 6500000,
        qty: 1,
        image:
          "https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-1.png",
      },
      {
        name: "Ốp lưng Silicon MagSafe",
        variant: "Trong suốt",
        price: 890000,
        oldPrice: 1200000,
        qty: 2,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s", // Giả lập ảnh
      },
    ],
    totalAmount: 7270000,
  },
  {
    id: "#00888S2601000111",
    date: "10/01/2026",
    status: "Đã hủy",
    shopName: "LTL Official Store",
    products: [
      {
        name: "MacBook Air M3 15-inch 16GB 512GB",
        variant: "Midnight",
        price: 36990000,
        oldPrice: 39990000,
        qty: 1,
        image:
          "https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-1.png", // Giả lập ảnh
      },
    ],
    totalAmount: 36990000,
  },
];

// Các tab trạng thái (Giống Shopee)
const orderTabs = [
  "Tất cả",
  "Chờ thanh toán",
  "Đang xử lý",
  "Đang giao",
  "Đã giao",
  "Đã hủy",
];

const OrderHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả");

  // Hàm format tiền tệ
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  // Lọc đơn hàng theo tab
  const filteredOrders =
    activeTab === "Tất cả"
      ? mockOrderHistory
      : mockOrderHistory.filter((order) => order.status === activeTab);

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans flex flex-col">
      <Header />

      <main className="container mx-auto px-4 max-w-[1000px] py-8 flex-grow">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link to="/" className="hover:text-[#4A44F2] cursor-pointer">
            Trang chủ
          </Link>{" "}
          /
          <Link to="/profile" className="hover:text-[#4A44F2] cursor-pointer">
            Hồ sơ tài khoản
          </Link>{" "}
          /<span className="text-gray-800 font-medium">Đơn hàng của tôi</span>
        </div>

        {/* Khối quản lý đơn hàng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Thanh Tabs phân loại */}
          <div className="flex overflow-x-auto border-b border-gray-100 sticky top-0 bg-white z-10 scrollbar-hide">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab
                    ? "text-[#4A44F2]"
                    : "text-gray-600 hover:text-[#4A44F2]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4A44F2] rounded-t-md"></span>
                )}
              </button>
            ))}
          </div>

          {/* Ô Tìm kiếm đơn hàng */}
          <div className="bg-gray-50 p-4 border-b border-gray-100">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên sản phẩm, Mã đơn hàng..."
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-[#4A44F2] text-sm transition"
              />
            </div>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="p-4 flex flex-col gap-4 bg-gray-50">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                >
                  {/* Header của từng đơn */}
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        🏪 {order.shopName}
                      </span>
                      <button className="bg-[#4A44F2] text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                        Chat
                      </button>
                      <button className="border border-gray-300 text-gray-600 text-[10px] px-2 py-0.5 rounded hover:bg-gray-50 transition">
                        Xem Shop
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        Mã đơn: {order.id}
                      </span>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <span
                        className={`text-sm font-bold uppercase ${
                          order.status === "Đã giao"
                            ? "text-green-600"
                            : order.status === "Đã hủy"
                              ? "text-red-500"
                              : "text-orange-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn */}
                  <div className="flex flex-col gap-4">
                    {order.products.map((prod, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-20 h-20 object-contain border border-gray-100 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-800 font-medium text-sm line-clamp-2">
                            {prod.name}
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">
                            Phân loại: {prod.variant}
                          </p>
                          <p className="text-gray-800 text-sm mt-1 font-medium">
                            x{prod.qty}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-gray-400 line-through text-xs">
                            {formatPrice(prod.oldPrice)}
                          </span>
                          <span className="text-[#4A44F2] font-medium text-sm">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer của đơn hàng (Tổng tiền & Nút) */}
                  <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Ngày đặt:{" "}
                      <span className="font-medium text-gray-800">
                        {order.date}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="mb-3">
                        <span className="text-gray-600 text-sm mr-2">
                          Thành tiền:
                        </span>
                        <span className="text-xl font-bold text-[#4A44F2]">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === "Đã giao" && (
                          <button className="bg-[#4A44F2] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#3a34e0] transition">
                            Đánh giá
                          </button>
                        )}
                        <button className="border border-gray-300 bg-white text-gray-700 px-5 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
                          Mua lại
                        </button>
                        <button className="border border-gray-300 bg-white text-gray-700 px-5 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Giao diện khi không có đơn hàng nào */
              <div className="bg-white rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
                <span className="text-6xl mb-4 opacity-50">📋</span>
                <p className="text-lg">Chưa có đơn hàng</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 bg-[#4A44F2] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3a34e0] transition"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
