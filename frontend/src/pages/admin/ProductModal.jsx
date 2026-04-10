import React from "react";
import * as Icons from "../../assets/icons/index";

const tabs = [
  { id: 1, name: "1. Thông tin chung" },
  { id: 2, name: "2. Thuộc tính" },
  { id: 3, name: "3. Biến thể" },
  { id: 4, name: "4. Hình ảnh" },
];

const ProductModal = ({
  isModalOpen,
  setIsModalOpen,
  activeTab,
  setActiveTab,
  formData,
  setFormData, // Cần thêm để update thứ tự ảnh cũ
  handleBasicChange,
  handleArrayChange,
  addRow,
  removeRow,
  handleSaveProduct,
  editingProduct,
  categories, 
  suppliers,  
  // Props để xử lý file vật lý
  uploadedFiles,
  setUploadedFiles 
}) => {

  if (!isModalOpen) return null;

  // ─── LOGIC ĐIỀU HƯỚNG ẢNH CŨ (TRONG DB) ──────────────────────
  const moveOldImage = (index, direction) => {
    if (index + direction < 0 || index + direction >= formData.hinh_anh.length) return;
    const newArr = [...formData.hinh_anh];
    const temp = newArr[index];
    newArr[index] = newArr[index + direction];
    newArr[index + direction] = temp;
    
    // Cập nhật la_anh_chinh: Ảnh ở vị trí 0 luôn là ảnh chính
    newArr.forEach((img, i) => img.la_anh_chinh = (i === 0));
    setFormData(prev => ({ ...prev, hinh_anh: newArr }));
  };

  const setOldImageMain = (index) => {
    if (index === 0) return;
    const newArr = [...formData.hinh_anh];
    const [item] = newArr.splice(index, 1);
    newArr.unshift(item); // Đưa lên đầu
    newArr.forEach((img, i) => img.la_anh_chinh = (i === 0));
    setFormData(prev => ({ ...prev, hinh_anh: newArr }));
  };

  // ─── LOGIC ĐIỀU HƯỚNG ẢNH MỚI (VỪA UPLOAD) ───────────────────
  const moveNewImage = (index, direction) => {
    if (index + direction < 0 || index + direction >= uploadedFiles.length) return;
    const newArr = [...uploadedFiles];
    const temp = newArr[index];
    newArr[index] = newArr[index + direction];
    newArr[index + direction] = temp;
    setUploadedFiles(newArr);
  };

  const setNewImageMain = (index) => {
    if (index === 0) return;
    const newArr = [...uploadedFiles];
    const [item] = newArr.splice(index, 1);
    newArr.unshift(item);
    setUploadedFiles(newArr);
  };

  const hasOldImages = formData.hinh_anh && formData.hinh_anh.length > 0;
  const oldImagesCount = formData.hinh_anh?.length || 0;
  const newImagesCount = uploadedFiles?.length || 0;
  const totalImagesCount = oldImagesCount + newImagesCount;
  const totalSlots = Math.max(3, totalImagesCount);

  const renderImages = [];
  for (let i = 0; i < totalSlots; i++) {
      if (i < oldImagesCount) {
          renderImages.push({ type: 'old', data: formData.hinh_anh[i], originalIndex: i });
      } else if (i < totalImagesCount) {
          const newIndex = i - oldImagesCount;
          renderImages.push({ type: 'new', data: uploadedFiles[newIndex], originalIndex: newIndex });
      } else {
          renderImages.push({ type: 'empty' });
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header Modal */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-800">
            {editingProduct
              ? `Cập nhật ${editingProduct.ten_san_pham}`
              : "Thêm sản phẩm mới"}
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-6 pt-3 border-b border-gray-200 overflow-x-auto shrink-0">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            {/* TAB 1: THÔNG TIN CHUNG */}
            {activeTab === 1 && (
              <div className="space-y-5">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      name="ten_san_pham"
                      value={formData.ten_san_pham}
                      onChange={handleBasicChange}
                      type="text"
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: iPhone 16 Pro Max"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Thương hiệu
                    </label>
                    <input
                      name="thuong_hieu"
                      value={formData.thuong_hieu}
                      onChange={handleBasicChange}
                      type="text"
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: Apple"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      name="danh_muc_id"
                      value={formData.danh_muc_id || ""}
                      onChange={handleBasicChange}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Nhà cung cấp
                    </label>
                    <select
                      name="nha_cung_cap_id"
                      value={formData.nha_cung_cap_id || ""}
                      onChange={handleBasicChange}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="">-- Chọn nhà cung cấp --</option>
                      {suppliers?.map((sup) => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="trang_thai"
                      value={formData.trang_thai}
                      onChange={handleBasicChange}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="active">Đang kinh doanh</option>
                      <option value="inactive">Ngừng kinh doanh</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      name="mo_ta_ngan"
                      value={formData.mo_ta_ngan}
                      onChange={handleBasicChange}
                      rows="2"
                      className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Mô tả"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THUỘC TÍNH */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                  Thông số kỹ thuật
                </h4>
                {formData.thuoc_tinh.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      value={item.ten_thuoc_tinh}
                      onChange={(e) =>
                        handleArrayChange(
                          "thuoc_tinh",
                          index,
                          "ten_thuoc_tinh",
                          e.target.value,
                        )
                      }
                      type="text"
                      className="w-1/3 border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Tên (VD: Màn hình)"
                    />
                    <input
                      value={item.gia_tri}
                      onChange={(e) =>
                        handleArrayChange(
                          "thuoc_tinh",
                          index,
                          "gia_tri",
                          e.target.value,
                        )
                      }
                      type="text"
                      className="w-2/3 border px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Giá trị (VD: 6.9 inch OLED)"
                    />
                    <button
                      onClick={() => removeRow("thuoc_tinh", index)}
                      className="text-red-500 hover:bg-red-50 p-2.5 rounded-lg text-lg transition cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    addRow("thuoc_tinh", {
                      ten_thuoc_tinh: "",
                      gia_tri: "",
                      nhom: "",
                      thu_tu: formData.thuoc_tinh.length + 1,
                    })
                  }
                  className="mt-2 px-4 py-2 text-sm text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  + Thêm dòng thông số
                </button>
              </div>
            )}

            {/* TAB 3: BIẾN THỂ */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                  Các phiên bản & Mức giá
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3">Mã SKU</th>
                        <th className="p-3">Màu sắc</th>
                        <th className="p-3">Dung lượng</th>
                        <th className="p-3">RAM</th>
                        <th className="p-3">Giá gốc</th>
                        <th className="p-3">Giá bán</th>
                        <th className="p-3 w-20">Tồn kho</th>
                        <th className="p-3 w-12 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.bien_the.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-2">
                            <input
                              value={item.sku}
                              onChange={(e) => handleArrayChange("bien_the", index, "sku", e.target.value)}
                              type="text" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="SKU..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.mau_sac}
                              onChange={(e) => handleArrayChange("bien_the", index, "mau_sac", e.target.value)}
                              type="text" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Màu..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.dung_luong}
                              onChange={(e) => handleArrayChange("bien_the", index, "dung_luong", e.target.value)}
                              type="text" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Bộ nhớ..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.ram}
                              onChange={(e) => handleArrayChange("bien_the", index, "ram", e.target.value)}
                              type="text" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="RAM..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.gia_goc}
                              onChange={(e) => handleArrayChange("bien_the", index, "gia_goc", e.target.value)}
                              type="number" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.gia_ban}
                              onChange={(e) => handleArrayChange("bien_the", index, "gia_ban", e.target.value)}
                              type="number" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.ton_kho}
                              onChange={(e) => handleArrayChange("bien_the", index, "ton_kho", e.target.value)}
                              type="number" className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="0"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => removeRow("bien_the", index)}
                              className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() =>
                    addRow("bien_the", {
                      sku: "", mau_sac: "", dung_luong: "", ram: "", gia_goc: 0, gia_ban: 0, ton_kho: 0,
                    })
                  }
                  className="mt-2 px-4 py-2 text-sm text-green-600 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition cursor-pointer"
                >
                  + Thêm biến thể mới
                </button>
              </div>
            )}

            {/* TAB 4: HÌNH ẢNH (BẢO TOÀN UI GỐC 100%) */}
            {activeTab === 4 && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                  Quản lý Hình ảnh
                </h4>

                <label className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                  <input 
                    type="file" multiple accept="image/jpeg, image/png, image/webp" className="hidden" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) setUploadedFiles(prev => [...prev, ...files]);
                      e.target.value = null; 
                    }}
                  />
                  <div className="text-4xl mb-3">📸</div>
                  <p className="font-semibold text-blue-700">Click hoặc kéo thả hình ảnh vào đây để tải lên</p>
                  <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG. Tối đa 5MB/ảnh.</p>
                </label>

                {/* Khung hiển thị ảnh (luôn có tối thiểu 3 slot như bản gốc của Bro) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {renderImages.map((slot, index) => {
                     const isMain = index === 0;
                     return (
                        <div key={index} className={`relative border rounded-lg p-2 flex flex-col items-center gap-2 ${isMain ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                           {isMain && <span className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-br-lg rounded-tl-lg z-10 font-bold">Ảnh chính</span>}

                           {/* 1. Hiển thị Ảnh hoặc Placeholder */}
                           {slot.type === 'old' && <img src={`http://localhost:5000${slot.data.url_anh}`} alt="old" className="w-full h-24 object-cover rounded border border-gray-200 bg-white" />}
                           {slot.type === 'new' && <img src={URL.createObjectURL(slot.data)} alt="new" className="w-full h-24 object-cover rounded border border-gray-200 bg-white" />}
                           {slot.type === 'empty' && (
                             <div className="w-full h-24 bg-gray-200 rounded object-cover flex items-center justify-center text-gray-400 text-xs font-medium">
                               [Preview Ảnh {index + 1}]
                             </div>
                           )}

                           {/* 2. Nút điều hướng ← → (Giữ nguyên cấu trúc HTML của Bro) */}
                           <div className="flex w-full justify-between items-center px-1">
                              <button
                                type="button"
                                onClick={() => slot.type === 'old' ? moveOldImage(slot.originalIndex, -1) : moveNewImage(slot.originalIndex, -1)}
                                disabled={slot.type === 'empty' || slot.originalIndex === 0}
                                className="text-gray-400 hover:text-blue-600 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >←</button>
                              <span className="text-xs font-semibold text-gray-600">Thứ tự: {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => slot.type === 'old' ? moveOldImage(slot.originalIndex, 1) : moveNewImage(slot.originalIndex, 1)}
                                disabled={slot.type === 'empty' || (slot.type === 'old' && slot.originalIndex === formData.hinh_anh.length - 1) || (slot.type === 'new' && slot.originalIndex === uploadedFiles.length - 1)}
                                className="text-gray-400 hover:text-blue-600 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              >→</button>
                           </div>

                           {/* 3. Nút thao tác Set Chính / Xóa (Giữ nguyên cấu trúc HTML của Bro) */}
                           <div className="flex w-full gap-2 mt-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  disabled={slot.type === 'empty'}
                                  onClick={() => slot.type === 'old' ? setOldImageMain(slot.originalIndex) : setNewImageMain(slot.originalIndex)}
                                  className="flex-1 bg-white border border-gray-300 text-[11px] py-1 rounded hover:bg-gray-100 cursor-pointer font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                                >Set Chính</button>
                              )}
                              <button
                                type="button"
                                disabled={slot.type === 'empty'}
                                onClick={() => slot.type === 'old' ? removeRow("hinh_anh", slot.originalIndex) : setUploadedFiles(prev => prev.filter((_, i) => i !== slot.originalIndex))}
                                className="flex-1 bg-white border border-red-200 text-red-500 text-[11px] py-1 rounded hover:bg-red-50 cursor-pointer font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                              >Xóa</button>
                           </div>
                        </div>
                     );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal - NÚT LƯU LUÔN HIỂN THỊ Ở MỌI TAB */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center shrink-0">
          <div>
            {activeTab > 1 && (
              <button
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded transition font-medium cursor-pointer"
              >
                &larr; Quay lại
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition font-medium cursor-pointer"
            >
              Hủy bỏ
            </button>
            
            {/* Nút LƯU luôn xuất hiện bên cạnh */}
            <button
              onClick={handleSaveProduct}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold transition shadow-sm cursor-pointer"
            >
              {editingProduct ? "Lưu thay đổi" : "Lưu"}
            </button>

            {/* Nút TIẾP TỤC chỉ hiện nếu chưa ở Tab cuối */}
            {activeTab < 4 && (
              <button
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium shadow-sm cursor-pointer"
              >
                Tiếp tục &rarr;
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;