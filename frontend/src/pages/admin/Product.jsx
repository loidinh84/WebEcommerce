import React, { useEffect, useState } from "react";
import ProductModal from "./ProductModal";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import { toast } from "react-toastify";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

const mockProductsData = [
  {
    id: "SP001", ten_san_pham: "iPhone 16 Pro Max 256GB", thuong_hieu: "Apple",
    supplier: "Apple Vietnam", category: "Điện thoại di động",
    bien_the: [{ sku: "IP16-256-TITAN", mau_sac: "Titan Đen", dung_luong: "256GB", ram: "8GB", gia_ban: 34990000, gia_goc: 30000000, ton_kho: 50 }],
    trang_thai: "active", noi_bat: true, mo_ta_ngan: "Flagship Apple mới nhất 2025, chip A18 Pro.",
  },
  {
    id: "SP002", ten_san_pham: "iPhone 15 128GB", thuong_hieu: "Apple",
    supplier: "Apple Vietnam", category: "Điện thoại di động",
    bien_the: [{ sku: "IP15-128-PINK", mau_sac: "Hồng", dung_luong: "128GB", ram: "6GB", gia_ban: 19990000, gia_goc: 17000000, ton_kho: 0 }],
    trang_thai: "active", noi_bat: false, mo_ta_ngan: "iPhone 15 tiêu chuẩn, camera 48MP.",
  },
  {
    id: "SP003", ten_san_pham: "Samsung Galaxy S24 Ultra", thuong_hieu: "Samsung",
    supplier: "Samsung Vietnam", category: "Điện thoại di động",
    bien_the: [{ sku: "S24U-256-BLK", mau_sac: "Đen", dung_luong: "256GB", ram: "12GB", gia_ban: 27490000, gia_goc: 24000000, ton_kho: 20 }],
    trang_thai: "active", noi_bat: true, mo_ta_ngan: "Flagship Samsung, bút S Pen tích hợp.",
  },
  {
    id: "SP004", ten_san_pham: "MacBook Air M3 13 inch", thuong_hieu: "Apple",
    supplier: "Apple Vietnam", category: "Laptop & Macbook",
    bien_the: [{ sku: "MBA-M3-256", mau_sac: "Xám", dung_luong: "256GB", ram: "8GB", gia_ban: 27990000, gia_goc: 25000000, ton_kho: 15 }],
    trang_thai: "active", noi_bat: true, mo_ta_ngan: "Laptop siêu mỏng nhẹ, chip M3 mạnh mẽ.",
  },
  {
    id: "SP005", ten_san_pham: "Laptop ASUS ROG Strix G15", thuong_hieu: "ASUS",
    supplier: "ASUS Global", category: "Laptop & Macbook",
    bien_the: [
      { sku: "ROG-G15-512", mau_sac: "Xám Eclipse", dung_luong: "512GB", ram: "16GB", gia_ban: 32990000, gia_goc: 30000000, ton_kho: 5 },
      { sku: "ROG-G15-1TB", mau_sac: "Xám Eclipse", dung_luong: "1TB", ram: "32GB", gia_ban: 38990000, gia_goc: 35000000, ton_kho: 3 },
    ],
    trang_thai: "active", noi_bat: false, mo_ta_ngan: "Gaming laptop cao cấp, RTX 4070.",
  },
  {
    id: "SP006", ten_san_pham: "Laptop ASUS TUF Gaming F15", thuong_hieu: "ASUS",
    supplier: "ASUS Global", category: "Laptop & Macbook",
    bien_the: [{ sku: "TUF-F15-512", mau_sac: "Đen", dung_luong: "512GB", ram: "16GB", gia_ban: 22000000, gia_goc: 20000000, ton_kho: 10 }],
    trang_thai: "inactive", noi_bat: false, mo_ta_ngan: "Laptop gaming quốc dân, cấu hình cực mạnh.",
  },
  {
    id: "SP007", ten_san_pham: "Bàn phím cơ AKKO 3098B", thuong_hieu: "AKKO",
    supplier: "GearVN", category: "Phụ kiện - Bàn phím",
    bien_the: [{ sku: "AK-3098B-HONG", mau_sac: "Hồng", dung_luong: "", ram: "", gia_ban: 1500000, gia_goc: 1200000, ton_kho: 15 }],
    trang_thai: "active", noi_bat: false, mo_ta_ngan: "Phím cơ giá sinh viên, switch Jelly Pink.",
  },
  {
    id: "SP008", ten_san_pham: "Chuột Logitech G502 X Plus", thuong_hieu: "Logitech",
    supplier: "GearVN", category: "Phụ kiện - Bàn phím",
    bien_the: [{ sku: "G502X-BLK", mau_sac: "Đen", dung_luong: "", ram: "", gia_ban: 2490000, gia_goc: 2000000, ton_kho: 30 }],
    trang_thai: "active", noi_bat: false, mo_ta_ngan: "Chuột gaming không dây, HERO 25K sensor.",
  },
  {
    id: "SP009", ten_san_pham: "Tai nghe Sony WH-1000XM5", thuong_hieu: "Sony",
    supplier: "GearVN", category: "Phụ kiện - Bàn phím",
    bien_the: [{ sku: "WH1000XM5-BLK", mau_sac: "Đen", dung_luong: "", ram: "", gia_ban: 7490000, gia_goc: 6500000, ton_kho: 0 }],
    trang_thai: "inactive", noi_bat: false, mo_ta_ngan: "Tai nghe chống ồn hàng đầu thế giới.",
  },
];

