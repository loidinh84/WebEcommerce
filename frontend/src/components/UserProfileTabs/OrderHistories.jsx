import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../../config/api";

const orderTabs = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đang xử lý" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "refunded", label: "Trả hàng/Hoàn tiền" },
  { id: "cancelled", label: "Đã hủy" },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${time} ${day}`;
};

const OrdersTab = ({ profileData, navigate }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredOrders =
    activeTab === "all"
      ? profileData?.allOrders || []
      : (profileData?.allOrders || []).filter(
          (order) => order.trang_thai === activeTab,
        );

  const displayedOrders = filteredOrders.slice(0, visibleCount);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredOrders.length > visibleCount) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, filteredOrders.length]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisibleCount(5);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-blue-500 text-sm font-medium">
            Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="text-amber-400 text-sm font-medium">Đang xử lý</span>
        );
      case "shipping":
        return (
          <span className="text-orange-600 text-sm font-medium">Đang giao</span>
        );
      case "delivered":
        return (
          <span className="text-green-600 text-sm font-medium">
            Đơn hàng đã hoàn thành
          </span>
        );
      case "refunded":
        return (
          <span className="text-gray-700 text-sm font-medium">
            Trả hàng/Hoàn tiền
          </span>
        );
      case "cancelled":
        return <span className="text-red-500 text-sm font-medium">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Bộ lọc trạng thái */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 flex overflow-x-auto no-scrollbar">
        {orderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`whitespace-nowrap flex-1 py-4 px-4 text-sm font-medium transition cursor-pointer relative ${
              activeTab === tab.id
                ? "text-blue-500"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="flex flex-col gap-3">
        {displayedOrders.length > 0 ? (
          <>
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header Card */}
                <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm flex items-center gap-1 ">
                      Mã đơn hàng:{" "}
                      <div className="text-xs">{order.ma_don_hang}</div>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(order.trang_thai)}
                  </div>
                </div>

                <div
                  className="px-3 py-1 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => navigate(`/order-detail/${order.id}`)}
                >
                  {order.chi_tiet?.map((prod, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <img
                        src={
                          prod.bien_the?.san_pham?.hinh_anh?.[0]?.url_anh
                            ? `${BASE_URL}${prod.bien_the.san_pham.hinh_anh[0].url_anh}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={prod.ten_sp_luc_mua}
                        className="w-20 h-18 object-contain border border-gray-100"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-800 text-sm font-medium line-clamp-2 leading-5">
                          {prod.ten_sp_luc_mua}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Phân loại hàng: {prod.bien_the?.mau_sac || "Mặc định"}
                          {prod.bien_the?.dung_luong ? ` - ${prod.bien_the.dung_luong}` : ""}
                          {prod.bien_the?.ram ? ` - ${prod.bien_the.ram}` : ""}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          x{prod.so_luong}
                        </p>
                      </div>
                      <div className="text-right text-sm text-[#ee4d2d]">
                        {formatPrice(prod.don_gia)}₫
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Card */}
                <div className="p-3 bg-[#fffaf9] border-t border-gray-100 flex flex-col">
                  {/* Dòng tổng tiền */}
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-sm text-gray-600">Thành tiền:</span>
                    <span className="text-lg font-medium text-red-500">
                      {formatPrice(order.tong_thanh_toan)}₫
                    </span>
                  </div>

                  {/* Dòng action & thời gian */}
                  <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-600">
                      {order.trang_thai === "cancelled"
                        ? "Đã hủy vào: "
                        : "Ngày đặt: "}
                      {formatDateTime(order.created_at)}
                    </span>

                    <div className="flex gap-2">
                      {order.trang_thai === "delivered" && (
                        <button className="bg-[#ee4d2d] text-white rounded-sm px-3 py-1.5 text-sm hover:bg-[#d73211] transition cursor-pointer min-w-[120px]">
                          Đánh Giá
                        </button>
                      )}

                      {(order.trang_thai === "delivered" ||
                        order.trang_thai === "cancelled" ||
                        order.trang_thai === "refunded") && (
                        <button
                          className={`${
                            order.trang_thai === "cancelled"
                              ? "bg-[#ee4d2d] text-white hover:bg-[#d73211] border border-transparent"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          } px-3 py-1.5 rounded-sm text-sm transition cursor-pointer min-w-[120px]`}
                        >
                          Mua Lại
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/order-detail/${order.id}`)}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-sm text-sm hover:bg-gray-50 transition cursor-pointer min-w-[120px]"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator / Intersection Observer Target */}
            {filteredOrders.length > visibleCount && (
              <div ref={observerTarget} className="text-center py-6">
                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#ee4d2d] rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-sm py-24 text-center flex flex-col items-center border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">Chưa có đơn hàng nào!</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-2.5 bg-blue-100 text-gray-800 font-bold rounded-sm hover:bg-blue-200 transition cursor-pointer"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
