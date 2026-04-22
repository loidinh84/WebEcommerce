import React from "react";
import { Icons } from "./Icons";

const OrdersTab = ({ profileData, navigate }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Bộ lọc trạng thái nhanh */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex overflow-x-auto no-scrollbar gap-2">
        {["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"].map(
          (status, index) => (
            <button
              key={index}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition ${
                index === 0
                  ? "bg-[#4A44F2] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ),
        )}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="flex flex-col gap-4">
        {profileData?.allOrders?.length > 0 ? (
          profileData.allOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#4A44F2]/30 transition-all"
            >
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-[#4A44F2] font-black uppercase text-xs">
                    Mã đơn: #{order.ma_don_hang}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {new Date(order.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm ${
                    order.trang_thai === "delivered"
                      ? "bg-green-500 text-white"
                      : "bg-orange-400 text-white"
                  }`}
                >
                  {order.trang_thai === "delivered"
                    ? "Thành công"
                    : "Đang xử lý"}
                </span>
              </div>

              <div className="p-4 flex gap-4 items-center">
                <div className="flex-1">
                  <p className="font-bold text-gray-800 line-clamp-1">
                    {order.chi_tiet?.[0]?.ten_sp_luc_mua ||
                      "Đơn hàng hệ thống LTL"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Số lượng sản phẩm: {order.chi_tiet?.length || 1}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Thành tiền</p>
                  <p className="font-black text-[#4A44F2] text-lg">
                    {new Intl.NumberFormat("vi-VN").format(
                      order.tong_thanh_toan,
                    )}
                    đ
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50/30 flex justify-end gap-3">
                <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-white transition">
                  Mua lại
                </button>
                <button
                  onClick={() => navigate(`/order-detail/${order.id}`)}
                  className="px-4 py-1.5 bg-[#4A44F2] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                >
                  Chi tiết đơn hàng
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-20 text-center flex flex-col items-center border border-dashed border-gray-200">
            <Icons.CartEmpty />
            <p className="text-gray-400 font-medium">
              Bạn chưa thực hiện giao dịch nào.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-[#4A44F2] font-bold hover:underline"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
