import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n || 0);

/* ─── Modal Thêm nhanh hàng hóa ─────────────────────────────────────────── */
const QuickAddModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ name: "", group: "", unit: "", price: 0 });
  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên hàng hóa!");
    onSave({
      id: "SKU" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      name: form.name,
      unit: form.unit,
      systemQty: 0,
    });
    setForm({ name: "", group: "", unit: "", price: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-green-500 px-5 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-base">Thêm nhanh hàng hóa</h3>
          <button onClick={onClose} className="text-white hover:text-green-100 text-xl leading-none cursor-pointer">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mã hàng hóa</label>
              <input readOnly value="Mã Tự động" className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên hàng hóa <span className="text-red-500">*</span></label>
              <input type="text" autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nhóm hàng</label>
              <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">-- Lựa chọn nhóm --</option>
                <option value="dien-tu">Điện tử</option>
                <option value="thoi-trang">Thời trang</option>
                <option value="do-uong">Đồ uống</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Đơn vị tính</label>
              <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Giá bán</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-right"
            />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-50 cursor-pointer transition">
            Bỏ qua
          </button>
          <button onClick={handleSave} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-sm cursor-pointer transition flex items-center justify-center gap-1.5">
            ✓ Lưu hàng hóa
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Component chính ────────────────────────────────────────────────────── */
const InventoryCheckCreate = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSystem = items.reduce((sum, i) => sum + i.systemQty, 0);
  const totalActual = items.reduce((sum, i) => sum + i.actualQty, 0);
  const totalDiff = totalActual - totalSystem;

  const handleAddItem = (item) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, { ...item, actualQty: item.systemQty }];
    });
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleAddItem({
        id: "SKU" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
        name: searchQuery,
        systemQty: Math.floor(Math.random() * 50) + 5,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f0f2f5] font-sans overflow-hidden">
      {/* Top bar */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate("/admin/inventory-check")} className="text-gray-500 hover:text-gray-800 text-sm font-medium cursor-pointer">
          &lt; Quay lại danh sách
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <h1 className="text-base font-bold text-gray-800">Tạo phiếu kiểm kho</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden p-4 lg:p-5 gap-4 w-full">

        {/* Left — item table */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-w-0">
          {/* Search */}
          <div className="p-3 border-b border-gray-100 flex gap-2 shrink-0">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Tìm hàng hóa cần kiểm (Gõ mã hoặc tên)..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} title="Thêm nhanh hàng hóa"
              className="w-9 h-9 flex items-center justify-center border border-blue-500 text-blue-600 rounded hover:bg-blue-50 cursor-pointer transition"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="sticky top-0 bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-10 text-center">STT</th>
                  <th className="py-2.5 px-4 font-semibold w-32">Mã hàng</th>
                  <th className="py-2.5 px-4 font-semibold">Tên hàng</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-28">Tồn hệ thống</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-28">Tồn thực tế</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-24">Chênh lệch</th>
                  <th className="py-2.5 px-2 w-8" />
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-400 font-medium text-sm">Chưa có hàng hóa nào được chọn để kiểm kê.</p>
                      </div>
                    </td>
                  </tr>
                ) : items.map((item, idx) => {
                  const diff = item.actualQty - item.systemQty;
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 text-center text-gray-400">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-medium text-blue-600">{item.id}</td>
                      <td className="py-2.5 px-4 text-gray-800">{item.name}</td>
                      <td className="py-2.5 px-4 text-center text-gray-600 font-medium">{item.systemQty}</td>
                      <td className="py-2.5 px-4">
                        <input type="number" min="0" value={item.actualQty}
                          onChange={(e) => setItems(items.map((i) => i.id === item.id ? { ...i, actualQty: parseInt(e.target.value) || 0 } : i))}
                          className="w-full text-center border border-gray-300 rounded py-1 focus:border-blue-500 outline-none text-sm font-bold"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-sm">
                        {diff === 0 ? <span className="text-gray-400">0</span>
                          : diff > 0 ? <span className="text-green-600">+{diff}</span>
                          : <span className="text-red-500">{diff}</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-red-400 hover:text-red-600 cursor-pointer">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — info panel */}
        <div className="w-72 shrink-0 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 flex-1 flex flex-col gap-0 overflow-y-auto hide-scrollbar">
            {/* Meta */}
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Admin
              </span>
              <span className="text-gray-400 text-xs">{new Date().toLocaleString("vi-VN")}</span>
            </div>

            <div className="space-y-0 text-sm divide-y divide-dashed divide-gray-200">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Mã kiểm kho</span>
                <span className="text-gray-400 italic text-xs">Mã phiếu tự động</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Trạng thái</span>
                <span className="font-semibold text-blue-600">Đang kiểm</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 bg-gray-50 rounded border border-gray-100 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng SL hệ thống</span>
                <span className="font-semibold text-gray-700">{totalSystem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng SL thực tế</span>
                <span className="font-semibold text-gray-700">{totalActual}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-700">Tổng chênh lệch</span>
                <span className={`font-bold ${totalDiff === 0 ? "text-gray-400" : totalDiff > 0 ? "text-green-600" : "text-red-500"}`}>
                  {totalDiff > 0 ? `+${totalDiff}` : totalDiff}
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="mt-3 relative">
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú..."
                className="w-full pl-8 pr-3 pt-2 pb-2 border border-gray-200 rounded text-sm outline-none focus:border-blue-400 resize-none h-20 bg-gray-50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 border-t border-gray-100 flex flex-col gap-2">
            <button className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition cursor-pointer text-sm">
              Cân bằng kho
            </button>
            <button className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded font-bold hover:bg-gray-50 transition cursor-pointer text-sm">
              Lưu tạm
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddItem}
      />
    </div>
  );
};

export default InventoryCheckCreate;
