import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n || 0);

/* ─── Modal Thêm nhanh hàng hóa ─────────────────────────────────────────── */
const QuickAddModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "", group: "", unit: "", price: 0,
  });
  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên hàng hóa!");
    onSave({
      id: "HH" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
      name: form.name,
      unit: form.unit,
      price: Number(form.price) || 0,
    });
    setForm({ name: "", group: "", unit: "", price: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 px-5 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-base">Thêm nhanh hàng hóa</h3>
          <button onClick={onClose} className="text-white hover:text-green-100 text-xl leading-none cursor-pointer">✕</button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mã hàng hóa</label>
              <input
                readOnly
                value="Mã Tự động"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Tên hàng hóa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nhóm hàng</label>
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
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
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Giá bán</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-right"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-50 cursor-pointer transition"
          >
            Bỏ qua
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-sm cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            ✓ Lưu hàng hóa
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Component chính ────────────────────────────────────────────────────── */
const InventoryImport = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalPayable = totalAmount - discount;
  const debt = totalPayable - paidAmount;

  const handleAddItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleAddItem({ id: "HH" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"), name: searchQuery, price: 0 });
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f0f2f5] font-sans overflow-hidden">
      {/* Top bar */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate("/admin/inventory")} className="text-gray-500 hover:text-gray-800 text-sm font-medium cursor-pointer">
          &lt; Quay lại danh sách
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <h1 className="text-base font-bold text-gray-800">Tạo phiếu nhập hàng</h1>
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Thêm hàng hóa vào phiếu nhập (Gõ mã hoặc tên)..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              title="Thêm nhanh hàng hóa"
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
                  <th className="py-2.5 px-4 font-semibold text-center w-24">Số lượng</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-36">Đơn giá nhập</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-32">Thành tiền</th>
                  <th className="py-2.5 px-2 w-8" />
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <p className="font-bold text-gray-700">Thêm sản phẩm từ file excel</p>
                        <p className="text-gray-400 text-xs">Xử lý dữ liệu (Tải về File mẫu: <span className="text-blue-500">Excel 2003</span>)</p>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded font-semibold flex items-center gap-2 text-sm cursor-pointer">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Chọn file dữ liệu
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-center text-gray-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-medium text-blue-600">{item.id}</td>
                    <td className="py-2.5 px-4 text-gray-800">{item.name}</td>
                    <td className="py-2.5 px-4">
                      <input type="number" min="1" value={item.qty}
                        onChange={(e) => setItems(items.map((i) => i.id === item.id ? { ...i, qty: parseInt(e.target.value) || 1 } : i))}
                        className="w-full text-center border border-gray-300 rounded py-1 focus:border-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input type="number" min="0" value={item.price}
                        onChange={(e) => setItems(items.map((i) => i.id === item.id ? { ...i, price: parseInt(e.target.value) || 0 } : i))}
                        className="w-full text-right border border-gray-300 rounded py-1 focus:border-blue-500 outline-none text-sm"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-gray-800">{fmt(item.qty * item.price)}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-red-400 hover:text-red-600 cursor-pointer">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — info panel */}
        <div className="w-72 shrink-0 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-0">
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

            {/* Supplier */}
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white mb-4"
            >
              <option value="">-- Chọn Nhà Cung Cấp --</option>
              <option value="ncc1">Công ty TNHH Thức uống ABC</option>
              <option value="ncc2">Nhà phân phối XYZ</option>
            </select>

            {/* Info rows */}
            <div className="space-y-0 text-sm divide-y divide-dashed divide-gray-200">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Mã phiếu nhập</span>
                <span className="text-gray-400 italic text-xs">Mã phiếu tự động</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Trạng thái</span>
                <span className="font-semibold text-gray-700">Phiếu tạm</span>
              </div>
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-gray-600 font-medium">Tổng tiền hàng
                  <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 rounded text-xs">{items.length}</span>
                </span>
                <span className="font-bold text-gray-800">{fmt(totalAmount)}</span>
              </div>
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-gray-500">Giảm giá</span>
                <input type="number" value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-20 text-right border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent text-sm font-medium"
                />
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-bold text-gray-800">Cần trả nhà cung cấp</span>
                <span className="font-bold text-blue-600">{fmt(totalPayable)}</span>
              </div>
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-gray-500">Tiền trả nhà cung cấp</span>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <input type="number" value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded px-1.5 py-1 focus:border-blue-500 outline-none text-right text-sm font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Tính vào công nợ</span>
                <span className="font-bold text-gray-800">{fmt(debt)}</span>
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
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <button className="flex-1 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition cursor-pointer text-sm flex items-center justify-center gap-1.5">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
              </svg>
              Lưu tạm
            </button>
            <button className="flex-1 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition cursor-pointer text-sm flex items-center justify-center gap-1.5">
              ✓ Hoàn thành
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

export default InventoryImport;
