import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BASE_URL from "../config/api";

const OrderDetail = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // API này lát nữa mình sẽ viết ở Backend
        const response = await fetch(
          `${BASE_URL}/api/taikhoan/order-detail/${id}`,
        );
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy đơn hàng!
      </div>
    );

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 max-w-[1280px] py-8 flex-grow">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#4A44F2] font-bold transition"
        >
          <span>←</span> Quay lại đơn hàng của tôi
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header trạng thái */}
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h1 className="text-xl font-black text-gray-800 uppercase">
                Đơn hàng #{order.ma_don_hang || order.id}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Ngày đặt:{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("vi-VN")
                  : "Đang cập nhật"}
              </p>
            </div>
            <span className="bg-[#4A44F2] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-md shadow-blue-100">
              {order.trang_thai}
            </span>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="p-6 space-y-6">
            <h2 className="font-bold text-gray-800 border-l-4 border-[#4A44F2] pl-3">
              Sản phẩm trong đơn
            </h2>
            {order.chi_tiet?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-lg">
                    {item.ten_sp_luc_mua}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Số lượng:{" "}
                    <span className="font-bold text-gray-800">
                      x{item.so_luong}
                    </span>
                  </p>
                  <p className="text-[#4A44F2] font-bold mt-1">
                    {new Intl.NumberFormat("vi-VN").format(item.don_gia)}đ
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Thành tiền</p>
                  <p className="font-black text-gray-800 text-lg">
                    {new Intl.NumberFormat("vi-VN").format(
                      order?.tong_thanh_toan || 0,
                    )}
                    đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng kết tiền */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(
                    order?.tong_thanh_toan || 0,
                  )}
                  đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-800 text-lg">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-black text-red-600">
                  {new Intl.NumberFormat("vi-VN").format(
                    order?.tong_thanh_toan || 0,
                  )}
                  đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
