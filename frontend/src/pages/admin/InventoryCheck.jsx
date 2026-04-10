import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

// ── DỮ LIỆU MẪU ─────────────────────────────────────────────────────────────
const mockInventoryChecks = [
  {
    id: "KK001",
    createdAt: "09/04/2026 08:30",
    totalDiff: +48,
    diffUp: 50,
    diffDown: 2,
    note: "Kiểm kho định kỳ đầu tháng 4",
    status: "balanced",
    items: [
      { sku: "SKU001", name: "iPhone 16 Pro Max - Titan Đen 256GB", systemQty: 100, actualQty: 150, diff: +50 },
      { sku: "SKU002", name: "Laptop ASUS ROG Strix G15",           systemQty: 7,   actualQty: 5,   diff: -2  },
    ],
  },
  {
    id: "KK002",
    createdAt: "05/04/2026 14:00",
    totalDiff: -3,
    diffUp: 0,
    diffDown: 3,
    note: "Kiểm tra sau báo cáo thất thoát kho Phụ kiện",
    status: "balanced",
    items: [
      { sku: "SKU003", name: "Bàn phím cơ AKKO - Hồng", systemQty: 3, actualQty: 0, diff: -3 },
    ],
  },
  {
    id: "KK003",
    createdAt: "01/04/2026 09:00",
    totalDiff: 0,
    diffUp: 0,
    diffDown: 0,
    note: "Kiểm kho cuối tháng 3 — không phát sinh chênh lệch",
    status: "cancelled",
    items: [],
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const renderStatus = (status) => {
  if (status === "balanced")
    return (
      <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap">
        Đã cân bằng kho
      </span>
    );
  return (
    <span className="bg-red-100 text-red-400 border border-red-200 px-3 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap">
      Đã hủy
    </span>
  );
};

const renderDiff = (val, prefix = true) => {
  if (val === 0) return <span className="text-gray-400 font-bold">0</span>;
  if (val > 0)
    return <span className="text-green-600 font-bold">{prefix ? "+" : ""}{val}</span>;
  return <span className="text-red-500 font-bold">{val}</span>;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const InventoryCheck = () => {
  const [checks, setChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo]   = useState("");
  // ────────────────────────────────────────────────────────

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, checkId: null, title: "", message: "",
  });

  useEffect(() => {
    setTimeout(() => { setChecks(mockInventoryChecks); setIsLoading(false); }, 400);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const toggleRow = (id) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleCancel = () => {
    const { checkId } = confirmModal;
    setChecks((prev) =>
      prev.map((c) => (c.id === checkId ? { ...c, status: "cancelled" } : c))
    );
    showToast("Đã hủy phiếu kiểm kho!", "success");
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // ── XÓA BỘ LỌC ──────────────────────────────────────────
  const hasActiveFilter =
    filterStatus !== "all" || filterDateFrom !== "" ||
    filterDateTo !== "" || searchTerm !== "";

  const clearAllFilters = () => {
    setFilterStatus("all"); setFilterDateFrom("");
    setFilterDateTo(""); setSearchTerm("");
  };

  // ── LỌC DỮ LIỆU ─────────────────────────────────────────
  const filteredChecks = checks.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;

    if (filterDateFrom || filterDateTo) {
      const [datePart] = c.createdAt.split(" ");
      const [dd, mm, yyyy] = datePart.split("/");
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      if (filterDateFrom && d < new Date(filterDateFrom)) return false;
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59);
        if (d > to) return false;
      }
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return c.id.toLowerCase().includes(s) || c.note.toLowerCase().includes(s);
    }
    return true;
  });

  const countByStatus = (val) =>
    val === "all" ? checks.length : checks.filter((c) => c.status === val).length;

  // ─────────────────────────────────────────────────────────────────────────────
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
              placeholder="Mã KK, ghi chú..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Trạng thái -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Trạng thái</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",      label: "Tất cả" },
                { value: "balanced", label: "Đã cân bằng kho" },
                { value: "cancelled",label: "Đã hủy" },
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

          {/* -- Ngày kiểm kho -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Ngày kiểm kho</h3>
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

          {/* -- Thống kê -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng phiếu</span>
                <span className="font-bold text-gray-800">{checks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã cân bằng</span>
                <span className="font-bold text-green-600">{countByStatus("balanced")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã hủy</span>
                <span className="font-bold text-red-500">{countByStatus("cancelled")}</span>
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
            <h2 className="text-xl font-bold text-gray-800">Lịch sử Kiểm kho</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm">
              + Tạo phiếu kiểm kho
            </button>
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Mã kiểm kho</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Thời gian</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Tổng chênh lệch</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Lệch tăng</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Lệch giảm</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Ghi chú</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center w-44">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredChecks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500 font-medium">
                      Không tìm thấy phiếu kiểm kho nào.
                    </td>
                  </tr>
                ) : (
                  filteredChecks.map((check) => {
                    const isExpanded = expandedRows.includes(check.id);
                    return (
                      <React.Fragment key={check.id}>
                        {/* Dòng chính */}
                        <tr
                          onClick={() => toggleRow(check.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200
                            ${isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50 bg-white"}
                            ${check.status === "cancelled" ? "opacity-60" : ""}`}
                        >
                          <td className="py-4 px-6 font-bold text-blue-600">{check.id}</td>
                          <td className="py-4 px-6 text-gray-700">{check.createdAt}</td>
                          <td className="py-4 px-6 text-center text-base">
                            {renderDiff(check.totalDiff)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-green-600 font-bold">+{check.diffUp}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-red-500 font-bold">-{check.diffDown}</span>
                          </td>
                          <td className="py-4 px-6 text-gray-600 max-w-xs">
                            <p className="truncate">{check.note || "—"}</p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {renderStatus(check.status)}
                          </td>
                        </tr>

                        {/* Dòng chi tiết */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="7" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">

                                {/* Chi tiết từng mặt hàng */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider">
                                    Chi tiết chênh lệch từng mặt hàng
                                  </h4>
                                  {check.items.length > 0 ? (
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                                          <th className="pb-2 text-left">Mã SKU</th>
                                          <th className="pb-2 text-left">Tên sản phẩm</th>
                                          <th className="pb-2 text-center">Tồn hệ thống</th>
                                          <th className="pb-2 text-center">Thực tế</th>
                                          <th className="pb-2 text-center">Chênh lệch</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {check.items.map((item, idx) => (
                                          <tr key={idx} className="border-b border-gray-50 last:border-0">
                                            <td className="py-2.5 font-bold text-gray-800">{item.sku}</td>
                                            <td className="py-2.5 text-gray-700">{item.name}</td>
                                            <td className="py-2.5 text-center text-gray-600">{item.systemQty}</td>
                                            <td className="py-2.5 text-center font-semibold text-gray-800">{item.actualQty}</td>
                                            <td className="py-2.5 text-center">{renderDiff(item.diff)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p className="text-gray-500 text-sm italic">Không có mặt hàng nào được ghi nhận.</p>
                                  )}
                                </div>

                                {/* Thao tác */}
                                <div className="w-full xl:w-52 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">
                                    Quản trị
                                  </h4>

                                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                    <p className="text-gray-500 text-xs mb-1">Ghi chú đầy đủ:</p>
                                    <p className="text-gray-800 font-medium leading-relaxed">{check.note || "—"}</p>
                                  </div>

                                  <button className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer">
                                    Xuất báo cáo
                                  </button>

                                  {check.status !== "cancelled" && (
                                    <button
                                      onClick={() => setConfirmModal({
                                        isOpen: true,
                                        checkId: check.id,
                                        title: "Hủy phiếu kiểm kho",
                                        message: `Bạn có chắc chắn muốn hủy phiếu kiểm kho ${check.id}? Hành động này không thể hoàn tác.`,
                                      })}
                                      className="w-full py-2.5 bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer mt-auto"
                                    >
                                      Hủy phiếu
                                    </button>
                                  )}
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
              Hiển thị <span className="font-semibold text-gray-800">{filteredChecks.length}</span> / {checks.length} phiếu kiểm kho
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
        type="danger"
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleCancel}
      />

      {toast.show && (
        <div className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default InventoryCheck;