const Product = () => {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [activeTab, setActiveTab]           = useState(1);
  const [expandedRows, setExpandedRows]     = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState({});
  const [products, setProducts]             = useState([]);
  const [isLoading, setIsLoading]           = useState(true);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm]           = useState("");
  const [productTab, setProductTab]           = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [filterStatus, setFilterStatus]       = useState("all");
  const [stockFilter, setStockFilter]         = useState("all");
  // ────────────────────────────────────────────────────────

  const [categories, setCategories] = useState([
    { id: "DM001", name: "Điện thoại di động" },
    { id: "DM002", name: "Laptop & Macbook" },
    { id: "DM003", name: "Phụ kiện - Bàn phím" },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: "NCC001", name: "Apple Vietnam" },
    { id: "NCC002", name: "ASUS Global" },
    { id: "NCC003", name: "GearVN" },
    { id: "NCC004", name: "Samsung Vietnam" },
  ]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [newCategoryName, setNewCategoryName]     = useState("");
  const [newSupplierName, setNewSupplierName]     = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, actionType: null, product: null, title: "", message: "",
  });

  const emptyFormData = {
    ten_san_pham: "", thuong_hieu: "", danh_muc_id: "", nha_cung_cap_id: "",
    trang_thai: "active", ton_kho: 0, mo_ta_ngan: "", mo_ta_day_du: "", noi_bat: false,
    thuoc_tinh: [{ ten_thuoc_tinh: "", gia_tri: "", nhom: "", thu_tu: 1 }],
    bien_the:   [{ sku: "", mau_sac: "", dung_luong: "", gia_goc: 0, gia_ban: 0, ton_kho: 0 }],
    hinh_anh:   [{ url_anh: "", alt_text: "", la_anh_chinh: true }],
  };
  const [formData, setFormData] = useState(emptyFormData);

  // ── MAP & FETCH ──────────────────────────────────────────
  const mapAndSetProducts = (data) => {
    setProducts(data.map((p) => ({
      id:        p.id,
      name:      p.ten_san_pham,
      brand:     p.thuong_hieu,
      supplier:  p.supplier?.ten_nha_cung_cap || p.supplier || "Chưa cập nhật",
      category:  p.category?.ten_danh_muc     || p.category  || "Chưa cập nhật",
      price:     p.bien_the?.[0]?.gia_ban  ?? 0,
      cost:      p.bien_the?.[0]?.gia_goc  ?? 0,
      stock:     p.bien_the?.reduce((t, bt) => t + (Number(bt.ton_kho) || 0), 0) ?? 0,
      status:    p.trang_thai,
      isFeatured: p.noi_bat,
      shortDesc: p.mo_ta_ngan,
      variants:  p.bien_the  || [],
      attributes: p.thuoc_tinh || [],
      images:    p.hinh_anh  || [],
      rawData:   p,
    })));
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/sanpham");
      mapAndSetProducts(res.data);
    } catch {
      mapAndSetProducts(mockProductsData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  // ────────────────────────────────────────────────────────

  // ── BỘ LỌC ──────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    if (productTab === "active"       && p.status !== "active") return false;
    if (productTab === "out_of_stock" && p.stock > 0)           return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory !== "all"  && p.category !== selectedCategory)  return false;
    if (selectedSupplier !== "all"  && p.supplier !== selectedSupplier)  return false;
    if (filterStatus === "active"   && p.status !== "active")   return false;
    if (filterStatus === "inactive" && p.status !== "inactive") return false;
    if (stockFilter === "in_stock"     && p.stock <= 0) return false;
    if (stockFilter === "out_of_stock" && p.stock > 0)  return false;
    return true;
  });

  const countActive      = products.filter(p => p.status === "active").length;
  const countOutOfStock  = products.filter(p => p.stock === 0).length;

  const countByCategory = (cat) =>
    cat === "all" ? products.length : products.filter(p => p.category === cat).length;
  const countBySupplier = (sup) =>
    sup === "all" ? products.length : products.filter(p => p.supplier === sup).length;
  const countByStatus = (s) =>
    s === "all" ? products.length : products.filter(p => p.status === s).length;
  const countByStock = (s) => {
    if (s === "all")          return products.length;
    if (s === "in_stock")     return products.filter(p => p.stock > 0).length;
    if (s === "out_of_stock") return products.filter(p => p.stock === 0).length;
    return 0;
  };

  const hasActiveFilter =
    selectedCategory !== "all" || selectedSupplier !== "all" ||
    filterStatus !== "all" || stockFilter !== "all" || searchTerm !== "";

  const clearAllFilters = () => {
    setSelectedCategory("all"); setSelectedSupplier("all");
    setFilterStatus("all"); setStockFilter("all"); setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── HANDLERS ────────────────────────────────────────────
  const handleQuickSaveCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return toast.warning("Vui lòng nhập tên danh mục!");
    setCategories([...categories, { id: `DM00${categories.length + 1}`, name: newCategoryName }]);
    toast.success("Đã thêm danh mục: " + newCategoryName);
    setIsAddCategoryOpen(false); setNewCategoryName("");
  };

  const handleQuickSaveSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return toast.warning("Vui lòng nhập tên nhà cung cấp!");
    setSuppliers([...suppliers, { id: `NCC00${suppliers.length + 1}`, name: newSupplierName }]);
    toast.success("Đã thêm nhà cung cấp: " + newSupplierName);
    setIsAddSupplierOpen(false); setNewSupplierName("");
  };

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleArrayChange = (arrayName, index, field, value) => {
    const arr = [...formData[arrayName]];
    arr[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: arr }));
  };
  const addRow    = (n, obj)   => setFormData(prev => ({ ...prev, [n]: [...prev[n], obj] }));
  const removeRow = (n, index) => setFormData(prev => ({ ...prev, [n]: formData[n].filter((_, i) => i !== index) }));

  const handleSaveProduct = async () => {
    if (!formData.ten_san_pham.trim()) return toast.warning("Tên sản phẩm không được để trống!");
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/sanpham/${editingProduct.id}`, formData);
        toast.success("Lưu thành công!");
      } else {
        await axios.post("http://localhost:5000/api/sanpham", formData);
        toast.success("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false); fetchProducts();
    } catch {
      const saved = {
        id: editingProduct ? editingProduct.id : `SP00${products.length + 10}`,
        name: formData.ten_san_pham, brand: formData.thuong_hieu,
        supplier: suppliers.find(s => s.id === formData.nha_cung_cap_id)?.name || "Chưa cập nhật",
        category: categories.find(c => c.id === formData.danh_muc_id)?.name || "Chưa cập nhật",
        price: formData.bien_the[0]?.gia_ban || 0, cost: formData.bien_the[0]?.gia_goc || 0,
        stock: formData.bien_the.reduce((s, bt) => s + (Number(bt.ton_kho) || 0), 0),
        status: formData.trang_thai, isFeatured: formData.noi_bat,
        shortDesc: formData.mo_ta_ngan, variants: formData.bien_the,
        attributes: formData.thuoc_tinh, images: formData.hinh_anh, rawData: formData,
      };
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? saved : p));
        toast.success("Đã cập nhật (UI)");
      } else {
        setProducts([saved, ...products]);
        toast.success("Đã thêm (UI)");
      }
      setIsModalOpen(false);
    }
  };

  const executeConfirmAction = async () => {
    const pid = confirmModal.product.id;
    try {
      if (confirmModal.actionType === "delete") {
        await axios.delete(`http://localhost:5000/api/sanpham/${pid}`);
        toast.success("Xóa thành công!");
      } else {
        await axios.put(`http://localhost:5000/api/sanpham/${pid}/status`);
        toast.success("Cập nhật trạng thái thành công!");
      }
      fetchProducts();
    } catch {
      if (confirmModal.actionType === "delete") {
        setProducts(products.filter(p => p.id !== pid));
        toast.success("Đã xóa (UI)");
      } else {
        setProducts(products.map(p => p.id === pid ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
        toast.success("Đã cập nhật (UI)");
      }
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    if (!activeDetailTab[id]) setActiveDetailTab(prev => ({ ...prev, [id]: "info" }));
  };

  const handleEditClick = async (product) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sanpham/${product.id}`);
      const d = res.data;
      setEditingProduct(product);
      setFormData({
        ten_san_pham: d.ten_san_pham || "", thuong_hieu: d.thuong_hieu || "",
        danh_muc_id: d.danh_muc_id || "", nha_cung_cap_id: d.nha_cung_cap_id || "",
        trang_thai: d.trang_thai || "active", ton_kho: d.ton_kho || 0,
        mo_ta_ngan: d.mo_ta_ngan || "", mo_ta_day_du: d.mo_ta_day_du || "", noi_bat: d.noi_bat || false,
        thuoc_tinh: d.thuoc_tinh?.length > 0 ? d.thuoc_tinh : emptyFormData.thuoc_tinh,
        bien_the:   d.bien_the?.length   > 0 ? d.bien_the   : emptyFormData.bien_the,
        hinh_anh:   d.hinh_anh?.length   > 0 ? d.hinh_anh   : emptyFormData.hinh_anh,
      });
    } catch {
      setEditingProduct(product);
      setFormData({
        ten_san_pham: product.name || "", thuong_hieu: product.brand || "",
        danh_muc_id: categories.find(c => c.name === product.category)?.id || "",
        nha_cung_cap_id: suppliers.find(s => s.name === product.supplier)?.id || "",
        trang_thai: product.status || "active", ton_kho: product.stock || 0,
        mo_ta_ngan: product.shortDesc || "", mo_ta_day_du: product.rawData?.mo_ta_day_du || "",
        noi_bat: product.isFeatured || false,
        thuoc_tinh: product.attributes?.length > 0 ? product.attributes : emptyFormData.thuoc_tinh,
        bien_the:   product.variants?.length   > 0 ? product.variants   : emptyFormData.bien_the,
        hinh_anh:   product.images?.length     > 0 ? product.images     : emptyFormData.hinh_anh,
      });
    }
    setIsModalOpen(true); setActiveTab(1);
  };
  // ────────────────────────────────────────────────────────

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
              type="text" placeholder="Tên sản phẩm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Danh mục -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
              <button onClick={() => setIsAddCategoryOpen(true)} className="text-gray-400 hover:text-blue-600 text-xl cursor-pointer font-medium leading-none">+</button>
            </div>
            <div className="space-y-0.5 text-sm">
              {[{ value: "all", label: "Tất cả" }, ...categories.map(c => ({ value: c.name, label: c.name }))].map(item => (
                <button
                  key={item.value}
                  onClick={() => setSelectedCategory(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${selectedCategory === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0 ml-1">
                    {countByCategory(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Nhà cung cấp -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Nhà cung cấp</h3>
              <button onClick={() => setIsAddSupplierOpen(true)} className="text-gray-400 hover:text-blue-600 text-xl cursor-pointer font-medium leading-none">+</button>
            </div>
            <div className="space-y-0.5 text-sm">
              {[{ value: "all", label: "Tất cả" }, ...suppliers.map(s => ({ value: s.name, label: s.name }))].map(item => (
                <button
                  key={item.value}
                  onClick={() => setSelectedSupplier(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${selectedSupplier === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0 ml-1">
                    {countBySupplier(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Trạng thái -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Trạng thái</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",      label: "Tất cả" },
                { value: "active",   label: "Đang kinh doanh" },
                { value: "inactive", label: "Ngừng kinh doanh" },
              ].map(item => (
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

          {/* -- Tồn kho -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Tồn kho</h3>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all",          label: "Tất cả" },
                { value: "in_stock",     label: "Còn hàng" },
                { value: "out_of_stock", label: "Hết hàng" },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setStockFilter(item.value)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-left cursor-pointer font-medium
                    ${stockFilter === item.value ? "bg-gray-100 text-gray-900 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {countByStock(item.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* -- Thống kê -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tổng sản phẩm</span><span className="font-bold text-gray-800">{products.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Đang kinh doanh</span><span className="font-bold text-gray-800">{countActive}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hết hàng</span><span className="font-bold text-red-500">{countOutOfStock}</span></div>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* CỘT PHẢI: BẢNG DỮ LIỆU                          */}
        {/* ================================================ */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">

          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm</h2>
            <button
              onClick={() => { setIsModalOpen(true); setActiveTab(1); setEditingProduct(null); setFormData({ ...emptyFormData }); }}
              className="bg-[#4caf50] hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm cursor-pointer"
            >
              + Thêm sản phẩm
            </button>
          </div>

          {/* Tab */}
          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0">
            <button onClick={() => setProductTab("all")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              Tất cả ({products.length})
            </button>
            <button onClick={() => setProductTab("active")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              Đang kinh doanh ({countActive})
            </button>
            <button onClick={() => setProductTab("out_of_stock")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "out_of_stock" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              Hết hàng ({countOutOfStock})
            </button>
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Mã & Tên SP</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Nhà cung cấp</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Danh mục</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200 text-right">Kho tổng</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200 text-center w-40">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Không tìm thấy sản phẩm nào.</td></tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isExpanded       = expandedRows.includes(p.id);
                    const currentDetailTab = activeDetailTab[p.id] || "info";
                    return (
                      <React.Fragment key={p.id}>
                        <tr
                          onClick={() => toggleRow(p.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200 ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"}`}
                        >
                          <td className="py-3 px-5">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {p.name}
                              {p.isFeatured && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded border border-yellow-300 font-bold">Nổi bật</span>}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">Mã: {p.id} · {p.brand}</div>
                          </td>
                          <td className="py-3 px-5 text-gray-600">{p.supplier}</td>
                          <td className="py-3 px-5 text-gray-600">{p.category}</td>
                          <td className="py-3 px-5 text-right font-bold">
                            {p.stock <= 0
                              ? <span className="text-red-500">Hết hàng</span>
                              : <span className="text-gray-800">{p.stock}</span>}
                          </td>
                          <td className="py-3 px-5 text-center">
                            {p.status === "active" ? (
                              <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap">Đang kinh doanh</span>
                            ) : (
                              <span className="bg-red-100 text-red-400 border border-red-200 px-3 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap">Ngừng bán</span>
                            )}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-0 whitespace-normal">
                              <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50">
                                <button onClick={() => setActiveDetailTab(prev => ({ ...prev, [p.id]: "info" }))}
                                  className={`cursor-pointer px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "info" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                                  Thông tin chung
                                </button>
                                <button onClick={() => setActiveDetailTab(prev => ({ ...prev, [p.id]: "variants" }))}
                                  className={`cursor-pointer px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "variants" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                                  Biến thể ({p.variants.length})
                                </button>
                              </div>
                              <div className="p-6">
                                {currentDetailTab === "info" && (
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                      <div className="flex flex-col border-b pb-2 md:col-span-2">
                                        <span className="text-gray-500">Mô tả ngắn:</span>
                                        <span className="font-medium text-gray-800">{p.shortDesc || "Không có"}</span>
                                      </div>
                                      <div className="flex border-b pb-2"><span className="w-32 text-gray-500">Giá gốc:</span><span className="text-gray-800">{formatPrice(p.cost)}</span></div>
                                      <div className="flex border-b pb-2"><span className="w-32 text-gray-500">Giá bán:</span><span className="text-blue-600 font-bold">{formatPrice(p.price)}</span></div>
                                    </div>
                                    <div className="flex flex-col gap-3 shrink-0 border-l pl-6 min-w-[140px]">
                                      <button onClick={() => handleEditClick(p)}
                                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition w-full text-center shadow-sm">
                                        Chỉnh sửa
                                      </button>
                                      <button onClick={() => setConfirmModal({
                                        isOpen: true, actionType: "toggleStatus", product: p,
                                        title: "Xác nhận",
                                        message: `Bạn muốn ${p.status === "active" ? "ngừng kinh doanh" : "mở bán lại"} sản phẩm ${p.name}?`,
                                      })}
                                        className="cursor-pointer px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-500 hover:text-white font-medium transition w-full text-center">
                                        {p.status === "active" ? "Ngừng KD" : "Mở bán lại"}
                                      </button>
                                      <button onClick={() => setConfirmModal({
                                        isOpen: true, actionType: "delete", product: p,
                                        title: "Cảnh báo xóa",
                                        message: `Bạn có chắc muốn xóa sản phẩm ${p.name}?`,
                                      })}
                                        className="cursor-pointer px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 font-medium transition w-full text-center">
                                        Xóa sản phẩm
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {currentDetailTab === "variants" && (
                                  <table className="w-full text-left text-sm border rounded-lg">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="p-3">SKU</th><th className="p-3">Màu sắc</th>
                                        <th className="p-3 text-right">Giá gốc</th><th className="p-3 text-right">Giá bán</th><th className="p-3 text-right">Tồn kho</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {p.variants.map((v) => (
                                        <tr key={v.sku} className="border-b bg-white">
                                          <td className="p-3 font-medium">{v.sku}</td>
                                          <td className="p-3">{v.mau_sac || "—"}</td>
                                          <td className="p-3 text-right">{formatPrice(v.gia_goc)}</td>
                                          <td className="p-3 text-right text-blue-600 font-medium">{formatPrice(v.gia_ban)}</td>
                                          <td className="p-3 text-right font-medium">{v.ton_kho}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
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
              Hiển thị <span className="font-semibold text-gray-800">{filteredProducts.length}</span> / {products.length} sản phẩm
              {hasActiveFilter && (
                <button onClick={clearAllFilters} className="ml-4 text-blue-500 hover:text-blue-700 font-medium cursor-pointer text-xs">
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

      <ProductModal
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
        activeTab={activeTab} setActiveTab={setActiveTab}
        formData={formData} handleBasicChange={handleBasicChange}
        handleArrayChange={handleArrayChange} addRow={addRow} removeRow={removeRow}
        handleSaveProduct={handleSaveProduct} editingProduct={editingProduct}
        categories={categories} suppliers={suppliers}
      />

      {/* Quick add modals */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Thêm Danh Mục</h3>
              <button onClick={() => setIsAddCategoryOpen(false)} className="text-2xl cursor-pointer hover:text-red-500">&times;</button>
            </div>
            <form onSubmit={handleQuickSaveCategory}>
              <div className="p-6"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium" placeholder="Tên danh mục..." autoFocus /></div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Thêm Nhà Cung Cấp</h3>
              <button onClick={() => setIsAddSupplierOpen(false)} className="text-2xl cursor-pointer hover:text-red-500">&times;</button>
            </div>
            <form onSubmit={handleQuickSaveSupplier}>
              <div className="p-6"><input type="text" value={newSupplierName} onChange={(e) => setNewSupplierName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium" placeholder="Tên nhà cung cấp..." autoFocus /></div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message}
        type={confirmModal.actionType === "delete" ? "danger" : "warning"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
};

export default Product;