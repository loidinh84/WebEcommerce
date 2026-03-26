import React, { useState, useEffect } from 'react';

const initialProducts = [
  { id: 'SP001', name: 'iPhone 16 Pro Max', brand: 'Apple', supplier: 'Apple Vietnam', category: 'Điện thoại', colors: 'Titan Đen, Titan Trắng', price: 34990000, cost: 28000000, stock: 150, status: 'active' },
  { id: 'SP002', name: 'Laptop ASUS ROG Strix G15', brand: 'ASUS', supplier: 'ASUS Global', category: 'Laptop', colors: 'Xám Eclipse', price: 25990000, cost: 21000000, stock: 12, status: 'active' },
  { id: 'SP003', name: 'Bàn phím cơ AKKO', brand: 'AKKO', supplier: 'GearVN', category: 'Phụ kiện', colors: 'Hồng, Xanh', price: 1500000, cost: 900000, stock: 0, status: 'out_of_stock' },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p);
const getStatusInfo = (status) => {
  if (status === 'active')   return { label: 'Đang kinh doanh', cls: 'text-green-600' };
  if (status === 'inactive') return { label: 'Ngừng kinh doanh', cls: 'text-orange-500' };
  return { label: 'Hết hàng', cls: 'text-red-500' };
};

const TABS = [
  { id: 1, name: '1. Thông tin chung' },
  { id: 2, name: '2. Thuộc tính' },
  { id: 3, name: '3. Biến thể' },
  { id: 4, name: '4. Hình ảnh' },
];

const EMPTY_FORM = {
  name: '', brand: '', category: '', supplier: '',
  price: 0, cost: 0, stock: 0, status: 'active', colors: '', description: '',
  thuoc_tinh: [{ ten_thuoc_tinh: '', gia_tri: '' }],
  bien_the: [{ mau_sac: '', dung_luong: '', gia_ban: 0, ton_kho: 0 }],
};

// ============================================================
// MODAL XÁC NHẬN
// ============================================================
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmCls }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium">
            Hủy bỏ
          </button>
          <button onClick={onConfirm} className={`px-5 py-2 text-sm text-white rounded-lg transition font-semibold ${confirmCls}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TABBAR
// ============================================================
const TabBar = ({ activeTab, onTabChange }) => (
  <div className="bg-white px-6 pt-3 border-b border-gray-200 overflow-x-auto shrink-0">
    <div className="flex gap-2 min-w-max">
      {TABS.map(tab => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)}
          className={`px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
          {tab.name}
        </button>
      ))}
    </div>
  </div>
);

