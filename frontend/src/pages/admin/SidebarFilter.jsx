import React, { useState } from "react";
import { toast } from "react-toastify";

const SidebarFilter = ({ searchTerm, setSearchTerm }) => {
  // State quản lý việc mở Modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  // State lưu dữ liệu nhập tạm
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");

  const handleQuickSaveCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.warning("Vui lòng nhập tên danh mục!");
      return;
    }
    toast.success("Đã thêm danh mục mới: " + newCategoryName);
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
  };

  const handleQuickSaveSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim()) {
      toast.warning("Vui lòng nhập tên nhà cung cấp!");
      return;
    }
    toast.success("Đã thêm nhà cung cấp mới: " + newSupplierName);
    setIsAddSupplierOpen(false);
    setNewSupplierName("");
  };

  return (
    <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-4 pr-1 font-sans">
      
      {/* KHỐI 1: TÌM KIẾM */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* KHỐI 2: DANH MỤC */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="text-gray-400 hover:text-blue-600 text-2xl cursor-pointer font-medium leading-none transition-colors"
            title="Thêm danh mục"
          >
            +
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-500 font-medium">
          <p className="text-blue-600 font-bold cursor-pointer">Tất cả</p>
          <p className="hover:text-blue-600 cursor-pointer transition-colors">Điện thoại di động</p>
          <p className="hover:text-blue-600 cursor-pointer transition-colors">Laptop & Macbook</p>
          <p className="hover:text-blue-600 cursor-pointer transition-colors">Phụ kiện - Bàn phím</p>
        </div>
      </div>

      {/* KHỐI 3: NHÀ CUNG CẤP */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
         <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-sm">Nhà cung cấp</h3>
          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="text-gray-400 hover:text-blue-600 text-2xl cursor-pointer font-medium leading-none transition-colors"
            title="Thêm nhà cung cấp"
          >
            +
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-500 font-medium">
          <p className="text-blue-600 font-bold cursor-pointer mb-3">Tất cả</p>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Apple Vietnam
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> ASUS Global
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> GearVN
          </label>
        </div>
      </div>

      {/* KHỐI 4: TRẠNG THÁI HIỂN THỊ */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Trạng thái hiển thị</h3>
        <div className="space-y-3 text-sm text-gray-500 font-medium">
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Đang kinh doanh
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Ngừng kinh doanh
          </label>
        </div>
      </div>

      {/* KHỐI 5: TỒN KHO */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Tồn kho</h3>
        <div className="space-y-3 text-sm text-gray-500 font-medium">
           <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="radio" name="stock" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Tất cả
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="radio" name="stock" className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Còn hàng
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
            <input type="radio" name="stock" className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Hết hàng
          </label>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: THÊM DANH MỤC */}
      {/* ============================================================== */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Thêm Danh Mục</h3>
              <button 
                onClick={() => setIsAddCategoryOpen(false)} 
                className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                title="Đóng"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleQuickSaveCategory}>
              <div className="p-6">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tên danh mục</label>
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl font-semibold outline-none focus:border-blue-500 transition-colors" 
                  placeholder="VD: Smartwatch, Tablet..." 
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all cursor-pointer">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: THÊM NHÀ CUNG CẤP */}
      {/* ============================================================== */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Thêm Nhà Cung Cấp</h3>
              <button 
                onClick={() => setIsAddSupplierOpen(false)} 
                className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                title="Đóng"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleQuickSaveSupplier}>
              <div className="p-6">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tên nhà cung cấp</label>
                <input 
                  type="text" 
                  value={newSupplierName} 
                  onChange={(e) => setNewSupplierName(e.target.value)} 
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl font-semibold outline-none focus:border-blue-500 transition-colors" 
                  placeholder="VD: Sony Vietnam, FPT..." 
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all cursor-pointer">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SidebarFilter;