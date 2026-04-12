import React, { useEffect, useState } from "react";
import * as Icons from "../../assets/icons/index";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const mockOrders = [
  {
    id: "DH001",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Lê Lợi, Q1, TP.HCM",
    date: "09/04/2026 14:30",
    total: 34990000,
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    orderStatus: "pending",
    items: [
      {
        name: "iPhone 16 Pro Max",
        variant: "Titan Đen - 256GB",
        qty: 1,
        price: 34990000,
      },
    ],
  },
  {
    id: "DH002",
    customerName: "Trần Thị B",
    phone: "0987654321",
    address: "456 Nguyễn Trãi, Ba Đình, HN",
    date: "09/04/2026 10:15",
    total: 27490000,
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Đã thanh toán",
    orderStatus: "processing",
    items: [
      {
        name: "Laptop ASUS ROG Strix G15",
        variant: "Xám Eclipse",
        qty: 1,
        price: 25990000,
      },
      { name: "Bàn phím cơ AKKO", variant: "Hồng", qty: 1, price: 1500000 },
    ],
  },
  {
    id: "DH003",
    customerName: "Lê Văn C",
    phone: "0911223344",
    address: "789 Điện Biên Phủ, Đà Nẵng",
    date: "08/04/2026 16:45",
    total: 1500000,
    paymentMethod: "VNPAY",
    paymentStatus: "Đã thanh toán",
    orderStatus: "completed",
    items: [
      { name: "Bàn phím cơ AKKO", variant: "Xanh", qty: 1, price: 1500000 },
    ],
  },
  {
    id: "DH004",
    customerName: "Phạm Thị D",
    phone: "0933445566",
    address: "12 Trần Hưng Đạo, Q5, TP.HCM",
    date: "07/04/2026 09:00",
    total: 5990000,
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    orderStatus: "cancelled",
    items: [
      {
        name: "Tai nghe Sony WH-1000XM5",
        variant: "Đen",
        qty: 1,
        price: 5990000,
      },
    ],
  },
  {
    id: "DH005",
    customerName: "Hoàng Văn E",
    phone: "0966778899",
    address: "88 Lý Tự Trọng, Hải Châu, Đà Nẵng",
    date: "06/04/2026 11:20",
    total: 52000000,
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Đã thanh toán",
    orderStatus: "completed",
    items: [
      {
        name: "MacBook Air M3",
        variant: "Midnight 16GB",
        qty: 1,
        price: 52000000,
      },
    ],
  },
];

