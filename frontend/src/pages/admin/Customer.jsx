import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

// ── HẠNG THÀNH VIÊN ─────────────────────────────────────────────────────────
// Dựa theo tổng chi tiêu
const getMemberTier = (totalSpent) => {
  if (totalSpent >= 50000000)
    return {
      label: "Kim Cương",
      value: "diamond",
      cls: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    };
  if (totalSpent >= 20000000)
    return {
      label: "Vàng",
      value: "gold",
      cls: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };
  if (totalSpent >= 5000000)
    return {
      label: "Bạc",
      value: "silver",
      cls: "bg-gray-100 text-gray-600 border border-gray-300",
    };
  return {
    label: "Đồng",
    value: "bronze",
    cls: "bg-orange-100 text-orange-600 border border-orange-200",
  };
};
// ────────────────────────────────────────────────────────────────────────────

// Parse "dd/mm/yyyy" → Date
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [dd, mm, yyyy] = dateStr.split("/");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const mockCustomers = [
  {
    id: "KH001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    address: "123 Lê Lợi, Q1, TP.HCM",
    joinedDate: "15/01/2026",
    totalOrders: 5,
    totalSpent: 55000000,
    status: "active",
    recentOrders: [
      { id: "DH001", date: "09/04/2026", total: 34990000, status: "completed" },
      { id: "DH089", date: "10/02/2026", total: 10010000, status: "completed" },
    ],
  },
  {
    id: "KH002",
    name: "Trần Thị B",
    email: "tranthib.work@yahoo.com",
    phone: "0987654321",
    address: "456 Nguyễn Trãi, Ba Đình, HN",
    joinedDate: "20/02/2026",
    totalOrders: 1,
    totalSpent: 27490000,
    status: "active",
    recentOrders: [
      {
        id: "DH002",
        date: "09/04/2026",
        total: 27490000,
        status: "processing",
      },
    ],
  },
  {
    id: "KH003",
    name: "Lê Văn C",
    email: "levanc99@gmail.com",
    phone: "0911223344",
    address: "789 Điện Biên Phủ, Đà Nẵng",
    joinedDate: "05/03/2026",
    totalOrders: 3,
    totalSpent: 5500000,
    status: "banned",
    recentOrders: [
      { id: "DH003", date: "08/04/2026", total: 1500000, status: "cancelled" },
      { id: "DH102", date: "25/03/2026", total: 4000000, status: "completed" },
    ],
  },
  {
    id: "KH004",
    name: "Phạm Thị D",
    email: "phamthid@gmail.com",
    phone: "0933445566",
    address: "12 Trần Hưng Đạo, Q5, TP.HCM",
    joinedDate: "10/03/2026",
    totalOrders: 2,
    totalSpent: 3200000,
    status: "active",
    recentOrders: [
      { id: "DH004", date: "07/04/2026", total: 1700000, status: "completed" },
    ],
  },
];

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "active" | "banned"
  const [filterTier, setFilterTier] = useState("all"); // "all" | "diamond" | "gold" | "silver" | "bronze"
  const [filterDateFrom, setFilterDateFrom] = useState(""); // yyyy-mm-dd
  const [filterDateTo, setFilterDateTo] = useState(""); // yyyy-mm-dd
  // ────────────────────────────────────────────────────────

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    customerId: null,
    newStatus: null,
    title: "",
    message: "",
  });

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      // const response = await axios.get("${BASE_URL}/api/khachhang");
      // setCustomers(response.data);
      setTimeout(() => {
        setCustomers(mockCustomers);
        setIsLoading(false);
      }, 400);
    } catch (error) {
      setCustomers(mockCustomers);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const executeConfirmAction = async () => {
    try {
      const { customerId, newStatus } = confirmModal;
      setCustomers(
        customers.map((c) =>
          c.id === customerId ? { ...c, status: newStatus } : c,
        ),
      );
      showToast(
        newStatus === "banned" ? "Đã khóa tài khoản!" : "Đã mở khóa tài khoản!",
        "success",
      );
    } catch {
      showToast("Có lỗi xảy ra!", "error");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case "processing":
        return (
          <span className="text-blue-600 font-bold text-xs uppercase">
            Đang giao
          </span>
        );
      case "completed":
        return (
          <span className="text-green-600 font-bold text-xs uppercase">
            Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="text-red-500 font-bold text-xs uppercase">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="text-gray-500 font-bold text-xs uppercase">
            {status}
          </span>
        );
    }
  };

  // ── XÓA BỘ LỌC ──────────────────────────────────────────
  const hasActiveFilter =
    filterStatus !== "all" ||
    filterTier !== "all" ||
    filterDateFrom !== "" ||
    filterDateTo !== "" ||
    searchTerm !== "";

  const clearAllFilters = () => {
    setFilterStatus("all");
    setFilterTier("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── LỌC DỮ LIỆU ─────────────────────────────────────────
  const filteredCustomers = customers.filter((c) => {
    // 1. Trạng thái tài khoản
    if (filterStatus !== "all" && c.status !== filterStatus) return false;

    // 2. Hạng thành viên
    if (
      filterTier !== "all" &&
      getMemberTier(c.totalSpent).value !== filterTier
    )
      return false;

    // 3. Ngày tham gia
    const joined = parseDate(c.joinedDate);
    if (filterDateFrom && joined) {
      if (joined < new Date(filterDateFrom)) return false;
    }
    if (filterDateTo && joined) {
      const to = new Date(filterDateTo);
      to.setHours(23, 59, 59);
      if (joined > to) return false;
    }

    // 4. Tìm kiếm
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(s) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Đếm theo hạng để hiện badge
  const countByTier = (tierValue) =>
    tierValue === "all"
      ? customers.length
      : customers.filter((c) => getMemberTier(c.totalSpent).value === tierValue)
          .length;

  const countByStatus = (statusValue) =>
    statusValue === "all"
      ? customers.length
      : customers.filter((c) => c.status === statusValue).length;
  // ────────────────────────────────────────────────────────

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        {/* ================================================ */}
        {/* SIDEBAR BỘ LỌC                                   */}
        {/* ================================================ */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-4 pr-1">
          {/* -- Tìm kiếm -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
            <input
              type="text"
              placeholder="Tên, SĐT, Email..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Lọc trạng thái tài khoản -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Trạng thái tài khoản
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Đang hoạt động" },
                { value: "banned", label: "Đã khóa" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterStatus(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterStatus === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByStatus(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Lọc hạng thành viên -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Hạng thành viên
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "diamond", label: "Kim Cương", sub: "≥ 50tr" },
                { value: "gold", label: "Vàng", sub: "≥ 20tr" },
                { value: "silver", label: "Bạc", sub: "≥ 5tr" },
                { value: "bronze", label: "Đồng", sub: "< 5tr" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterTier(item.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterTier === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.sub && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        {item.sub}
                      </span>
                    )}
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByTier(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Lọc theo ngày tham gia -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Ngày tham gia
            </h3>
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
                  min={filterDateFrom}
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

          {/* -- Thống kê -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng khách hàng</span>
                <span className="font-bold text-gray-800">
                  {customers.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đang hoạt động</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("active")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã khóa</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("banned")}
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
              Danh sách Khách hàng
            </h2>
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-gray-50 text-gray-600 z-10 text-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-gray-200">
                    Khách hàng
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200">
                    Liên hệ
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-center w-32">
                    Hạng thành viên
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-center w-28">
                    Số đơn hàng
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-right">
                    Tổng chi tiêu
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-gray-200 text-center w-32">
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
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const isExpanded = expandedRows.includes(customer.id);
                    const tier = getMemberTier(customer.totalSpent);
                    return (
                      <React.Fragment key={customer.id}>
                        {/* Dòng chính */}
                        <tr
                          onClick={() => toggleRow(customer.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200
                            ${isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50 bg-white"}
                            ${customer.status === "banned" ? "opacity-60" : ""}`}
                        >
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Mã: {customer.id} · Tham gia:{" "}
                              {customer.joinedDate}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-800">
                              {customer.phone}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {customer.email}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-bold uppercase whitespace-nowrap ${tier.cls}`}
                            >
                              {tier.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-gray-800">
                            {customer.totalOrders}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-gray-800">
                            {formatPrice(customer.totalSpent)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {customer.status === "active" ? (
                              <span className="whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold uppercase bg-green-100 text-green-600 border border-green-200">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="whitespace-nowrap px-3 py-1 rounded-md text-xs font-bold uppercase bg-red-100 text-red-400 border border-red-200">
                                Đã khóa
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Dòng chi tiết */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="6" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">
                                {/* Thông tin chi tiết */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider">
                                    Thông tin chi tiết
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Họ và tên:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        {customer.name}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Hạng:
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${tier.cls}`}
                                      >
                                        {tier.label}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Tham gia từ:
                                      </span>
                                      <span className="text-gray-800">
                                        {customer.joinedDate}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-500 w-28 font-medium">
                                        Địa chỉ:
                                      </span>
                                      <span className="text-gray-800">
                                        {customer.address}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Lịch sử đơn hàng */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider flex justify-between">
                                    <span>Đơn hàng gần đây</span>
                                    <span className="text-blue-600 cursor-pointer hover:underline normal-case font-normal">
                                      Xem tất cả
                                    </span>
                                  </h4>
                                  <div className="space-y-3">
                                    {customer.recentOrders?.length > 0 ? (
                                      customer.recentOrders.map(
                                        (order, idx) => (
                                          <div
                                            key={idx}
                                            className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                                          >
                                            <div>
                                              <p className="font-bold text-blue-600 cursor-pointer hover:underline">
                                                {order.id}
                                              </p>
                                              <p className="text-xs text-gray-500 mt-1">
                                                {order.date}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-bold text-gray-800">
                                                {formatPrice(order.total)}
                                              </p>
                                              <p className="mt-1">
                                                {renderOrderStatus(
                                                  order.status,
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <p className="text-gray-500 text-sm italic">
                                        Khách hàng chưa có đơn hàng nào.
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Thao tác */}
                                <div className="w-full xl:w-48 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">
                                    Quản trị
                                  </h4>
                                  {customer.status === "active" ? (
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          actionType: "ban",
                                          customerId: customer.id,
                                          newStatus: "banned",
                                          title: "Cảnh báo khóa tài khoản",
                                          message: `Bạn có chắc chắn muốn khóa tài khoản của khách hàng ${customer.name}?`,
                                        })
                                      }
                                      className="w-full py-2.5 bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                                    >
                                      Khóa tài khoản
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          actionType: "unban",
                                          customerId: customer.id,
                                          newStatus: "active",
                                          title: "Mở khóa tài khoản",
                                          message: `Khôi phục quyền truy cập cho khách hàng ${customer.name}?`,
                                        })
                                      }
                                      className="w-full py-2.5 bg-green-50 border border-green-300 text-green-700 hover:bg-green-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                                    >
                                      Mở khóa tài khoản
                                    </button>
                                  )}
                                  <button className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors mt-auto cursor-pointer">
                                    Gửi Email
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
                {filteredCustomers.length}
              </span>{" "}
              / {customers.length} khách hàng
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
        type={confirmModal.actionType === "ban" ? "danger" : "primary"}
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

export default Customer;
