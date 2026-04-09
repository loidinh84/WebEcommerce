import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

// Dữ liệu mẫu Kho hàng (Quản lý theo SKU/Biến thể)
const mockInventory = [
  { 
    id: "SKU001", name: "iPhone 16 Pro Max - Titan Đen 256GB", category: "Điện thoại", 
    stock: 150, minStock: 20, status: "in_stock", lastUpdated: "09/04/2026 10:00",
    history: [
      { date: "09/04/2026 08:00", type: "import", qty: 50, note: "Nhập kho đợt 1 tháng 4" },
      { date: "08/04/2026 15:30", type: "export", qty: 2, note: "Xuất bán lẻ (DH001)" }
    ]
  },
  { 
    id: "SKU002", name: "Laptop ASUS ROG Strix G15 - Xám Eclipse", category: "Laptop", 
    stock: 5, minStock: 10, status: "low_stock", lastUpdated: "08/04/2026 15:30",
    history: [
      { date: "08/04/2026 10:15", type: "export", qty: 1, note: "Xuất bán lẻ (DH002)" },
      { date: "01/04/2026 09:00", type: "import", qty: 10, note: "Nhập kho đầu tháng" }
    ]
  },
  { 
    id: "SKU003", name: "Bàn phím cơ AKKO - Hồng", category: "Phụ kiện", 
    stock: 0, minStock: 5, status: "out_of_stock", lastUpdated: "05/04/2026 09:15",
    history: [
      { date: "05/04/2026 09:15", type: "export", qty: 1, note: "Xuất bán lẻ (DH003)" },
      { date: "20/03/2026 14:00", type: "export", qty: 3, note: "Xuất bán lẻ tổng hợp" }
    ]
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

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
      // Tương lai: const response = await axios.get("http://localhost:5000/api/khohang");
      setTimeout(() => {
        setInventory(mockInventory);
        setIsLoading(false);
      }, 400); 
    } catch (error) {
      console.error("Lỗi API Kho hàng:", error);
      setInventory(mockInventory); // Fallback an toàn
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const executeConfirmAction = async () => {
    try {
      const { skuId, actionType } = confirmModal;
      
      // Tương lai gọi API tương ứng với actionType (nhập kho, xuất kho, kiểm kho...)
      
      if (actionType === "request_import") {
        showToast(`Đã tạo phiếu yêu cầu nhập hàng cho mã ${skuId}!`, "success");
      } else if (actionType === "audit") {
        showToast(`Đã tạo phiếu kiểm kho cho mã ${skuId}!`, "success");
      }
      
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const renderStockStatus = (status, stock) => {
    if (status === 'in_stock') return <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase">Còn hàng</span>;
    if (status === 'low_stock') return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded text-xs font-bold uppercase">Sắp hết ({stock})</span>;
    return <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase">Hết hàng</span>;
  };

  // Lọc dữ liệu kho
  const filteredInventory = inventory.filter(item => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) || 
             item.id.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        
        {/* --- CỘT TRÁI: BỘ LỌC --- */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pr-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Tìm kiếm</h3>
            <input 
              type="text" 
              placeholder="Mã SKU, tên sản phẩm..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Trạng thái kho</h3>
            <div className="space-y-3 text-sm text-gray-700 font-medium">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "all"} onChange={() => setStatusFilter("all")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" /> Tất cả
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "in_stock"} onChange={() => setStatusFilter("in_stock")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" /> Còn hàng
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "low_stock"} onChange={() => setStatusFilter("low_stock")} className="w-4 h-4 text-orange-500 focus:ring-orange-500" /> Sắp hết hàng
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "out_of_stock"} onChange={() => setStatusFilter("out_of_stock")} className="w-4 h-4 text-red-600 focus:ring-red-500" /> Hết hàng
              </label>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: BẢNG DỮ LIỆU --- */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          
          {/* Header Bảng */}
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

          {/* KHUNG CHỨA BẢNG */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Mã SKU</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Tên sản phẩm / Phân loại</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Định mức tồn</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-right">Tồn thực tế</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Đang tải dữ liệu kho...</td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Không tìm thấy mã hàng nào.</td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const isExpanded = expandedRows.includes(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        {/* --- DÒNG CHÍNH --- */}
                        <tr 
                          onClick={() => toggleRow(item.id)}
                          className={`cursor-pointer transition-colors group border-b border-gray-200 ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"} ${item.status === 'out_of_stock' ? 'bg-red-50/30' : ''}`}
                        >
                          <td className="py-4 px-6 font-bold text-gray-900">{item.id}</td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Danh mục: {item.category}</p>
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-gray-500">{item.minStock}</td>
                          <td className={`py-4 px-6 text-right font-bold text-lg ${item.stock <= item.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                            {item.stock}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {renderStockStatus(item.status, item.stock)}
                          </td>
                        </tr>

                        {/* --- DÒNG CHI TIẾT (THẺ KHO) --- */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">
                                
                                {/* 1. Thẻ kho (Lịch sử Nhập/Xuất) */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider flex justify-between">
                                    <span>Lịch sử xuất/nhập (Thẻ kho)</span>
                                    <span className="text-blue-600 cursor-pointer hover:underline normal-case">Xem tất cả</span>
                                  </h4>
                                  <div className="space-y-3">
                                    {item.history?.length > 0 ? (
                                      item.history.map((hist, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                          <div>
                                            <p className="font-semibold text-gray-800">{hist.note}</p>
                                            <p className="text-xs text-gray-500 mt-1">{hist.date}</p>
                                          </div>
                                          <div className={`font-bold text-base ${hist.type === 'import' ? 'text-green-600' : 'text-orange-500'}`}>
                                            {hist.type === 'import' ? '+' : '-'}{hist.qty}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm italic">Chưa có phát sinh giao dịch kho.</p>
                                    )}
                                  </div>
                                </div>

                                {/* 2. Khối Thao tác Quản trị Kho */}
                                <div className="w-full xl:w-64 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">Điều chỉnh kho</h4>
                                  
                                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm mb-2">
                                    <p className="text-gray-500 mb-1 text-xs">Cập nhật cuối:</p>
                                    <p className="font-bold text-gray-800">{item.lastUpdated}</p>
                                  </div>

                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true, actionType: "request_import", skuId: item.id,
                                      title: "Yêu cầu nhập hàng", message: `Tạo phiếu yêu cầu phòng Thu mua nhập thêm hàng cho mã SKU: ${item.id}?`
                                    })}
                                    className="w-full py-2.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors"
                                  >
                                    Yêu cầu nhập hàng
                                  </button>

                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true, actionType: "audit", skuId: item.id,
                                      title: "Kiểm kho mã hàng", message: `Tạo phiếu kiểm kê kho đột xuất cho mã SKU: ${item.id}?`
                                    })}
                                    className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors"
                                  >
                                    Kiểm kê mã này
                                  </button>

                                  <button className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors mt-auto">
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

          {/* Footer phân trang */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-600 shrink-0">
            <span className="font-medium">
              Hiển thị 1 - {filteredInventory.length} của {filteredInventory.length} mã hàng
            </span>
            <div className="flex gap-1.5 items-center">
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&laquo;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&lt;</button>
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&gt;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&raquo;</button>
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
        <div className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all animate-fade-in-up ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Inventory;