// Parse "dd/mm/yyyy HH:MM" → Date object để so sánh
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [datePart] = dateStr.split(" ");
  const [dd, mm, yyyy] = datePart.split("/");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTab, setOrderTab] = useState("all"); // Tab trạng thái đơn hàng
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all"); // Phương thức TT
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all"); // Trạng thái TT
  const [filterDateFrom, setFilterDateFrom] = useState(""); // Từ ngày (yyyy-mm-dd)
  const [filterDateTo, setFilterDateTo] = useState(""); // Đến ngày (yyyy-mm-dd)
  // ────────────────────────────────────────────────────────

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    orderId: null,
    newStatus: null,
    title: "",
    message: "",
  });

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("${BASE_URL}/api/donhang");
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi API Đơn hàng, đang dùng dữ liệu mẫu:", error);
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2500,
    );
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const executeConfirmAction = async () => {
    try {
      const { orderId, newStatus } = confirmModal;
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
      let msg = "Cập nhật thành công!";
      if (newStatus === "processing") msg = "Đã duyệt đơn hàng thành công!";
      if (newStatus === "completed") msg = "Xác nhận đã giao hàng thành công!";
      if (newStatus === "cancelled") msg = "Đã hủy đơn hàng!";
      showToast(msg, "success");
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật trạng thái!", "error");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
      setExpandedRows([]);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
            Chờ xác nhận
          </span>
        );
      case "processing":
        return (
          <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
            Đang giao
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
            Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // ── XÓA TẤT CẢ BỘ LỌC ──────────────────────────────────
  const hasActiveFilter =
    orderTab !== "all" ||
    filterPaymentMethod !== "all" ||
    filterPaymentStatus !== "all" ||
    filterDateFrom !== "" ||
    filterDateTo !== "" ||
    searchTerm !== "";

  const clearAllFilters = () => {
    setOrderTab("all");
    setFilterPaymentMethod("all");
    setFilterPaymentStatus("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── LỌC DỮ LIỆU ─────────────────────────────────────────
  const filteredOrders = orders.filter((order) => {
    // 1. Tab trạng thái đơn
    if (orderTab !== "all" && order.orderStatus !== orderTab) return false;

    // 2. Phương thức thanh toán
    if (
      filterPaymentMethod !== "all" &&
      order.paymentMethod !== filterPaymentMethod
    )
      return false;

    // 3. Trạng thái thanh toán
    if (
      filterPaymentStatus !== "all" &&
      order.paymentStatus !== filterPaymentStatus
    )
      return false;

    // 4. Lọc ngày
    const orderDate = parseDate(order.date);
    if (filterDateFrom && orderDate) {
      const from = new Date(filterDateFrom);
      if (orderDate < from) return false;
    }
    if (filterDateTo && orderDate) {
      const to = new Date(filterDateTo);
      to.setHours(23, 59, 59); // bao gồm cả ngày to
      if (orderDate > to) return false;
    }

    // 5. Tìm kiếm
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchId = order.id?.toLowerCase().includes(s);
      const matchName = order.customerName?.toLowerCase().includes(s);
      const matchPhone = order.phone?.includes(searchTerm);
      return matchId || matchName || matchPhone;
    }

    return true;
  });

  // Đếm cho từng tab
  const countByStatus = (status) =>
    status === "all"
      ? orders.length
      : orders.filter((o) => o.orderStatus === status).length;
  // ────────────────────────────────────────────────────────

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        {/* ================================================ */}
        {/* CỘT TRÁI: BỘ LỌC                                 */}
        {/* ================================================ */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-4 pr-1">
          {/* -- Tìm kiếm -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
            <input
              type="text"
              placeholder="Mã đơn, tên, SĐT..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Lọc trạng thái đơn -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Trạng thái đơn hàng
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "pending", label: "Chờ xác nhận" },
                { value: "processing", label: "Đang giao" },
                { value: "completed", label: "Hoàn thành" },
                { value: "cancelled", label: "Đã hủy" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setOrderTab(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${orderTab === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByStatus(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Lọc phương thức thanh toán -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Phương thức thanh toán
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "COD", label: "COD (Tiền mặt)" },
                { value: "Chuyển khoản", label: "Chuyển khoản" },
                { value: "VNPAY", label: "Ví điện tử" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterPaymentMethod(item.value)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterPaymentMethod === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* -- Lọc trạng thái thanh toán -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Trạng thái thanh toán
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "Đã thanh toán", label: "Đã thanh toán" },
                { value: "Chưa thanh toán", label: "Chưa thanh toán" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterPaymentStatus(item.value)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterPaymentStatus === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* -- Lọc theo ngày -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thời gian</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  min={filterDateFrom} // không cho chọn ngày kết thúc trước ngày bắt đầu
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white cursor-pointer"
                />
              </div>
              {(filterDateFrom || filterDateTo) && (
                <button
                  onClick={() => {
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                  className="w-full text-xs text-gray-500 hover:text-red-500 font-medium cursor-pointer py-1 transition-colors"
                >
                  ✕ Xóa bộ lọc ngày
                </button>
              )}
            </div>
          </div>

          {/* -- Thống kê nhanh -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng đơn</span>
                <span className="font-bold text-gray-800">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chờ xác nhận</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("pending")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đang giao</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("processing")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hoàn thành</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("completed")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã hủy</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("cancelled")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* CỘT PHẢI: BẢNG DỮ LIỆU                          */}
        {/* ================================================ */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách Đơn hàng
            </h2>
          </div>

          {/* Tab trạng thái đơn */}
          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0 overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "Tất cả đơn" },
              { id: "pending", label: "Chờ xác nhận" },
              { id: "processing", label: "Đang giao" },
              { id: "completed", label: "Hoàn thành" },
              { id: "cancelled", label: "Đã hủy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOrderTab(tab.id)}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  orderTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label} ({countByStatus(tab.id)})
              </button>
            ))}
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-gray-50 text-gray-600 z-10 text-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-gray-200">
                    Mã ĐH
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200">
                    Khách hàng
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200">
                    Ngày đặt
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-right">
                    Tổng tiền
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-center">
                    Thanh toán
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-center">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isExpanded = expandedRows.includes(order.id);
                    return (
                      <React.Fragment key={order.id}>
                        {/* Dòng chính */}
                        <tr
                          onClick={() => toggleRow(order.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200 ${
                            isExpanded
                              ? "bg-blue-50/50"
                              : "hover:bg-blue-50/30 bg-white"
                          } ${order.orderStatus === "cancelled" ? "opacity-60" : ""}`}
                        >
                          <td className="py-4 px-6 font-bold text-blue-600">
                            {order.id}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.phone}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {order.date}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-gray-800">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <p className="font-medium text-gray-800 text-xs">
                              {order.paymentMethod}
                            </p>
                            <p
                              className={`text-[10px] font-bold mt-1 uppercase ${order.paymentStatus === "Đã thanh toán" ? "text-green-600" : "text-orange-500"}`}
                            >
                              {order.paymentStatus}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {renderStatusBadge(order.orderStatus)}
                          </td>
                        </tr>

                        {/* Dòng chi tiết mở rộng */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="6" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider">
                                    Thông tin giao hàng
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Người nhận:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        {order.customerName}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Điện thoại:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        {order.phone}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Địa chỉ:
                                      </span>
                                      <span className="text-gray-800">
                                        {order.address}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider">
                                    Sản phẩm đặt mua
                                  </h4>
                                  <div className="space-y-3">
                                    {order.items?.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                                      >
                                        <div>
                                          <p className="font-semibold text-gray-800">
                                            {item.name}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Phân loại: {item.variant}{" "}
                                            <span className="mx-2">|</span> SL:{" "}
                                            <span className="font-bold">
                                              {item.qty}
                                            </span>
                                          </p>
                                        </div>
                                        <p className="font-bold text-blue-600">
                                          {formatPrice(item.price)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="w-full xl:w-48 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">
                                    Thao tác
                                  </h4>
                                  {order.orderStatus === "pending" && (
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          actionType: "process",
                                          orderId: order.id,
                                          newStatus: "processing",
                                          title: "Xác nhận duyệt đơn",
                                          message: `Duyệt và chuyển đơn hàng ${order.id} sang trạng thái Đang giao?`,
                                        })
                                      }
                                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors shadow-sm cursor-pointer"
                                    >
                                      Duyệt đơn này
                                    </button>
                                  )}
                                  {order.orderStatus === "processing" && (
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          actionType: "complete",
                                          orderId: order.id,
                                          newStatus: "completed",
                                          title: "Xác nhận giao thành công",
                                          message: `Đơn hàng ${order.id} đã được giao thành công?`,
                                        })
                                      }
                                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors shadow-sm cursor-pointer"
                                    >
                                      Đã giao xong
                                    </button>
                                  )}
                                  {(order.orderStatus === "pending" ||
                                    order.orderStatus === "processing") && (
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          actionType: "cancel",
                                          orderId: order.id,
                                          newStatus: "cancelled",
                                          title: "Cảnh báo hủy đơn",
                                          message: `Bạn có chắc chắn hủy đơn hàng ${order.id} không?`,
                                        })
                                      }
                                      className="w-full py-2.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                                    >
                                      Hủy đơn hàng
                                    </button>
                                  )}
                                  <button className="w-full py-2.5 bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors mt-auto cursor-pointer">
                                    In hóa đơn
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-600 shrink-0">
            <span className="font-medium">
              Hiển thị{" "}
              <span className="font-semibold text-gray-800">
                {filteredOrders.length}
              </span>{" "}
              / {orders.length} đơn hàng
              {hasActiveFilter && (
                <button
                  onClick={clearAllFilters}
                  className="ml-4 text-blue-500 hover:text-blue-700 font-medium cursor-pointer text-xs"
                >
                  ✕ Xóa tất cả bộ lọc
                </button>
              )}
            </span>
            <div className="flex gap-1.5 items-center">
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &laquo;
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &lt;
              </button>
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &gt;
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.actionType === "cancel" ? "danger" : "primary"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirmAction}
      />

      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Order;
