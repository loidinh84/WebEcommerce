import React, { useRef, useState } from "react";

const API_BASE = "${BASE_URL}";

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
  setFormData,
  handleBasicChange,
  handleArrayChange,
  addRow,
  removeRow,
  handleSaveProduct,
  editingProduct,
  categories,
  suppliers,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const dropRef = useRef(null);
  const fileInput = useRef(null);
  const slotInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [pendingSlot, setPendingSlot] = useState(null);

  if (!isModalOpen) return null;

  // ── BUILD UNIFIED LIST ──
  const oldImages = (formData.hinh_anh || []).map((img, i) => ({
    type: "old",
    url_anh: img.url_anh,
    alt_text: img.alt_text || "",
    la_anh_chinh: i === 0,
    thu_tu: i + 1,
  }));
  const newImages = (uploadedFiles || []).map((file) => ({
    type: "new",
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  const allImages = [...oldImages, ...newImages];
  const totalSlots = Math.max(4, allImages.length + 1);

  // ── THÊM ẢNH ──
  const addFiles = (files, insertAtSlot = null) => {
    const validFiles = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    if (validFiles.length === 0) return;

    if (insertAtSlot !== null && insertAtSlot < allImages.length) {
      replaceImageAtSlot(insertAtSlot, validFiles[0]);
      if (validFiles.length > 1) {
        setUploadedFiles((prev) => [...prev, ...validFiles.slice(1)]);
      }
    } else {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const replaceImageAtSlot = (slotIndex, file) => {
    const oldCount = oldImages.length;
    if (slotIndex < oldCount) {
      const newOld = formData.hinh_anh.filter((_, i) => i !== slotIndex);
      setFormData((prev) => ({ ...prev, hinh_anh: newOld }));
      setUploadedFiles((prev) => [file, ...prev]);
    } else {
      const newIdx = slotIndex - oldCount;
      setUploadedFiles((prev) => {
        const arr = [...prev];
        arr[newIdx] = file;
        return arr;
      });
    }
  };

  // ── XÓA ẢNH ──
  const removeImage = (slotIndex) => {
    const oldCount = oldImages.length;
    if (slotIndex < oldCount) {
      const newOld = formData.hinh_anh.filter((_, i) => i !== slotIndex);
      setFormData((prev) => ({ ...prev, hinh_anh: newOld }));
    } else {
      const newIdx = slotIndex - oldCount;
      setUploadedFiles((prev) => prev.filter((_, i) => i !== newIdx));
    }
  };

  // ── SET ẢNH CHÍNH ─────────────────────────────────────────────────────────
  // Di chuyển ảnh tại slotIndex lên vị trí 0 (ảnh chính = index 0)
  const setAsMain = (slotIndex) => {
    if (slotIndex === 0) return;
    const combined = [...allImages];
    const [item] = combined.splice(slotIndex, 1);
    combined.unshift(item);

    // Tách lại thành oldImages & newImages theo thứ tự mới
    const newOld = combined
      .filter((i) => i.type === "old")
      .map((img, idx) => ({
        url_anh: img.url_anh,
        alt_text: img.alt_text,
        la_anh_chinh: idx === 0,
        thu_tu: idx + 1,
      }));
    const newFiles = combined
      .filter((i) => i.type === "new")
      .map((i) => i.file);

    setFormData((prev) => ({ ...prev, hinh_anh: newOld }));
    setUploadedFiles(newFiles);
  };

  // ── DI CHUYỂN ẢNH (← →) ──────────────────────────────────────────────────
  const moveImage = (slotIndex, direction) => {
    const target = slotIndex + direction;
    if (target < 0 || target >= allImages.length) return;

    const combined = [...allImages];
    [combined[slotIndex], combined[target]] = [
      combined[target],
      combined[slotIndex],
    ];

    const newOld = combined
      .filter((i) => i.type === "old")
      .map((img, idx) => ({
        url_anh: img.url_anh,
        alt_text: img.alt_text,
        la_anh_chinh: idx === 0,
        thu_tu: idx + 1,
      }));
    const newFiles = combined
      .filter((i) => i.type === "new")
      .map((i) => i.file);

    setFormData((prev) => ({ ...prev, hinh_anh: newOld }));
    setUploadedFiles(newFiles);
  };

  // ── DRAG & DROP ───────────────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── CLICK SLOT ────────────────────────────────────────────────────────────
  const handleSlotClick = (slotIndex) => {
    setPendingSlot(slotIndex);
    slotInputRef.current?.click();
  };

  const handleSlotFileChange = (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files, pendingSlot);
    }
    e.target.value = null;
    setPendingSlot(null);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* ── HEADER ── */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-800">
            {editingProduct
              ? `Cập nhật: ${editingProduct.name || editingProduct.ten_san_pham}`
              : "Thêm sản phẩm mới"}
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-red-500 text-3xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white px-6 pt-3 border-b border-gray-200 overflow-x-auto shrink-0">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer
                  ${activeTab === tab.id ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── NỘI DUNG ── */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            {/* ═══ TAB 1: THÔNG TIN CHUNG ═══ */}
            {activeTab === 1 && (
              <div className="space-y-5">
                <h4 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
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
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      name="danh_muc_id"
                      value={formData.danh_muc_id || ""}
                      onChange={handleBasicChange}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.ten_danh_muc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Nhà cung cấp
                    </label>
                    <select
                      name="nha_cung_cap_id"
                      value={formData.nha_cung_cap_id || ""}
                      onChange={handleBasicChange}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers?.map((sup) => (
                        <option key={sup.id} value={sup.id}>
                          {sup.ten_nha_cc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      Trạng thái kinh doanh
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
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      name="noi_bat"
                      id="noi_bat"
                      checked={formData.noi_bat}
                      onChange={handleBasicChange}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 cursor-pointer"
                    />
                    <label
                      htmlFor="noi_bat"
                      className="font-semibold text-gray-700 cursor-pointer"
                    >
                      Đánh dấu là sản phẩm nổi bật
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Mô tả ngắn
                    </label>
                    <textarea
                      name="mo_ta_ngan"
                      value={formData.mo_ta_ngan}
                      onChange={handleBasicChange}
                      rows="2"
                      className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Mô tả ngắn gọn..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Mô tả đầy đủ
                    </label>
                    <textarea
                      name="mo_ta_day_du"
                      value={formData.mo_ta_day_du}
                      onChange={handleBasicChange}
                      rows="5"
                      className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                      placeholder="Mô tả chi tiết..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TAB 2: THUỘC TÍNH ═══ */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">
                  Thông số kỹ thuật
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Nhóm giúp phân loại (VD: Màn hình, Hiệu năng, Kết nối).
                </p>
                {formData.thuoc_tinh.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      value={item.nhom}
                      onChange={(e) =>
                        handleArrayChange(
                          "thuoc_tinh",
                          index,
                          "nhom",
                          e.target.value,
                        )
                      }
                      type="text"
                      className="w-1/5 border px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Nhóm"
                    />
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
                      className="w-2/5 border px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Tên thông số"
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
                      className="flex-1 border px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Giá trị"
                    />
                    <button
                      onClick={() => removeRow("thuoc_tinh", index)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer shrink-0"
                    >
                      ✕
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
                  + Thêm thông số
                </button>
              </div>
            )}

            {/* ═══ TAB 3: BIẾN THỂ ═══ */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">
                  Các phiên bản & Mức giá
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-sm min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3 font-semibold text-gray-600">SKU</th>
                        <th className="p-3 font-semibold text-gray-600">
                          Màu sắc
                        </th>
                        <th className="p-3 font-semibold text-gray-600">
                          Mã màu
                        </th>
                        <th className="p-3 font-semibold text-gray-600">
                          Dung lượng
                        </th>
                        <th className="p-3 font-semibold text-gray-600">RAM</th>
                        <th className="p-3 font-semibold text-gray-600">
                          Giá gốc
                        </th>
                        <th className="p-3 font-semibold text-gray-600">
                          Giá bán
                        </th>
                        <th className="p-3 font-semibold text-gray-600 w-20 text-center">
                          Tồn kho
                        </th>
                        <th className="p-3 font-semibold text-gray-600">
                          Trạng thái
                        </th>
                        <th className="p-3 w-10 text-center">✕</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.bien_the.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="p-2">
                            <input
                              value={item.sku}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "sku",
                                  e.target.value,
                                )
                              }
                              type="text"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="SKU..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.mau_sac}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "mau_sac",
                                  e.target.value,
                                )
                              }
                              type="text"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="Màu..."
                            />
                          </td>
                          <td className="p-2 w-28">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={item.ma_mau_hex || "#ffffff"}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "bien_the",
                                    index,
                                    "ma_mau_hex",
                                    e.target.value,
                                  )
                                }
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                              />
                              <input
                                value={item.ma_mau_hex || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "bien_the",
                                    index,
                                    "ma_mau_hex",
                                    e.target.value,
                                  )
                                }
                                type="text"
                                className="w-20 border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono"
                                placeholder="#ffffff"
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <input
                              value={item.dung_luong}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "dung_luong",
                                  e.target.value,
                                )
                              }
                              type="text"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="256GB..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.ram}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "ram",
                                  e.target.value,
                                )
                              }
                              type="text"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="8GB..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.gia_goc}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "gia_goc",
                                  e.target.value,
                                )
                              }
                              type="number"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.gia_ban}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "gia_ban",
                                  e.target.value,
                                )
                              }
                              type="number"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              value={item.ton_kho}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "ton_kho",
                                  e.target.value,
                                )
                              }
                              type="number"
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={item.trang_thai || "active"}
                              onChange={(e) =>
                                handleArrayChange(
                                  "bien_the",
                                  index,
                                  "trang_thai",
                                  e.target.value,
                                )
                              }
                              className="w-full border px-2 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs bg-white cursor-pointer"
                            >
                              <option value="active">Hiện</option>
                              <option value="inactive">Ẩn</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => removeRow("bien_the", index)}
                              className="text-red-400 hover:text-red-600 font-bold cursor-pointer p-1"
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
                      sku: "",
                      mau_sac: "",
                      dung_luong: "",
                      ram: "",
                      gia_goc: 0,
                      gia_ban: 0,
                      ton_kho: 0,
                      ma_mau_hex: "",
                      trang_thai: "active",
                    })
                  }
                  className="mt-2 px-4 py-2 text-sm text-green-600 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition cursor-pointer"
                >
                  + Thêm biến thể mới
                </button>
              </div>
            )}

            {/* ═══ TAB 4: HÌNH ẢNH ═══ */}
            {activeTab === 4 && (
              <div className="space-y-5">
                <h4 className="text-base font-bold text-gray-800 border-b pb-2 mb-2">
                  Quản lý hình ảnh
                </h4>

                {/* Hidden file inputs */}
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = null;
                  }}
                />
                <input
                  ref={slotInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleSlotFileChange}
                />

                {/* ── Drop zone ── */}
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInput.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition select-none
                    ${dragOver ? "border-blue-500 bg-blue-100" : "border-blue-300 bg-blue-50/50 hover:bg-blue-50"}`}
                >
                  <div className="text-4xl mb-3 pointer-events-none">📸</div>
                  <p className="font-semibold text-blue-700 pointer-events-none">
                    {dragOver
                      ? "Thả ảnh vào đây..."
                      : "Click hoặc kéo thả hình ảnh vào đây"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 pointer-events-none">
                    Hỗ trợ JPG, PNG, WebP · Tối đa 5MB/ảnh · Có thể chọn nhiều
                    ảnh
                  </p>
                </div>

                {/* ── Thống kê ── */}
                {allImages.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Tổng:{" "}
                    <span className="font-bold text-gray-700">
                      {allImages.length}
                    </span>{" "}
                    ảnh
                    {oldImages.length > 0 && (
                      <>
                        {" "}
                        ·{" "}
                        <span className="text-blue-600 font-semibold">
                          {oldImages.length} ảnh cũ
                        </span>
                      </>
                    )}
                    {newImages.length > 0 && (
                      <>
                        {" "}
                        ·{" "}
                        <span className="text-green-600 font-semibold">
                          {newImages.length} ảnh mới
                        </span>
                      </>
                    )}
                  </p>
                )}

                {/* ── Grid slots ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: totalSlots }).map((_, slotIndex) => {
                    const img = allImages[slotIndex];
                    const hasImg = !!img;
                    const isMain = slotIndex === 0 && hasImg;
                    const isOld = hasImg && img.type === "old";
                    const isNew = hasImg && img.type === "new";
                    const isEmpty = !hasImg;

                    return (
                      <div
                        key={slotIndex}
                        className={`relative border-2 rounded-xl flex flex-col overflow-hidden transition
                          ${
                            isMain
                              ? "border-blue-500 shadow-md"
                              : isEmpty
                                ? "border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                                : "border-gray-200 bg-white"
                          }`}
                        onClick={
                          isEmpty ? () => handleSlotClick(slotIndex) : undefined
                        }
                      >
                        {/* Badge ảnh chính */}
                        {isMain && (
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-[9px] px-2 py-0.5 z-10 font-bold rounded-br-lg">
                            Ảnh chính
                          </span>
                        )}
                        {/* Badge ảnh mới */}
                        {isNew && (
                          <span className="absolute top-0 right-0 bg-green-500 text-white text-[9px] px-2 py-0.5 z-10 font-bold rounded-bl-lg">
                            Mới
                          </span>
                        )}

                        {/* Preview */}
                        {hasImg ? (
                          <div className="relative group">
                            <img
                              src={
                                isOld
                                  ? `${API_BASE}${img.url_anh}`
                                  : img.previewUrl
                              }
                              alt={isOld ? img.alt_text || "" : "preview"}
                              className="w-full h-28 object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://placehold.co/200x112?text=No+Image";
                              }}
                            />
                            {/* Overlay click để thay ảnh */}
                            <div
                              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              onClick={() => handleSlotClick(slotIndex)}
                              title="Click để thay ảnh"
                            >
                              <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">
                                Thay ảnh
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-28 flex flex-col items-center justify-center text-gray-400 select-none">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-xs font-medium">
                              Slot {slotIndex + 1}
                            </span>
                          </div>
                        )}

                        {/* Controls */}
                        {hasImg && (
                          <div className="px-1.5 py-1.5 flex flex-col gap-1.5 bg-white">
                            {/* Di chuyển */}
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => moveImage(slotIndex, -1)}
                                disabled={slotIndex === 0}
                                className="text-gray-400 hover:text-blue-600 px-1.5 py-0.5 rounded disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold cursor-pointer"
                                title="Di chuyển trái"
                              >
                                ←
                              </button>
                              <span className="text-[11px] font-semibold text-gray-500">
                                #{slotIndex + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => moveImage(slotIndex, 1)}
                                disabled={slotIndex >= allImages.length - 1}
                                className="text-gray-400 hover:text-blue-600 px-1.5 py-0.5 rounded disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold cursor-pointer"
                                title="Di chuyển phải"
                              >
                                →
                              </button>
                            </div>
                            {/* Set chính & Xóa */}
                            <div className="flex gap-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => setAsMain(slotIndex)}
                                  className="flex-1 bg-white border border-gray-300 text-[10px] py-1 rounded-lg hover:bg-gray-100 cursor-pointer font-semibold text-gray-700"
                                >
                                  Set chính
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(slotIndex)}
                                className="flex-1 bg-white border border-red-200 text-red-500 text-[10px] py-1 rounded-lg hover:bg-red-50 cursor-pointer font-semibold"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {allImages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm italic py-4">
                    Chưa có hình ảnh nào. Kéo thả hoặc click vào vùng trên để
                    thêm ảnh.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center shrink-0">
          <div>
            {activeTab > 1 && (
              <button
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium cursor-pointer"
              >
                ← Quay lại
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition shadow-sm cursor-pointer"
            >
              {editingProduct ? "Lưu thay đổi" : "Lưu sản phẩm"}
            </button>
            {activeTab < 4 && (
              <button
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm cursor-pointer"
              >
                Tiếp tục →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
