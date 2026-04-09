import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

// Dữ liệu mockup (Giữ ID số 3 để bạn test trang Chi tiết)
const mockOrderHistory = [
  {
    id: 3,
    ma_don_hang: "LTL-2026-001",
    date: "13/07/2026",
    status: "Đã giao",
    products: [
      {
        name: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
        variant: "Titan Tự nhiên",
        price: 29490000,
        qty: 1,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
      },
    ],
    totalAmount: 29490000,
  },
  // ... các đơn hàng khác
];

const orderTabs = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

const OrderHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả");

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const filteredOrders =
    activeTab === "Tất cả"
      ? mockOrderHistory
      : mockOrderHistory.filter((order) => order.status === activeTab);

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans flex flex-col">
      <Header />

      <main className="container mx-auto px-4 max-w-[900px] py-8 flex-grow">
        {/* Breadcrumb sạch sẽ */}
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link to="/" className="hover:text-[#4A44F2]">
            Trang chủ
          </Link>{" "}
          /<span className="text-gray-800 font-medium">Đơn hàng của tôi</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs phân loại đơn hàng */}
          <div className="flex border-b border-gray-100 bg-white">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                  activeTab === tab
                    ? "text-[#4A44F2]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4A44F2]"></span>
                )}
              </button>
            ))}
          </div>

          {/* Danh sách đơn hàng */}
          <div className="p-4 flex flex-col gap-4 bg-gray-50/50">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  {/* Mã đơn & Trạng thái */}
                  <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-sm font-black text-[#4A44F2]">
                      MÃ ĐƠN: {order.ma_don_hang}
                    </span>
                    <span
                      className={`text-[13px] font-bold px-3 py-1 ${
                        order.status === "Đã giao"
                          ? " text-green-600"
                          : " text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Nội dung sản phẩm */}
                  <div className="p-5 flex flex-col gap-4">
                    {order.products.map((prod, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img
                          src={prod.image}
                          alt=""
                          className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-800 font-bold text-sm">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Phân loại: {prod.variant} | SL: x{prod.qty}
                          </p>
                        </div>
                        <div className="text-right font-bold text-sm text-gray-800">
                          {formatPrice(prod.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tổng tiền & Action */}
                  <div className="px-5 py-4 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-400 font-medium">
                      Ngày đặt:{" "}
                      <span className="text-gray-700">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-gray-500 text-xs mr-2">
                          Tổng số tiền:
                        </span>
                        <span className="text-lg font-black text-red-600">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/order-detail/${order.id}`)}
                          className="bg-[#4A44F2] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                        >
                          Xem chi tiết
                        </button>
                        <button className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition">
                          Mua lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="text-5xl mb-4 grayscale opacity-50">📦</div>
                <p className="text-gray-400 font-bold">
                  Chưa có đơn hàng nào trong mục này
                </p>
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