// ============================================================
// TAB 1 — THÔNG TIN CHUNG
// ============================================================
const TabGeneral = ({ form, onChange }) => (
  <div className="space-y-5">
    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Thông tin cơ bản</h4>
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
        <input name="name" value={form.name} onChange={onChange} type="text" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: iPhone 16 Pro Max" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Thương hiệu</label>
        <input name="brand" value={form.brand} onChange={onChange} type="text" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: Apple" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
        <select name="category" value={form.category} onChange={onChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
          <option value="">-- Chọn danh mục --</option>
          <option value="Điện thoại">Điện thoại</option>
          <option value="Laptop">Laptop</option>
          <option value="Phụ kiện">Phụ kiện - Gear</option>
        </select>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nhà cung cấp</label>
        <select name="supplier" value={form.supplier} onChange={onChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
          <option value="">-- Chọn nhà cung cấp --</option>
          <option value="Apple Vietnam">Apple Vietnam</option>
          <option value="ASUS Global">ASUS Global</option>
          <option value="GearVN">GearVN</option>
          <option value="Samsung Vina">Samsung Vina</option>
        </select>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Giá vốn (VNĐ)</label>
        <input name="cost" value={form.cost} onChange={onChange} type="number" min="0" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Giá bán (VNĐ)</label>
        <input name="price" value={form.price} onChange={onChange} type="number" min="0" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tồn kho</label>
        <input name="stock" value={form.stock} onChange={onChange} type="number" min="0" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
        <select name="status" value={form.status} onChange={onChange} className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
          <option value="active">Đang kinh doanh</option>
          <option value="inactive">Ngừng kinh doanh</option>
          <option value="out_of_stock">Hết hàng</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Màu sắc (phân cách bằng dấu phẩy)</label>
        <input name="colors" value={form.colors} onChange={onChange} type="text" className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="VD: Đen, Trắng, Bạc" />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={4} className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Nhập mô tả sản phẩm..." />
      </div>
    </div>
  </div>
);

// ============================================================
// TAB 2 — THUỘC TÍNH
// ============================================================
const TabAttributes = ({ items, onChange, onAdd, onRemove }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Thuộc tính / Thông số</h4>
    {items.map((item, i) => (
      <div key={i} className="flex gap-4 items-center">
        <input value={item.ten_thuoc_tinh} onChange={e => onChange(i, 'ten_thuoc_tinh', e.target.value)} type="text" className="w-1/3 border px-4 py-2 rounded-lg text-sm bg-gray-50" placeholder="Tên thuộc tính (VD: Chip)" />
        <input value={item.gia_tri} onChange={e => onChange(i, 'gia_tri', e.target.value)} type="text" className="flex-1 border px-4 py-2 rounded-lg text-sm" placeholder="Giá trị (VD: Apple A18 Pro)" />
        <button onClick={() => onRemove(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-xl shrink-0">🗑️</button>
      </div>
    ))}
    <button onClick={onAdd} className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
      + Thêm thông số mới
    </button>
  </div>
);

// ============================================================
// TAB 3 — BIẾN THỂ
// ============================================================
const TabVariants = ({ items, onChange, onAdd, onRemove }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Biến thể & Giá bán</h4>
    <p className="text-sm text-gray-500 italic">* Nếu sản phẩm có biến thể, hệ thống sẽ ưu tiên Tồn kho tại đây thay vì Tồn kho chung ở Tab 1.</p>
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left min-w-[700px]">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3">Màu sắc</th>
            <th className="p-3">Dung lượng</th>
            <th className="p-3">Giá bán (VNĐ)</th>
            <th className="p-3">Tồn kho</th>
            <th className="p-3 text-center w-16">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2"><input value={item.mau_sac} onChange={e => onChange(i, 'mau_sac', e.target.value)} type="text" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="Titan Đen" /></td>
              <td className="p-2"><input value={item.dung_luong} onChange={e => onChange(i, 'dung_luong', e.target.value)} type="text" className="border px-3 py-1.5 rounded w-full text-sm" placeholder="256GB" /></td>
              <td className="p-2"><input value={item.gia_ban} onChange={e => onChange(i, 'gia_ban', Number(e.target.value))} type="number" className="border px-3 py-1.5 rounded w-full text-sm" /></td>
              <td className="p-2"><input value={item.ton_kho} onChange={e => onChange(i, 'ton_kho', Number(e.target.value))} type="number" className="border px-3 py-1.5 rounded w-full text-sm" /></td>
              <td className="p-2 text-center"><button onClick={() => onRemove(i)} className="text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded">✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button onClick={onAdd} className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition">
      + Thêm biến thể mới
    </button>
  </div>
);

// ============================================================
// TAB 4 — HÌNH ẢNH
// ============================================================
const TabImages = () => (
  <div className="space-y-4">
    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Hình ảnh</h4>
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center">
      <div className="text-5xl mb-3">📸</div>
      <p className="font-semibold text-gray-700">Kéo thả hình ảnh vào đây</p>
      <p className="text-sm text-gray-400 mt-1">Hỗ trợ PNG, JPG, WEBP — tối đa 5MB/ảnh</p>
    </div>
  </div>
);

// ============================================================
// MODAL FOOTER DÙNG CHUNG
// ============================================================
const ModalFooter = ({ activeTab, onBack, onNext, onClose, onSave, saveLabel }) => (
  <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center shrink-0">
    <div>
      {activeTab > 1 && (
        <button onClick={onBack} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">← Quay lại</button>
      )}
    </div>
    <div className="flex gap-3">
      <button onClick={onClose} className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Hủy bỏ</button>
      {activeTab < 4 ? (
        <button onClick={onNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Tiếp tục →</button>
      ) : (
        <button onClick={onSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition">{saveLabel}</button>
      )}
    </div>
  </div>
);

// ============================================================
// HOOK FORM DÙNG CHUNG
// ============================================================
const useForm = (initial) => {
  const [form, setForm] = useState(initial);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const arrChange = (key, index, field, value) =>
    setForm(prev => {
      const arr = [...prev[key]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  const arrAdd    = (key, empty) => setForm(prev => ({ ...prev, [key]: [...prev[key], empty] }));
  const arrRemove = (key, index) => setForm(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  const reset     = (val) => setForm(val);
  return { form, onChange, arrChange, arrAdd, arrRemove, reset };
};

// ============================================================
// RENDER TAB NỘI DUNG (DÙNG CHUNG CHO ADD VÀ EDIT)
// ============================================================
const renderTabContent = (activeTab, form, onChange, arrChange, arrAdd, arrRemove) => {
  if (activeTab === 1) return <TabGeneral form={form} onChange={onChange} />;
  if (activeTab === 2) return (
    <TabAttributes
      items={form.thuoc_tinh}
      onChange={(i, f, v) => arrChange('thuoc_tinh', i, f, v)}
      onAdd={() => arrAdd('thuoc_tinh', { ten_thuoc_tinh: '', gia_tri: '' })}
      onRemove={(i) => arrRemove('thuoc_tinh', i)}
    />
  );
  if (activeTab === 3) return (
    <TabVariants
      items={form.bien_the}
      onChange={(i, f, v) => arrChange('bien_the', i, f, v)}
      onAdd={() => arrAdd('bien_the', { mau_sac: '', dung_luong: '', gia_ban: 0, ton_kho: 0 })}
      onRemove={(i) => arrRemove('bien_the', i)}
    />
  );
  return <TabImages />;
};

// ============================================================
// MODAL THÊM SẢN PHẨM
// ============================================================
const AddModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(1);
  const { form, onChange, arrChange, arrAdd, arrRemove, reset } = useForm(EMPTY_FORM);

  if (!isOpen) return null;

  const handleClose = () => { reset(EMPTY_FORM); setActiveTab(1); onClose(); };
  const handleSave  = () => { console.log('THÊM MỚI:', form); handleClose(); };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-800">Thêm sản phẩm mới</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
        </div>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            {renderTabContent(activeTab, form, onChange, arrChange, arrAdd, arrRemove)}
          </div>
        </div>
        <ModalFooter
          activeTab={activeTab}
          onBack={() => setActiveTab(t => t - 1)}
          onNext={() => setActiveTab(t => t + 1)}
          onClose={handleClose}
          onSave={handleSave}
          saveLabel="✔ Lưu toàn bộ"
        />
      </div>
    </div>
  );
};

// ============================================================
// MODAL CHỈNH SỬA SẢN PHẨM
// ============================================================
const EditModal = ({ isOpen, onClose, product, onSave }) => {
  const [activeTab, setActiveTab] = useState(1);
  const { form, onChange, arrChange, arrAdd, arrRemove, reset } = useForm(null);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name, brand: product.brand, category: product.category,
        supplier: product.supplier, price: product.price, cost: product.cost,
        stock: product.stock, status: product.status, colors: product.colors,
        description: '',
        thuoc_tinh: [{ ten_thuoc_tinh: 'Chip', gia_tri: '' }, { ten_thuoc_tinh: 'RAM', gia_tri: '' }],
        bien_the: [{ mau_sac: '', dung_luong: '', gia_ban: product.price, ton_kho: product.stock }],
      });
      setActiveTab(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!isOpen || !product || !form) return null;

  const handleSave = () => { onSave(product.id, form); onClose(); };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h3>
            <p className="text-xs text-gray-400 mt-0.5">Mã SP: {product.id} — {product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
        </div>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
            {renderTabContent(activeTab, form, onChange, arrChange, arrAdd, arrRemove)}
          </div>
        </div>
        <ModalFooter
          activeTab={activeTab}
          onBack={() => setActiveTab(t => t - 1)}
          onNext={() => setActiveTab(t => t + 1)}
          onClose={onClose}
          onSave={handleSave}
          saveLabel="💾 Lưu thay đổi"
        />
      </div>
    </div>
  );
};

// ============================================================
// COMPONENT CHÍNH
// ============================================================
const Product = () => {
  const [products,     setProducts]    = useState(initialProducts);
  const [searchTerm,   setSearchTerm]  = useState('');
  const [expandedRow,  setExpandedRow] = useState(null);
  const [showAdd,      setShowAdd]     = useState(false);
  const [editState,    setEditState]   = useState({ open: false, product: null });
  const [delState,     setDelState]    = useState({ open: false, id: null, name: '' });
  const [toggleState,  setToggleState] = useState({ open: false, id: null, name: '', currentStatus: '' });

  const toggleRow = (id) => setExpandedRow(prev => prev === id ? null : id);

  const handleEditSave = (id, form) =>
    setProducts(prev => prev.map(p => p.id !== id ? p : {
      ...p, name: form.name, brand: form.brand, category: form.category,
      supplier: form.supplier, price: Number(form.price), cost: Number(form.cost),
      stock: Number(form.stock), status: form.status, colors: form.colors,
    }));

  const handleDeleteConfirm = () => {
    setProducts(prev => prev.filter(p => p.id !== delState.id));
    if (expandedRow === delState.id) setExpandedRow(null);
    setDelState({ open: false, id: null, name: '' });
  };

  const handleToggleConfirm = () => {
    setProducts(prev => prev.map(p =>
      p.id !== toggleState.id ? p : { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
    ));
    setToggleState({ open: false, id: null, name: '', currentStatus: '' });
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex w-full h-full p-4 gap-4 bg-[#f0f2f5] overflow-hidden">

      {/* ============================= */}
      {/* CỘT TRÁI — BỘ LỌC            */}
      {/* ============================= */}
      <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto pb-10 pr-1">

        {/* Tìm kiếm */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
          <div className="relative">
            <input type="text" placeholder="Theo tên sản phẩm..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Danh mục */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm danh mục" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto">
            <li className="font-semibold text-blue-600 cursor-pointer">Tất cả</li>
            {['Điện thoại', 'Laptop', 'Phụ kiện - Gear'].map(c => (
              <li key={c} className="hover:text-blue-600 cursor-pointer">{c}</li>
            ))}
          </ul>
        </div>

        {/* Chất liệu, Màu sắc */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Chất liệu, Màu sắc</h3>
            <span className="text-gray-400 text-xs cursor-pointer">▲</span>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-500 mb-2 text-xs uppercase tracking-wide">Màu sắc</p>
              <div className="grid grid-cols-2 gap-2">
                {['Đen', 'Trắng', 'Bạc'].map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> {c}</label>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="font-medium text-gray-500 mb-2 text-xs uppercase tracking-wide">Chất liệu</p>
              <div className="grid grid-cols-2 gap-2">
                {['Nhôm', 'Kính'].map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /> {c}</label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thương hiệu */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Thương hiệu</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm thương hiệu" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto">
            <li className="font-semibold text-blue-600 cursor-pointer">Tất cả</li>
            {['Apple', 'ASUS', 'Samsung', 'Logitech'].map(b => (
              <li key={b} className="hover:text-blue-600 cursor-pointer">{b}</li>
            ))}
          </ul>
        </div>

        {/* Nhà cung cấp */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Nhà cung cấp</h3>
            <span className="text-blue-500 text-lg cursor-pointer leading-none">+</span>
          </div>
          <input type="text" placeholder="🔍 Tìm nhà cung cấp" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:border-blue-500" />
          <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto">
            <li className="font-semibold text-blue-600 cursor-pointer">Tất cả</li>
            {['Apple Vietnam', 'ASUS Global', 'GearVN'].map(s => (
              <li key={s} className="hover:text-blue-600 cursor-pointer">{s}</li>
            ))}
          </ul>
        </div>

        {/* Tồn kho */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Tồn kho</h3>
            <span className="text-gray-400 text-xs cursor-pointer">▲</span>
          </div>
          <div className="space-y-2.5 text-sm text-gray-700">
            {['Tất cả', 'Dưới định mức tồn', 'Còn hàng', 'Hết hàng'].map((opt, i) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="stock" defaultChecked={i === 0} className="w-4 h-4 text-blue-600" /> {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* CỘT PHẢI — BẢNG DỮ LIỆU     */}
      {/* ============================= */}
      <div className="flex-1 flex flex-col bg-white rounded shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h2>
          <button onClick={() => setShowAdd(true)}
            className="bg-[#4caf50] hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm">
            + Thêm sản phẩm
          </button>
        </div>

        {/* Table */}
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
              {filtered.map(p => (
                <React.Fragment key={p.id}>

                  {/* DÒNG CHÍNH */}
                  <tr onClick={() => toggleRow(p.id)}
                    className={`cursor-pointer transition-colors group border-b border-gray-200 ${expandedRow === p.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30 bg-white'}`}>
                    <td className="py-3 px-5 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 px-5">{p.brand}</td>
                    <td className="py-3 px-5">{p.supplier}</td>
                    <td className="py-3 px-5">{p.category}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1 flex-wrap">
                        {p.colors.split(', ').map((c, i) => (
                          <span key={i} className="bg-gray-100 border border-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right font-medium">{formatPrice(p.price)}</td>
                    <td className="py-3 px-5 text-right">
                      <span className={p.stock === 0 ? 'text-red-500 font-bold' : ''}>{p.stock}</span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        {expandedRow === p.id ? '▼' : '▶'}
                      </span>
                    </td>
                  </tr>

                  {/* DÒNG CHI TIẾT */}
                  {expandedRow === p.id && (
                    <tr className="bg-[#f8fafc] border-b-2 border-blue-200">
                      <td colSpan={8} className="p-0">

                        {/* Tab mini */}
                        <div className="flex border-b border-gray-200 px-6 pt-2">
                          <button className="px-4 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 bg-white">Thông tin</button>
                          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-800">Thuộc tính</button>
                          <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-800">Biến thể</button>
                        </div>

                        <div className="p-6 flex flex-col xl:flex-row gap-6">

                          {/* Ảnh sản phẩm */}
                          <div className="w-40 h-40 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400 shrink-0 p-2 shadow-sm">
                            <div className="border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center rounded bg-gray-50">Ảnh SP</div>
                          </div>

                          {/* Thông tin chi tiết */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 content-start">
                            {[
                              ['Mã sản phẩm:', <span className="font-semibold text-gray-800">{p.id}</span>],
                              ['Thương hiệu:', p.brand],
                              ['Nhà cung cấp:', p.supplier],
                              ['Danh mục:', p.category],
                              ['Giá vốn:', formatPrice(p.cost)],
                              ['Giá bán:', <span className="text-blue-600 font-semibold">{formatPrice(p.price)}</span>],
                            ].map(([label, val], i) => (
                              <div key={i} className="flex border-b border-gray-200 py-2">
                                <span className="w-32 text-gray-500">{label}</span>
                                <span className="text-gray-800">{val}</span>
                              </div>
                            ))}
                            <div className="flex border-b border-gray-200 py-2">
                              <span className="w-32 text-gray-500">Trạng thái:</span>
                              <span className={`font-medium ${getStatusInfo(p.status).cls}`}>{getStatusInfo(p.status).label}</span>
                            </div>
                          </div>

                          {/* ==============================================
                              BUTTONS THAO TÁC
                              Bọc trong div onClick={e => e.stopPropagation()}
                              để tránh click bubble lên <tr> toggleRow
                          ============================================== */}
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex flex-row xl:flex-col justify-end xl:justify-start gap-2 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-200 pt-4 xl:pt-0 xl:pl-6"
                          >
                            {/* Chỉnh sửa */}
                            <button
                              onClick={() => setEditState({ open: true, product: p })}
                              className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-600 hover:text-white transition font-medium text-sm"
                            >
                              ✏️ Chỉnh sửa
                            </button>

                            {/* Ngừng bán / Hoạt động lại */}
                            {p.status === 'active' ? (
                              <button
                                onClick={() => setToggleState({ open: true, id: p.id, name: p.name, currentStatus: p.status })}
                                className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-500 hover:text-white transition font-medium text-sm"
                              >
                                🚫 Ngừng bán
                              </button>
                            ) : (
                              <button
                                onClick={() => setToggleState({ open: true, id: p.id, name: p.name, currentStatus: p.status })}
                                className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-500 hover:text-white transition font-medium text-sm"
                              >
                                ✅ Hoạt động lại
                              </button>
                            )}

                            {/* Xóa */}
                            <button
                              onClick={() => setDelState({ open: true, id: p.id, name: p.name })}
                              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-600 hover:text-white transition font-medium text-sm"
                            >
                              🗑️ Xóa
                            </button>
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
          <span>Hiển thị 1 - {filtered.length} của 125 sản phẩm</span>
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

      {/* ===== MODAL THÊM MỚI ===== */}
      <AddModal isOpen={showAdd} onClose={() => setShowAdd(false)} />

      {/* ===== MODAL CHỈNH SỬA ===== */}
      <EditModal
        isOpen={editState.open}
        onClose={() => setEditState({ open: false, product: null })}
        product={editState.product}
        onSave={handleEditSave}
      />

      {/* ===== MODAL XÁC NHẬN XÓA ===== */}
      <ConfirmModal
        isOpen={delState.open}
        onClose={() => setDelState({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${delState.name}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa vĩnh viễn"
        confirmCls="bg-red-600 hover:bg-red-700"
      />

      {/* ===== MODAL XÁC NHẬN TOGGLE TRẠNG THÁI ===== */}
      <ConfirmModal
        isOpen={toggleState.open}
        onClose={() => setToggleState({ open: false, id: null, name: '', currentStatus: '' })}
        onConfirm={handleToggleConfirm}
        title={toggleState.currentStatus === 'active' ? 'Xác nhận ngừng bán' : 'Xác nhận hoạt động lại'}
        message={
          toggleState.currentStatus === 'active'
            ? `Bạn có chắc muốn ngừng bán sản phẩm "${toggleState.name}"? Sản phẩm sẽ không hiển thị trên cửa hàng.`
            : `Bạn có chắc muốn kích hoạt lại sản phẩm "${toggleState.name}"? Sản phẩm sẽ hiển thị trở lại trên cửa hàng.`
        }
        confirmText={toggleState.currentStatus === 'active' ? 'Ngừng bán' : 'Hoạt động lại'}
        confirmCls={toggleState.currentStatus === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}
      />

    </div>
  );
};

export default Product;