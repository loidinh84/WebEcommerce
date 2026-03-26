import React, { useState } from 'react';

// Dữ liệu mẫu 
const mockProducts = [
  { id: "SP001", name: "iPhone 16 Pro Max", brand: "Apple", supplier: "Apple Vietnam", category: "Điện thoại", colors: "Titan Đen, Titan Trắng", price: 34990000, cost: 28000000, stock: 150, status: "active" },
  { id: "SP002", name: "Laptop ASUS ROG Strix G15", brand: "ASUS", supplier: "ASUS Global", category: "Laptop", colors: "Xám Eclipse", price: 25990000, cost: 21000000, stock: 12, status: "active" },
  { id: "SP003", name: "Bàn phím cơ AKKO", brand: "AKKO", supplier: "GearVN", category: "Phụ kiện", colors: "Hồng, Xanh", price: 1500000, cost: 900000, stock: 0, status: "out_of_stock" },
];

const Product = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  // --- STATE QUẢN LÝ DỮ LIỆU FORM ---
  const [formData, setFormData] = useState({
    ten_san_pham: '', thuong_hieu: '', danh_muc_id: '', nha_cung_cap_id: '', trang_thai: 'active', ton_kho: 0, mo_ta_ngan: '', mo_ta_day_du: '', noi_bat: false,
    thuoc_tinh: [{ ten_thuoc_tinh: '', gia_tri: '', nhom: '', thu_tu: 1 }],
    bien_the: [{ sku: '', mau_sac: '', dung_luong: '', gia_goc: 0, gia_ban: 0, ton_kho: 0 }],
    hinh_anh: [{ url_anh: '', alt_text: '', la_anh_chinh: true }]
  });

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };
  const addRow = (arrayName, emptyObject) => setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], emptyObject] }));
  const removeRow = (arrayName, index) => setFormData(prev => ({ ...prev, [arrayName]: formData[arrayName].filter((_, i) => i !== index) }));
  
  const handleSaveProduct = () => {
    console.log("DỮ LIỆU LƯU DB:", formData);
    alert("Lưu thành công! Check Console F12 để xem dữ liệu gửi API.");
    setIsModalOpen(false);
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null); 
    } else {
      setExpandedRow(id); 
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

  const tabs = [
    { id: 1, name: "1. Thông tin chung" }, 
    { id: 2, name: "2. Thuộc tính" },
    { id: 3, name: "3. Biến thể" }, 
    { id: 4, name: "4. Hình ảnh" }
  ];

  return (
    <div className="flex w-full h-full p-4 gap-4 bg-[#f0f2f5] overflow-hidden">
      
      {/* ========================================= */}
      {/* CỘT TRÁI: BỘ LỌC (SIDEBAR FILTER)           */}
      {/* ========================================= */}
      <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-10 pr-1">
        
        {/* 1. Khối Tìm kiếm */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
          <div className="relative">
            <input type="text" placeholder="Theo tên sản phẩm..." className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 2. Khối Danh mục (ĐƯỢC DỜI LÊN ĐÂY) */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm danh mục" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
            <li className="font-semibold text-blue-600">Tất cả</li>
            <li className="hover:text-blue-600 cursor-pointer">Điện thoại</li>
            <li className="hover:text-blue-600 cursor-pointer">Laptop</li>
            <li className="hover:text-blue-600 cursor-pointer">Phụ kiện - Gear</li>
          </ul>
        </div>

        {/* 3. Khối Chất liệu, Màu sắc */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Chất liệu, Màu sắc</h3>
            <span className="text-gray-400 text-xs cursor-pointer">▲</span>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-500 mb-2 text-xs uppercase tracking-wide">Màu sắc</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> Đen</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> Trắng</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> Bạc</label>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="font-medium text-gray-500 mb-2 text-xs uppercase tracking-wide">Chất liệu</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> Nhôm</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> Kính</label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Khối Thương hiệu */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Thương hiệu</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm thương hiệu" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
            <li className="font-semibold text-blue-600">Tất cả</li>
            <li className="hover:text-blue-600 cursor-pointer">Apple</li>
            <li className="hover:text-blue-600 cursor-pointer">ASUS</li>
            <li className="hover:text-blue-600 cursor-pointer">Samsung</li>
            <li className="hover:text-blue-600 cursor-pointer">Logitech</li>
          </ul>
        </div>

        {/* 5. Khối Nhà cung cấp */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Nhà cung cấp</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm nhà cung cấp" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
            <li className="font-semibold text-blue-600">Tất cả</li>
            <li className="hover:text-blue-600 cursor-pointer">Apple Vietnam</li>
            <li className="hover:text-blue-600 cursor-pointer">ASUS Global</li>
            <li className="hover:text-blue-600 cursor-pointer">GearVN</li>
          </ul>
        </div>

        {/* 6. Khối Tồn kho */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Tồn kho</h3>
            <span className="text-gray-400 text-xs cursor-pointer">▲</span>
          </div>
          <div className="space-y-2.5 text-sm text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stock" defaultChecked className="w-4 h-4 text-blue-600" /> Tất cả</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stock" className="w-4 h-4 text-blue-600" /> Dưới định mức tồn</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stock" className="w-4 h-4 text-blue-600" /> Còn hàng</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stock" className="w-4 h-4 text-blue-600" /> Hết hàng</label>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* CỘT PHẢI: BẢNG DỮ LIỆU SẢN PHẨM             */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header của bảng */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => { setIsModalOpen(true); setActiveTab(1); }}
              className="bg-[#4caf50] hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <span>+ Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Khung chứa Table */}
        <div className="flex-1 overflow-auto bg-gray-50/30">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 shadow-sm">
              <tr>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200">Tên sản phẩm</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200">Thương hiệu</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200">Nhà cung cấp</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200">Danh mục</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200">Màu sắc</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200 text-right">Giá bán</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200 text-right">Tồn kho</th>
                <th className="py-3 px-5 font-bold text-sm border-b border-blue-200 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {mockProducts.map((p) => (
                <React.Fragment key={p.id}>
                  {/* --- DÒNG HIỂN THỊ CHÍNH --- */}
                  <tr 
                    onClick={() => toggleRow(p.id)}
                    className={`cursor-pointer transition-colors group border-b border-gray-200 ${expandedRow === p.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30 bg-white'}`}
                  >
                    <td className="py-3 px-5 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 px-5">{p.brand}</td>
                    <td className="py-3 px-5">{p.supplier}</td>
                    <td className="py-3 px-5">{p.category}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1 flex-wrap">
                        {p.colors.split(', ').map((color, idx) => (
                          <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">{color}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right font-medium">{formatPrice(p.price)}</td>
                    <td className="py-3 px-5 text-right">
                      <span className={p.stock === 0 ? "text-red-500 font-bold" : ""}>{p.stock}</span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        {expandedRow === p.id ? '▼' : '▶'}
                      </span>
                    </td>
                  </tr>

                  {/* --- DÒNG CHI TIẾT --- */}
                  {expandedRow === p.id && (
                    <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                      <td colSpan="8" className="p-0">
                        <div className="flex border-b border-gray-200 px-6 pt-2">
                          <button className="px-4 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 bg-white">Thông tin</button>
                          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-800">Thuộc tính</button>
                          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-800">Biến thể</button>
                        </div>
                        <div className="p-6 flex flex-col xl:flex-row gap-6">
                          <div className="w-40 h-40 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400 shrink-0 p-2 shadow-sm">
                            <div className="border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center rounded bg-gray-50">Ảnh SP</div>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 content-start">
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Mã sản phẩm:</span><span className="font-semibold text-gray-800">{p.id}</span></div>
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Thương hiệu:</span><span className="text-gray-800">{p.brand}</span></div>
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Nhà cung cấp:</span><span className="text-gray-800">{p.supplier}</span></div>
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Danh mục:</span><span className="text-gray-800">{p.category}</span></div>
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Giá vốn:</span><span className="text-gray-800">{formatPrice(p.cost)}</span></div>
                            <div className="flex border-b border-gray-200 py-2"><span className="w-32 text-gray-500">Giá bán:</span><span className="text-gray-800 font-medium text-blue-600">{formatPrice(p.price)}</span></div>
                            <div className="flex border-b border-gray-200 py-2">
                              <span className="w-32 text-gray-500">Trạng thái:</span>
                              <span className={p.status === 'active' ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                {p.status === 'active' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row xl:flex-col justify-end xl:justify-start gap-2 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-200 pt-4 xl:pt-0 xl:pl-6">
                            <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-600 hover:text-white transition font-medium flex items-center gap-2">Chỉnh sửa</button>
                            <button className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-500 hover:text-white transition font-medium">Ngừng bán</button>
                            <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-600 hover:text-white transition font-medium">Xóa</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer phân trang */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-600 shrink-0">
          <span>Hiển thị 1 - 3 của 125 sản phẩm</span>
          <div className="flex gap-1 items-center">
            <button className="px-2 py-1 hover:bg-gray-200 rounded">&laquo;</button>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">&lt;</button>
            <button className="px-3 py-1 bg-[#4caf50] text-white rounded font-bold">1</button>
            <button className="px-3 py-1 hover:bg-gray-200 rounded">2</button>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">&gt;</button>
            <button className="px-2 py-1 hover:bg-gray-200 rounded">&raquo;</button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL THÊM SẢN PHẨM MULTI-TAB                             */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#F8FAFC] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Thêm sản phẩm mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
            </div>

            <div className="bg-white px-6 pt-3 border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                      activeTab === tab.id ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
                
                {/* TAB 1: THÔNG TIN CHUNG */}
                {activeTab === 1 && (
                  <div className="space-y-5">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Thông tin cơ bản</h4>
                    <div className="grid grid-cols-2 gap-6">
                      
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
                        <input name="ten_san_pham" value={formData.ten_san_pham} onChange={handleBasicChange} type="text" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: iPhone 16 Pro Max" />
                      </div>
                      
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Thương hiệu</label>
                        <input name="thuong_hieu" value={formData.thuong_hieu} onChange={handleBasicChange} type="text" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: Apple" />
                      </div>
                      
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                        <select name="danh_muc_id" value={formData.danh_muc_id} onChange={handleBasicChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                          <option value="">-- Chọn danh mục --</option>
                          <option value="DM001">Điện thoại</option>
                          <option value="DM002">Laptop</option>
                          <option value="DM003">Phụ kiện - Gear</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nhà cung cấp</label>
                        <select name="nha_cung_cap_id" value={formData.nha_cung_cap_id} onChange={handleBasicChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                          <option value="">-- Chọn nhà cung cấp --</option>
                          <option value="NCC01">Apple Vietnam</option>
                          <option value="NCC02">ASUS Global</option>
                          <option value="NCC03">Samsung Vina</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tồn kho chung</label>
                        <input name="ton_kho" value={formData.ton_kho} onChange={handleBasicChange} type="number" min="0" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Nhập số lượng..." />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                        <select name="trang_thai" value={formData.trang_thai} onChange={handleBasicChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                          <option value="active">Đang kinh doanh</option>
                          <option value="inactive">Ngừng kinh doanh</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
                        <textarea name="mo_ta_day_du" value={formData.mo_ta_day_du} onChange={handleBasicChange} rows="4" className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Nhập bài viết mô tả sản phẩm..."></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: THUỘC TÍNH */}
                {activeTab === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Thuộc tính / Thông số</h4>
                    {formData.thuoc_tinh.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <input value={item.ten_thuoc_tinh} onChange={(e) => handleArrayChange('thuoc_tinh', index, 'ten_thuoc_tinh', e.target.value)} type="text" className="w-1/3 border px-4 py-2 rounded-lg text-sm bg-gray-50" placeholder="Tên thuộc tính (VD: Chip)" />
                        <input value={item.gia_tri} onChange={(e) => handleArrayChange('thuoc_tinh', index, 'gia_tri', e.target.value)} type="text" className="w-2/3 border px-4 py-2 rounded-lg text-sm" placeholder="Giá trị (VD: Apple A18 Pro)" />
                        <button onClick={() => removeRow('thuoc_tinh', index)} className="text-red-500 hover:bg-red-50 p-2 rounded text-xl">🗑️</button>
                      </div>
                    ))}
                    <button onClick={() => addRow('thuoc_tinh', { ten_thuoc_tinh: '', gia_tri: '', nhom: '', thu_tu: formData.thuoc_tinh.length + 1 })} className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                      + Thêm thông số mới
                    </button>
                  </div>
                )}

                {/* TAB 3: BIẾN THỂ */}
                {activeTab === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Biến thể & Giá bán</h4>
                    <p className="text-sm text-gray-500 mb-3 italic">* Nếu sản phẩm có biến thể, hệ thống sẽ ưu tiên Tồn kho tại đây thay vì Tồn kho chung ở Tab 1.</p>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-100 text-sm">
                          <tr>
                            <th className="p-3 w-1/5">Màu sắc</th>
                            <th className="p-3 w-1/5">Dung lượng</th>
                            <th className="p-3 w-1/5">Giá bán (VNĐ)</th>
                            <th className="p-3 w-1/5">Tồn kho</th>
                            <th className="p-3 w-16 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.bien_the.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2"><input value={item.mau_sac} onChange={(e) => handleArrayChange('bien_the', index, 'mau_sac', e.target.value)} type="text" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="VD: Titan Đen"/></td>
                              <td className="p-2"><input value={item.dung_luong} onChange={(e) => handleArrayChange('bien_the', index, 'dung_luong', e.target.value)} type="text" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="VD: 256GB"/></td>
                              <td className="p-2"><input value={item.gia_ban} onChange={(e) => handleArrayChange('bien_the', index, 'gia_ban', Number(e.target.value))} type="number" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="0"/></td>
                              <td className="p-2"><input value={item.ton_kho} onChange={(e) => handleArrayChange('bien_the', index, 'ton_kho', Number(e.target.value))} type="number" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="0"/></td>
                              <td className="p-2 text-center"><button onClick={() => removeRow('bien_the', index)} className="text-red-500 font-bold">X</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => addRow('bien_the', { sku: '', mau_sac: '', dung_luong: '', gia_goc: 0, gia_ban: 0, ton_kho: 0 })} className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50">
                      + Thêm biến thể mới
                    </button>
                  </div>
                )}

                {/* TAB 4: HÌNH ẢNH */}
                {activeTab === 4 && (
                  <div className="space-y-4 text-center py-10">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 text-left">Hình ảnh</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                      <div className="text-4xl mb-3">📸</div>
                      <p className="font-semibold text-gray-700">Kéo thả hình ảnh vào đây</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                {activeTab > 1 && <button onClick={() => setActiveTab(activeTab - 1)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded transition">&larr; Quay lại</button>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition">Hủy bỏ</button>
                {activeTab < 4 ? (
                  <button onClick={() => setActiveTab(activeTab + 1)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Tiếp tục &rarr;</button>
                ) : (
                  <button onClick={handleSaveProduct} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold transition">Lưu toàn bộ</button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Product;