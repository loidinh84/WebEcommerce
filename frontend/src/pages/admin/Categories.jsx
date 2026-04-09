import React, { useEffect, useState } from "react";
import CategoryModal from "./CategoryModal";
import ConfirmModal from "./ConfirmModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mockCategories = [
  { id: 1, name: "Điện thoại di động", slug: "dien-thoai-di-dong", parent: null, order: 1, status: "active", desc: "Các dòng smartphone mới nhất" },
  { id: 2, name: "Laptop & Macbook", slug: "laptop-macbook", parent: null, order: 2, status: "active", desc: "Máy tính xách tay" },
  { id: 3, name: "Phụ kiện - Bàn phím", slug: "phu-kien-ban-phim", parent: null, order: 3, status: "active", desc: "Tai nghe, sạc, cáp..." },
  { id: 4, name: "iPhone", slug: "iphone", parent: "Điện thoại di động", order: 1, status: "active", desc: "Apple iPhone" },
  { id: 5, name: "ASUS ROG", slug: "asus-rog", parent: "Laptop & Macbook", order: 1, status: "active", desc: "Laptop Gaming ASUS" },
  { id: 6, name: "Samsung Galaxy", slug: "samsung-galaxy", parent: "Điện thoại di động", order: 2, status: "inactive", desc: "Dòng Samsung Android" },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [statusTab, setStatusTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // filterSelected: "all" | "root" | <tên DM cha> | <tên DM con>
  const [filterSelected, setFilterSelected] = useState("all");
  // expandedParents: set các tên DM cha đang mở rộng trong sidebar
  const [expandedParents, setExpandedParents] = useState(new Set());
  // ────────────────────────────────────────────────────────

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, id: null, title: "", message: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setCategories(mockCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (formData) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id } : c));
      toast.success("Cập nhật danh mục thành công!");
    } else {
      const newCat = { ...formData, id: Date.now() };
      setCategories([newCat, ...categories]);
      toast.success("Thêm danh mục mới thành công!");
    }
    setIsModalOpen(false);
  };

  const executeDelete = () => {
    setCategories(categories.filter(c => c.id !== confirmModal.id));
    toast.success("Đã xóa danh mục thành công!");
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // ── TÍNH TOÁN ────────────────────────────────────────────
  const rootCategories = categories.filter(c => !c.parent);

  // Toggle expand/collapse một danh mục cha trong sidebar
  const toggleExpand = (parentName) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentName)) next.delete(parentName);
      else next.add(parentName);
      return next;
    });
  };

  // Khi bấm vào tên DM cha: toggle expand VÀ set filter = cha đó (hiện tất cả con)
  const handleSelectParent = (parentName) => {
    toggleExpand(parentName);
    setFilterSelected(prev => prev === parentName ? "all" : parentName);
  };

  // Khi bấm vào DM con: filter = tên DM con đó
  const handleSelectChild = (childName) => {
    setFilterSelected(prev => prev === childName ? "all" : childName);
  };

  const filteredCategories = categories.filter(c => {
    // 1. Lọc theo tab trạng thái
    if (statusTab === "active" && c.status !== "active") return false;
    if (statusTab === "inactive" && c.status !== "inactive") return false;

    // 2. Lọc theo tree selection
    if (filterSelected === "root" && c.parent !== null) return false;
    if (filterSelected !== "all" && filterSelected !== "root") {
      // Kiểm tra xem filterSelected là tên DM cha hay DM con
      const isParentName = rootCategories.some(r => r.name === filterSelected);
      if (isParentName) {
        // Chọn DM cha → hiện cha đó + tất cả con của nó
        if (c.name !== filterSelected && c.parent !== filterSelected) return false;
      } else {
        // Chọn DM con → chỉ hiện đúng DM con đó
        if (c.name !== filterSelected) return false;
      }
    }

    // 3. Lọc theo từ khóa
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !c.slug.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    return true;
  });

  const countAll      = categories.length;
  const countActive   = categories.filter(c => c.status === "active").length;
  const countInactive = categories.filter(c => c.status === "inactive").length;
  // ────────────────────────────────────────────────────────

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">

        {/* ================================================ */}
        {/* SIDEBAR BỘ LỌC                                   */}
        {/* ================================================ */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-4 pr-1">

          {/* -- Tìm kiếm -- */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
            <input
              type="text"
              placeholder="Tên hoặc slug..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Cây danh mục (Accordion Tree) -- */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Danh mục</h3>
            <div className="space-y-0.5 text-sm">

              {/* Nút "Tất cả" */}
              <button
                onClick={() => setFilterSelected("all")}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                  ${filterSelected === "all" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span>Tất cả</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterSelected === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                  {countAll}
                </span>
              </button>

              {/* Nút "Danh mục gốc" */}
              <button
                onClick={() => setFilterSelected(prev => prev === "root" ? "all" : "root")}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                  ${filterSelected === "root" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span>📁 Danh mục gốc</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterSelected === "root" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                  {rootCategories.length}
                </span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-2" />

              {/* Accordion: từng danh mục cha + con */}
              {rootCategories.map(parent => {
                const children = categories.filter(c => c.parent === parent.name);
                const isExpanded = expandedParents.has(parent.name);
                const isParentSelected = filterSelected === parent.name;

                return (
                  <div key={parent.id}>
                    {/* Row DM cha */}
                    <button
                      onClick={() => handleSelectParent(parent.name)}
                      className={`w-full flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium group
                        ${isParentSelected ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {/* Mũi tên expand */}
                      <span className={`text-[10px] transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-90" : ""} ${isParentSelected ? "text-blue-500" : "text-gray-400"}`}>
                        ▶
                      </span>
                      <span className="flex-1 truncate text-[13px]">{parent.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${isParentSelected ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                        {children.length}
                      </span>
                    </button>

                    {/* Danh sách con — chỉ hiện khi expanded */}
                    {isExpanded && children.length > 0 && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-blue-100 pl-2">
                        {children.map(child => {
                          const isChildSelected = filterSelected === child.name;
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleSelectChild(child.name)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left cursor-pointer text-[12px]
                                ${isChildSelected ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500 hover:bg-gray-50 font-medium"}`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChildSelected ? "bg-blue-500" : "bg-gray-300"}`} />
                                <span className="truncate">{child.name}</span>
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
                                child.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                              }`}>
                                {child.status === "active" ? "Hiện" : "Ẩn"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Nếu expanded nhưng không có con */}
                    {isExpanded && children.length === 0 && (
                      <div className="ml-6 mt-0.5 px-2 py-1.5 text-[11px] text-gray-400 italic">
                        Chưa có danh mục con
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* -- Thống kê nhanh -- */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tổng danh mục</span>
                <span className="font-bold text-gray-800">{countAll}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Đang hiển thị</span>
                <span className="font-bold text-green-600">{countActive}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Đã ẩn</span>
                <span className="font-bold text-red-500">{countInactive}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Danh mục gốc</span>
                <span className="font-bold text-blue-600">{rootCategories.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* BẢNG DỮ LIỆU                                     */}
        {/* ================================================ */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">

          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Danh mục sản phẩm</h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#4caf50] hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm cursor-pointer"
            >
              + Thêm danh mục
            </button>
          </div>

          {/* Tab lọc trạng thái — đây là nơi DUY NHẤT lọc status */}
          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0">
            {[
              { key: "all",      label: `Tất cả`,          count: countAll },
              { key: "active",   label: `Đang hoạt động`,  count: countActive },
              { key: "inactive", label: `Đã ẩn`,           count: countInactive },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusTab(tab.key)}
                className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  statusTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 w-12 text-center">STT</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Tên danh mục</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Danh mục cha</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Mô tả</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center w-20">Thứ tự</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center w-28">Trạng thái</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-right w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr><td colSpan="7" className="py-10 text-center font-medium text-gray-500">Đang tải dữ liệu...</td></tr>
                ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan="7" className="py-10 text-center font-medium text-red-500">Không tìm thấy danh mục nào.</td></tr>
                ) : (
                  filteredCategories.map((cat, index) => (
                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors bg-white">
                      <td className="py-4 px-6 text-center font-medium text-gray-400">{index + 1}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{cat.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                      </td>
                      <td className="py-4 px-6">
                        {cat.parent
                          ? <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[11px] font-bold">{cat.parent}</span>
                          : <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-[11px] font-semibold">Gốc</span>
                        }
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs max-w-[200px] truncate" title={cat.desc}>
                        {cat.desc || <span className="italic text-gray-300">Chưa có mô tả</span>}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-blue-600">{cat.order}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          cat.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {cat.status === "active" ? "Hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button onClick={() => handleOpenModal(cat)} className="text-blue-600 font-bold hover:underline cursor-pointer text-sm">Sửa</button>
                        <button
                          onClick={() => setConfirmModal({
                            isOpen: true, id: cat.id,
                            title: "CẢNH BÁO XÓA",
                            message: `Bạn có chắc chắn muốn xóa danh mục "${cat.name}" không?`,
                          })}
                          className="text-red-500 font-bold hover:underline cursor-pointer text-sm"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500 shrink-0">
            <span>
              Hiển thị <span className="font-semibold text-gray-700">{filteredCategories.length}</span> / {countAll} danh mục
            </span>
            {(searchTerm || filterSelected !== "all" || statusTab !== "all") && (
              <button
                onClick={() => { setSearchTerm(""); setFilterSelected("all"); setStatusTab("all"); setExpandedParents(new Set()); }}
                className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer text-xs"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={editingCategory}
        allCategories={categories}
        onSave={handleSaveCategory}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeDelete}
      />
    </div>
  );
};

export default Categories;