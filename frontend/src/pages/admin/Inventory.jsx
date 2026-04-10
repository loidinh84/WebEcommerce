import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

const mockInventory = [
  {
    id: "SKU001", name: "iPhone 16 Pro Max - Titan Đen 256GB", category: "Điện thoại",
    stock: 150, minStock: 20, status: "in_stock", lastUpdated: "09/04/2026 10:00",
    history: [
      { date: "09/04/2026 08:00", type: "import", qty: 50, note: "Nhập kho đợt 1 tháng 4" },
      { date: "08/04/2026 15:30", type: "export", qty: 2, note: "Xuất bán lẻ (DH001)" },
    ],
  },
  {
    id: "SKU002", name: "Laptop ASUS ROG Strix G15 - Xám Eclipse", category: "Laptop",
    stock: 5, minStock: 10, status: "low_stock", lastUpdated: "08/04/2026 15:30",
    history: [
      { date: "08/04/2026 10:15", type: "export", qty: 1, note: "Xuất bán lẻ (DH002)" },
      { date: "01/04/2026 09:00", type: "import", qty: 10, note: "Nhập kho đầu tháng" },
    ],
  },
  {
    id: "SKU003", name: "Bàn phím cơ AKKO - Hồng", category: "Phụ kiện",
    stock: 0, minStock: 5, status: "out_of_stock", lastUpdated: "05/04/2026 09:15",
    history: [
      { date: "05/04/2026 09:15", type: "export", qty: 1, note: "Xuất bán lẻ (DH003)" },
      { date: "20/03/2026 14:00", type: "export", qty: 3, note: "Xuất bán lẻ tổng hợp" },
    ],
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm]         = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMinStock, setFilterMinStock] = useState("all"); // "all" | "below" | "above"
  const [filterDateFrom, setFilterDateFrom] = useState("");    // yyyy-mm-dd
  const [filterDateTo, setFilterDateTo]     = useState("");    // yyyy-mm-dd
  // ────────────────────────────────────────────────────────

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, actionType: null, skuId: null, title: "", message: "",
  });

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      // const response = await axios.get("http://localhost:5000/api/khohang");
      setTimeout(() => { setInventory(mockInventory); setIsLoading(false); }, 400);
    } catch (error) {
      setInventory(mockInventory);
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
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
      return <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">Còn hàng</span>;
    if (status === "low_stock")
      return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">Sắp hết ({stock})</span>;
    return <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">Hết hàng</span>;
  };

  // ── XÓA TẤT CẢ BỘ LỌC ──────────────────────────────────
  const hasActiveFilter =
    statusFilter !== "all" || filterCategory !== "all" ||
    filterMinStock !== "all" || filterDateFrom !== "" ||
    filterDateTo !== "" || searchTerm !== "";

  const clearAllFilters = () => {
    setStatusFilter("all"); setFilterCategory("all");
    setFilterMinStock("all"); setFilterDateFrom("");
    setFilterDateTo(""); setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── LỌC DỮ LIỆU ─────────────────────────────────────────
  const filteredInventory = inventory.filter((item) => {
    // 1. Trạng thái kho
    if (statusFilter !== "all" && item.status !== statusFilter) return false;

    // 2. Danh mục
    if (filterCategory !== "all" && item.category !== filterCategory) return false;

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
      return item.name.toLowerCase().includes(s) || item.id.toLowerCase().includes(s);
    }
    return true;
  });

  // Helper đếm theo danh mục / định mức
  const countByCategory = (cat) =>
    cat === "all" ? inventory.length : inventory.filter((i) => i.category === cat).length;

  const countByMinStock = (val) => {
    if (val === "all") return inventory.length;
    if (val === "below") return inventory.filter((i) => i.stock < i.minStock).length;
    return inventory.filter((i) => i.stock >= i.minStock).length;
  };

  const countByStatus = (val) =>
    val === "all" ? inventory.length : inventory.filter((i) => i.status === val).length;
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Tìm kiếm</h3>
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Trạng thái kho</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",          label: "Tất cả" },
                { value: "in_stock",     label: "Còn hàng" },
                { value: "low_stock",    label: "Sắp hết hàng" },
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Danh mục</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",        label: "Tất cả" },
                { value: "Điện thoại", label: "Điện thoại" },
                { value: "Laptop",     label: "Laptop & Macbook" },
                { value: "Phụ kiện",   label: "Phụ kiện - Bàn phím" },
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Định mức tồn kho</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",   label: "Tất cả" },
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
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Ngày cập nhật</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Từ ngày</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Đến ngày</label>
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
                  onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); }}
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
            <h2 className="text-xl font-bold text-gray-800">Quản lý Kho hàng</h2>
            <div className="flex gap-3">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm">
                Kiểm kho
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm">
                Nhập hàng
              </button>
            </div>
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Mã SKU</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Tên sản phẩm / Phân loại</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Định mức tồn</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-right">Tồn thực tế</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center w-36">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu kho...
                      </div>
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">
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
                          <td className="py-4 px-6 font-bold text-gray-900">{item.id}</td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Danh mục: {item.category}</p>
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-gray-500">{item.minStock}</td>
                          <td className={`py-4 px-6 text-right font-bold text-lg ${item.stock <= item.minStock ? "text-red-600" : "text-gray-800"}`}>
                            {item.stock}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {renderStockStatus(item.status, item.stock)}
                          </td>
                        </tr>

                        {/* Dòng chi tiết */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">

                                {/* Thẻ kho */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider flex justify-between">
                                    <span>Lịch sử xuất/nhập (Thẻ kho)</span>
                                    <span className="text-blue-600 cursor-pointer hover:underline normal-case font-normal">Xem tất cả</span>
                                  </h4>
                                  <div className="space-y-3">
                                    {item.history?.length > 0 ? (
                                      item.history.map((hist, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                          <div>
                                            <p className="font-semibold text-gray-800">{hist.note}</p>
                                            <p className="text-xs text-gray-500 mt-1">{hist.date}</p>
                                          </div>
                                          <div className={`font-bold text-base ${hist.type === "import" ? "text-green-600" : "text-orange-500"}`}>
                                            {hist.type === "import" ? "+" : "-"}{hist.qty}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm italic">Chưa có phát sinh giao dịch kho.</p>
                                    )}
                                  </div>
                                </div>

                                {/* Điều chỉnh kho */}
                                <div className="w-full xl:w-64 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">Điều chỉnh kho</h4>

                                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm mb-2">
                                    <p className="text-gray-500 mb-1 text-xs">Cập nhật cuối:</p>
                                    <p className="font-bold text-gray-800">{item.lastUpdated}</p>
                                  </div>

                                  <button
                                    onClick={() => setConfirmModal({
                                      isOpen: true, actionType: "request_import", skuId: item.id,
                                      title: "Yêu cầu nhập hàng",
                                      message: `Tạo phiếu yêu cầu phòng Thu mua nhập thêm hàng cho mã SKU: ${item.id}?`,
                                    })}
                                    className="w-full py-2.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                                  >
                                    Yêu cầu nhập hàng
                                  </button>

                                  <button
                                    onClick={() => setConfirmModal({
                                      isOpen: true, actionType: "audit", skuId: item.id,
                                      title: "Kiểm kho mã hàng",
                                      message: `Tạo phiếu kiểm kê kho đột xuất cho mã SKU: ${item.id}?`,
                                    })}
                                    className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
                                  >
                                    Kiểm kê mã này
                                  </button>

                                  <button className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors mt-auto cursor-pointer">
                                    Cập nhật định mức
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
              Hiển thị <span className="font-semibold text-gray-800">{filteredInventory.length}</span> / {inventory.length} mã hàng
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
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">&laquo;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">&lt;</button>
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">&gt;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">&raquo;</button>
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
        <div className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Inventory;