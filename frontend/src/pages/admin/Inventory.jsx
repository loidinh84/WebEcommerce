import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const mockInventory = [
  {
    id: "SKU001",
    name: "iPhone 16 Pro Max - Titan Đen 256GB",
    category: "Điện thoại",
    stock: 150,
    minStock: 20,
    status: "in_stock",
    lastUpdated: "09/04/2026 10:00",
    history: [
      {
        date: "09/04/2026 08:00",
        type: "import",
        qty: 50,
        note: "Nhập kho đợt 1 tháng 4",
      },
      {
        date: "08/04/2026 15:30",
        type: "export",
        qty: 2,
        note: "Xuất bán lẻ (DH001)",
      },
    ],
  },
  {
    id: "SKU002",
    name: "Laptop ASUS ROG Strix G15 - Xám Eclipse",
    category: "Laptop",
    stock: 5,
    minStock: 10,
    status: "low_stock",
    lastUpdated: "08/04/2026 15:30",
    history: [
      {
        date: "08/04/2026 10:15",
        type: "export",
        qty: 1,
        note: "Xuất bán lẻ (DH002)",
      },
      {
        date: "01/04/2026 09:00",
        type: "import",
        qty: 10,
        note: "Nhập kho đầu tháng",
      },
    ],
  },
  {
    id: "SKU003",
    name: "Bàn phím cơ AKKO - Hồng",
    category: "Phụ kiện",
    stock: 0,
    minStock: 5,
    status: "out_of_stock",
    lastUpdated: "05/04/2026 09:15",
    history: [
      {
        date: "05/04/2026 09:15",
        type: "export",
        qty: 1,
        note: "Xuất bán lẻ (DH003)",
      },
      {
        date: "20/03/2026 14:00",
        type: "export",
        qty: 3,
        note: "Xuất bán lẻ tổng hợp",
      },
    ],
  },
];

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMinStock, setFilterMinStock] = useState("all"); // "all" | "below" | "above"
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
    skuId: null,
    title: "",
    message: "",
  });

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      // const response = await axios.get("${BASE_URL}/api/khohang");
      setTimeout(() => {
        setInventory(mockInventory);
        setIsLoading(false);
      }, 400);
    } catch {
      setInventory(mockInventory);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
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
      const { skuId, actionType } = confirmModal;
      if (actionType === "request_import") {
        showToast(`Đã tạo phiếu yêu cầu nhập hàng cho mã ${skuId}!`, "success");
      } else if (actionType === "audit") {
        showToast(`Đã tạo phiếu kiểm kho cho mã ${skuId}!`, "success");
      }
    } catch {
      showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const renderStockStatus = (status, stock) => {
    if (status === "in_stock")
      return (
        <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
          Còn hàng
        </span>
      );
    if (status === "low_stock")
      return (
        <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
          Sắp hết ({stock})
        </span>
      );
    return (
      <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
        Hết hàng
      </span>
    );
  };

  // ── XÓA TẤT CẢ BỘ LỌC ──────────────────────────────────
  const hasActiveFilter =
    statusFilter !== "all" ||
    filterCategory !== "all" ||
    filterMinStock !== "all" ||
    filterDateFrom !== "" ||
    filterDateTo !== "" ||
    searchTerm !== "";

  const clearAllFilters = () => {
    setStatusFilter("all");
    setFilterCategory("all");
    setFilterMinStock("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── LỌC DỮ LIỆU ─────────────────────────────────────────
  const filteredInventory = inventory.filter((item) => {
    // 1. Trạng thái kho
    if (statusFilter !== "all" && item.status !== statusFilter) return false;

    // 2. Danh mục
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;

    // 3. Định mức tồn
    if (filterMinStock === "below" && item.stock >= item.minStock) return false;
    if (filterMinStock === "above" && item.stock < item.minStock) return false;

    // 4. Ngày cập nhật (lastUpdated format: "dd/mm/yyyy HH:mm")
    if (filterDateFrom || filterDateTo) {
      const [datePart] = item.lastUpdated.split(" ");
      const [dd, mm, yyyy] = datePart.split("/");
      const itemDate = new Date(`${yyyy}-${mm}-${dd}`);
      if (filterDateFrom && itemDate < new Date(filterDateFrom)) return false;
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59);
        if (itemDate > to) return false;
      }
    }

    // 5. Tìm kiếm
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(s) || item.id.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Helper đếm theo danh mục / định mức
  const countByCategory = (cat) =>
    cat === "all"
      ? inventory.length
      : inventory.filter((i) => i.category === cat).length;

  const countByMinStock = (val) => {
    if (val === "all") return inventory.length;
    if (val === "below")
      return inventory.filter((i) => i.stock < i.minStock).length;
    return inventory.filter((i) => i.stock >= i.minStock).length;
  };

  const countByStatus = (val) =>
    val === "all"
      ? inventory.length
      : inventory.filter((i) => i.status === val).length;
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Tìm kiếm
            </h3>
            <input
              type="text"
              placeholder="Mã SKU, tên sản phẩm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Trạng thái kho -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Trạng thái kho
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "in_stock", label: "Còn hàng" },
                { value: "low_stock", label: "Sắp hết hàng" },
                { value: "out_of_stock", label: "Hết hàng" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setStatusFilter(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${statusFilter === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByStatus(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Danh mục -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Danh mục
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "Điện thoại", label: "Điện thoại" },
                { value: "Laptop", label: "Laptop & Macbook" },
                { value: "Phụ kiện", label: "Phụ kiện - Bàn phím" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterCategory(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterCategory === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByCategory(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Định mức tồn kho -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Định mức tồn kho
            </h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                { value: "below", label: "Dưới định mức" },
                { value: "above", label: "Đạt định mức" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterMinStock(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${filterMinStock === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByMinStock(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Ngày cập nhật -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Ngày cập nhật
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
        </div>

        {/* ================================================ */}
        {/* CỘT PHẢI: BẢNG DỮ LIỆU                          */}
        {/* ================================================ */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              Quản lý Kho hàng
            </h2>
            <div className="flex gap-3">
              <button onClick={() => navigate("/admin/inventory-check")} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm cursor-pointer">
                Kiểm kho
              </button>
              <button onClick={() => navigate("/admin/inventory/import")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm cursor-pointer">
                Nhập hàng
              </button>
            </div>
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">
                    Mã SKU
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">
                    Tên sản phẩm / Phân loại
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">
                    Định mức tồn
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-right">
                    Tồn thực tế
                  </th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center w-36">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu kho...
                      </div>
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      Không tìm thấy mã hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const isExpanded = expandedRows.includes(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        {/* Dòng chính */}
                        <tr
                          onClick={() => toggleRow(item.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200
                            ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"}
                            ${item.status === "out_of_stock" ? "bg-red-50/30" : ""}`}
                        >
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {item.id}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Danh mục: {item.category}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-gray-500">
                            {item.minStock}
                          </td>
                          <td
                            className={`py-4 px-6 text-right font-bold text-lg ${item.stock <= item.minStock ? "text-red-600" : "text-gray-800"}`}
                          >
                            {item.stock}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {renderStockStatus(item.status, item.stock)}
                          </td>
                        </tr>

                        {/* Dòng chi tiết — theo style Billards */}
                        {isExpanded && (
                          <tr className="border-b border-blue-100">
                            <td colSpan="5" className="p-0">
                              <div className="bg-white border-t-2 border-blue-400">
                                {/* Tab bar */}
                                <div className="flex border-b border-gray-200 px-6">
                                  <button className="py-3 px-4 text-sm font-bold text-blue-600 border-b-2 border-blue-500 -mb-px cursor-pointer">
                                    Thông tin
                                  </button>
                                </div>

                                {/* Detail content */}
                                <div className="p-6">
                                  {/* Header row */}
                                  <div className="grid grid-cols-3 gap-6 mb-5 text-sm">
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-28 shrink-0">Mã phiếu nhập:</span>
                                        <span className="font-semibold text-gray-800">{item.id}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-28 shrink-0">Thời gian:</span>
                                        <span className="text-gray-700">{item.lastUpdated}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-28 shrink-0">Nhà cung cấp:</span>
                                        <span className="text-blue-600 font-medium cursor-pointer hover:underline">Chưa xác định</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-24 shrink-0">Trạng thái:</span>
                                        <span className="text-gray-800 font-semibold">{item.status === "in_stock" ? "Còn hàng" : item.status === "low_stock" ? "Sắp hết" : "Hết hàng"}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-24 shrink-0">Người nhập:</span>
                                        <span className="text-gray-700">Admin</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <span className="text-gray-500 w-24 shrink-0">Người tạo:</span>
                                        <span className="text-gray-700">Admin</span>
                                      </div>
                                    </div>
                                    <div>
                                      <textarea readOnly defaultValue="" placeholder="Ghi chú..."
                                        className="w-full h-20 border border-gray-200 rounded p-2 text-sm text-gray-500 bg-gray-50 resize-none outline-none"
                                      />
                                    </div>
                                  </div>

                                  {/* Item table */}
                                  <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
                                    <thead className="bg-gray-50 text-gray-600">
                                      <tr>
                                        <th className="py-2.5 px-4 text-left font-semibold border-b border-gray-200">Mã hàng hóa</th>
                                        <th className="py-2.5 px-4 text-left font-semibold border-b border-gray-200">Tên hàng</th>
                                        <th className="py-2.5 px-4 text-center font-semibold border-b border-gray-200 w-20">Số lượng</th>
                                        <th className="py-2.5 px-4 text-right font-semibold border-b border-gray-200 w-32">Đơn giá nhập</th>
                                        <th className="py-2.5 px-4 text-right font-semibold border-b border-gray-200 w-24">Giảm giá</th>
                                        <th className="py-2.5 px-4 text-right font-semibold border-b border-gray-200 w-32">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.history?.length > 0 ? item.history.filter(h => h.type === "import").map((h, i) => (
                                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                          <td className="py-2.5 px-4 text-gray-600">{item.id}{String(i + 1).padStart(3, "0")}</td>
                                          <td className="py-2.5 px-4 text-gray-800">{item.name}</td>
                                          <td className="py-2.5 px-4 text-center">{h.qty}</td>
                                          <td className="py-2.5 px-4 text-right">{formatPrice(50000)}</td>
                                          <td className="py-2.5 px-4 text-right">0</td>
                                          <td className="py-2.5 px-4 text-right font-semibold">{formatPrice(h.qty * 50000)}</td>
                                        </tr>
                                      )) : (
                                        <tr>
                                          <td colSpan="6" className="py-6 text-center text-gray-400 italic text-sm">Chưa có dữ liệu nhập kho.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>

                                  {/* Totals */}
                                  <div className="flex justify-end mt-4">
                                    <div className="text-sm space-y-1.5 min-w-[260px]">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Tổng số lượng:</span>
                                        <span className="font-semibold">{item.history?.filter(h => h.type === "import").reduce((s, h) => s + h.qty, 0) || 0}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Tổng tiền hàng:</span>
                                        <span className="font-semibold">{formatPrice((item.history?.filter(h => h.type === "import").reduce((s, h) => s + h.qty, 0) || 0) * 50000)} đ</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Giảm giá phiếu nhập:</span>
                                        <span className="font-semibold">{formatPrice(20000)} đ</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Tiền đã trả NCC:</span>
                                        <span className="font-bold text-gray-800">{formatPrice(20000)} đ</span>
                                      </div>
                                      <div className="flex justify-between border-t border-gray-200 pt-1.5">
                                        <span className="text-gray-500">Còn cần trả NCC:</span>
                                        <span className="font-bold text-gray-800">{formatPrice(80000)} đ</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
                                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-semibold hover:bg-gray-50 cursor-pointer transition">
                                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                      </svg>
                                      In
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-semibold cursor-pointer transition">
                                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                      Xuất file
                                    </button>
                                    <button
                                      onClick={() => setConfirmModal({ isOpen: true, actionType: "audit", skuId: item.id, title: "Hủy phiếu", message: `Bạn có chắc muốn hủy phiếu cho mã SKU: ${item.id}?` })}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold cursor-pointer transition"
                                    >
                                      Hủy phiếu
                                    </button>
                                  </div>
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
                {filteredInventory.length}
              </span>{" "}
              / {inventory.length} mã hàng
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
        type="primary"
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

export default Inventory;
