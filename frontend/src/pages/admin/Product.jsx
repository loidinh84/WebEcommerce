import React, { useEffect, useState } from "react";
import ProductModal from "./ProductModal";
import * as Icons from "../../assets/icons/index";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import { toast } from "react-toastify";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

// ==============================================================
// DỮ LIỆU MẪU ĐỂ TEST BỘ LỌC VÀ UI KHI CHƯA CÓ BACKEND
// ==============================================================
const mockProductsData = [
  { id: "SP001", ten_san_pham: "iPhone 15 Pro Max 256GB", thuong_hieu: "Apple", supplier: "Apple Vietnam", category: "Điện thoại di động", bien_the: [{ sku: "IP15-256", mau_sac: "Titan", dung_luong: "256GB", ram: "8GB", gia_ban: 29990000, gia_goc: 25000000, ton_kho: 50 }], trang_thai: "active", noi_bat: true, mo_ta_ngan: "Flagship Apple mới nhất." },
  { id: "SP002", ten_san_pham: "MacBook Air M2 13 inch", thuong_hieu: "Apple", supplier: "Apple Vietnam", category: "Laptop & Macbook", bien_the: [{ sku: "MBA-M2", mau_sac: "Xám", dung_luong: "256GB", ram: "8GB", gia_ban: 18990000, gia_goc: 17000000, ton_kho: 0 }], trang_thai: "active", noi_bat: false, mo_ta_ngan: "Laptop siêu mỏng nhẹ." },
  { id: "SP003", ten_san_pham: "Bàn phím cơ AKKO 3098B", thuong_hieu: "AKKO", supplier: "GearVN", category: "Phụ kiện - Bàn phím", bien_the: [{ sku: "AK-3098B", mau_sac: "Hồng", dung_luong: "", ram: "", gia_ban: 1500000, gia_goc: 1200000, ton_kho: 15 }], trang_thai: "inactive", noi_bat: false, mo_ta_ngan: "Phím cơ giá sinh viên." },
  { id: "SP004", ten_san_pham: "Laptop ASUS TUF Gaming F15", thuong_hieu: "ASUS", supplier: "ASUS Global", category: "Laptop & Macbook", bien_the: [{ sku: "TUF-F15", mau_sac: "Đen", dung_luong: "512GB", ram: "16GB", gia_ban: 22000000, gia_goc: 20000000, ton_kho: 10 }], trang_thai: "active", noi_bat: true, mo_ta_ngan: "Laptop gaming quốc dân, cấu hình cực mạnh, tản nhiệt tốt." },
  { id: "SP005", ten_san_pham: "Chuột Logitech G102", thuong_hieu: "Logitech", supplier: "GearVN", category: "Phụ kiện - Bàn phím", bien_the: [{ sku: "LOGI-G102", mau_sac: "Đen", dung_luong: "", ram: "", gia_ban: 390000, gia_goc: 300000, ton_kho: 100 }], trang_thai: "active", noi_bat: false, mo_ta_ngan: "Chuột gaming giá rẻ." },
];

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [productTab, setProductTab] = useState("all"); 
  const [selectedCategory, setSelectedCategory] = useState("all");
  // STATE MỚI CHO BỘ LỌC
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'inactive'
  const [stockFilter, setStockFilter] = useState("all");

  const [categories, setCategories] = useState([
    { id: "DM001", name: "Điện thoại di động" },
    { id: "DM002", name: "Laptop & Macbook" },
    { id: "DM003", name: "Phụ kiện - Bàn phím" }
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: "NCC001", name: "Apple Vietnam" },
    { id: "NCC002", name: "ASUS Global" },
    { id: "NCC003", name: "GearVN" }
  ]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");

  const handleQuickSaveCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return toast.warning("Vui lòng nhập tên danh mục!");
    const newCat = { id: `DM00${categories.length + 1}`, name: newCategoryName };
    setCategories([...categories, newCat]);
    toast.success("Đã thêm danh mục mới: " + newCategoryName);
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
  };

  const handleQuickSaveSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return toast.warning("Vui lòng nhập tên nhà cung cấp!");
    const newSup = { id: `NCC00${suppliers.length + 1}`, name: newSupplierName };
    setSuppliers([...suppliers, newSup]);
    toast.success("Đã thêm nhà cung cấp mới: " + newSupplierName);
    setIsAddSupplierOpen(false);
    setNewSupplierName("");
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/sanpham");
      mapAndSetProducts(response.data);
    } catch (error) {
      mapAndSetProducts(mockProductsData);
    } finally {
      setIsLoading(false);
    }
  };

  const mapAndSetProducts = (data) => {
    const mappedProducts = data.map((p) => ({
      id: p.id,
      name: p.ten_san_pham,
      brand: p.thuong_hieu,
      supplier: p.supplier?.ten_nha_cung_cap || p.supplier || "Chưa cập nhật",
      category: p.category?.ten_danh_muc || p.category || "Chưa cập nhật",
      price: p.bien_the && p.bien_the.length > 0 ? p.bien_the[0].gia_ban : 0,
      cost: p.bien_the && p.bien_the.length > 0 ? p.bien_the[0].gia_goc : 0,
      stock: p.bien_the ? p.bien_the.reduce((total, bt) => total + (Number(bt.ton_kho) || 0), 0) : 0,
      status: p.trang_thai,
      views: p.luot_xem || 0,
      isFeatured: p.noi_bat,
      shortDesc: p.mo_ta_ngan,
      variants: p.bien_the || [],
      attributes: p.thuoc_tinh || [],
      images: p.hinh_anh || [],
      rawData: p 
    }));
    setProducts(mappedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (productTab === "active" && p.status !== "active") return false;
    if (productTab === "out_of_stock" && p.stock > 0) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    
    // Lọc theo nhiều nhà cung cấp
    if (selectedSuppliers.length > 0 && !selectedSuppliers.includes("all") && !selectedSuppliers.includes(p.supplier)) return false;
    
    if (filterFeatured && !p.isFeatured) return false;
    
    // Logic mới cho Lọc trạng thái
    if (filterStatus === "active" && p.status !== "active") return false;
    if (filterStatus === "inactive" && p.status !== "inactive") return false;
    
    if (stockFilter === "in_stock" && p.stock <= 0) return false;
    if (stockFilter === "out_of_stock" && p.stock > 0) return false;
    return true;
  });

  const countActive = products.filter(p => p.status === "active").length;
  const countOutOfStock = products.filter(p => p.stock === 0).length;

  const toggleSupplierFilter = (supplierName) => {
    if (supplierName === "all") {
      setSelectedSuppliers(["all"]);
    } else {
      setSelectedSuppliers(prev => {
        const withoutAll = prev.filter(s => s !== "all");
        if (withoutAll.includes(supplierName)) {
           const newSelected = withoutAll.filter(s => s !== supplierName);
           return newSelected.length === 0 ? ["all"] : newSelected;
        } else {
           return [...withoutAll, supplierName];
        }
      });
    }
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, actionType: null, product: null, title: "", message: "" });

  const emptyFormData = {
    ten_san_pham: "", thuong_hieu: "", danh_muc_id: "", nha_cung_cap_id: "", trang_thai: "active", ton_kho: 0,
    mo_ta_ngan: "", mo_ta_day_du: "", noi_bat: false,
    thuoc_tinh: [{ ten_thuoc_tinh: "", gia_tri: "", nhom: "", thu_tu: 1 }],
    bien_the: [{ sku: "", mau_sac: "", dung_luong: "", gia_goc: 0, gia_ban: 0, ton_kho: 0 }],
    hinh_anh: [{ url_anh: "", alt_text: "", la_anh_chinh: true }],
  };

  const [formData, setFormData] = useState(emptyFormData);

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const addRow = (arrayName, emptyObject) => setFormData((prev) => ({ ...prev, [arrayName]: [...prev[arrayName], emptyObject] }));
  const removeRow = (arrayName, index) => setFormData((prev) => ({ ...prev, [arrayName]: formData[arrayName].filter((_, i) => i !== index) }));

  const handleSaveProduct = async () => {
    if (!formData.ten_san_pham.trim()) return toast.warning("Tên sản phẩm không được để trống!");

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/sanpham/${editingProduct.id}`, formData);
        toast.success("Lưu thành công!");
      } else {
        await axios.post("http://localhost:5000/api/sanpham", formData);
        toast.success("Thêm sản phẩm mới thành công");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      const mockSaved = {
        id: editingProduct ? editingProduct.id : `SP00${products.length + 10}`,
        name: formData.ten_san_pham,
        brand: formData.thuong_hieu,
        supplier: suppliers.find(s => s.id === formData.nha_cung_cap_id)?.name || "Chưa cập nhật",
        category: categories.find(c => c.id === formData.danh_muc_id)?.name || "Chưa cập nhật",
        price: formData.bien_the[0]?.gia_ban || 0,
        cost: formData.bien_the[0]?.gia_goc || 0,
        stock: formData.bien_the.reduce((sum, bt) => sum + (Number(bt.ton_kho) || 0), 0),
        status: formData.trang_thai,
        views: editingProduct ? editingProduct.views : 0,
        isFeatured: formData.noi_bat,
        shortDesc: formData.mo_ta_ngan,
        variants: formData.bien_the,
        attributes: formData.thuoc_tinh,
        images: formData.hinh_anh,
        rawData: formData
      };

      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? mockSaved : p));
        toast.success("Đã cập nhật sản phẩm (Bản nháp UI)");
      } else {
        setProducts([mockSaved, ...products]);
        toast.success("Đã thêm sản phẩm (Bản nháp UI)");
      }
      setIsModalOpen(false);
    }
  };

  const executeConfirmAction = async () => {
    const productId = confirmModal.product.id;
    try {
      if (confirmModal.actionType === "delete") {
        await axios.delete(`http://localhost:5000/api/sanpham/${productId}`);
        toast.success("Xóa sản phẩm thành công!");
      } else if (confirmModal.actionType === "toggleStatus") {
        await axios.put(`http://localhost:5000/api/sanpham/${productId}/status`);
        toast.success("Cập nhật trạng thái thành công!");
      }
      fetchProducts();
    } catch (error) {
      if (confirmModal.actionType === "delete") {
        setProducts(products.filter(p => p.id !== productId));
        toast.success("Đã xóa (Bản nháp UI)");
      } else if (confirmModal.actionType === "toggleStatus") {
        setProducts(products.map(p => p.id === productId ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
        toast.success("Đã cập nhật (Bản nháp UI)");
      }
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]);
    if (!activeDetailTab[id]) setActiveDetailTab((prev) => ({ ...prev, [id]: "info" }));
  };

  const handleEditClick = async (product) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sanpham/${product.id}`);
      const dbData = response.data;
      
      setEditingProduct(product);
      setFormData({
        ten_san_pham: dbData.ten_san_pham || "",
        thuong_hieu: dbData.thuong_hieu || "",
        danh_muc_id: dbData.danh_muc_id || "",
        nha_cung_cap_id: dbData.nha_cung_cap_id || "",
        trang_thai: dbData.trang_thai || "active",
        ton_kho: dbData.ton_kho || 0,
        mo_ta_ngan: dbData.mo_ta_ngan || "",
        mo_ta_day_du: dbData.mo_ta_day_du || "",
        noi_bat: dbData.noi_bat || false,
        thuoc_tinh: dbData.thuoc_tinh?.length > 0 ? dbData.thuoc_tinh : emptyFormData.thuoc_tinh,
        bien_the: dbData.bien_the?.length > 0 ? dbData.bien_the : emptyFormData.bien_the,
        hinh_anh: dbData.hinh_anh?.length > 0 ? dbData.hinh_anh : emptyFormData.hinh_anh,
      });
      setIsModalOpen(true);
      setActiveTab(1);
    } catch (error) {
      setEditingProduct(product);
      const raw = product.rawData || {};
      setFormData({
        ten_san_pham: product.name || "",
        thuong_hieu: product.brand || "",
        danh_muc_id: categories.find(c => c.name === product.category)?.id || "",
        nha_cung_cap_id: suppliers.find(s => s.name === product.supplier)?.id || "",
        trang_thai: product.status || "active",
        ton_kho: product.stock || 0,
        mo_ta_ngan: product.shortDesc || "",
        mo_ta_day_du: raw.mo_ta_day_du || "",
        noi_bat: product.isFeatured || false,
        thuoc_tinh: product.attributes?.length > 0 ? product.attributes : emptyFormData.thuoc_tinh,
        bien_the: product.variants?.length > 0 ? product.variants : emptyFormData.bien_the,
        hinh_anh: product.images?.length > 0 ? product.images : emptyFormData.hinh_anh,
      });
      setIsModalOpen(true);
      setActiveTab(1);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        
        {/* ========================================== */}
        {/* CỘT TRÁI: SIDEBAR LỌC */}
        {/* ========================================== */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-4 pr-1">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Tìm kiếm</h3>
            <input
              type="text" placeholder="Tên sản phẩm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
              <button onClick={() => setIsAddCategoryOpen(true)} className="text-gray-400 hover:text-blue-600 text-2xl cursor-pointer font-medium leading-none">+</button>
            </div>
            <div className="space-y-3 text-sm font-medium">
              <p onClick={() => setSelectedCategory("all")} className={`cursor-pointer transition-colors ${selectedCategory === "all" ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-600"}`}>Tất cả</p>
              {categories.map(cat => (
                <p key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`cursor-pointer transition-colors ${selectedCategory === cat.name ? "text-blue-600 font-bold" : "text-gray-500 hover:text-blue-600"}`}>
                  {cat.name}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Nhà cung cấp</h3>
              <button onClick={() => setIsAddSupplierOpen(true)} className="text-gray-400 hover:text-blue-600 text-2xl cursor-pointer font-medium leading-none">+</button>
            </div>
            <div className="space-y-3 text-sm text-gray-500 font-medium">
              {/* ĐÃ THÊM: Option Tất cả cho Nhà Cung Cấp */}
              <label className="flex items-center gap-3 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedSuppliers.length === 0 || selectedSuppliers.includes("all")} 
                  onChange={() => toggleSupplierFilter("all")} 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                /> 
                <span className={selectedSuppliers.length === 0 || selectedSuppliers.includes("all") ? "text-blue-600 font-bold" : "hover:text-blue-600"}>Tất cả</span>
              </label>
              {suppliers.map(sup => (
                <label key={sup.id} className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
                  <input type="checkbox" checked={selectedSuppliers.includes(sup.name)} onChange={() => toggleSupplierFilter(sup.name)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /> {sup.name}
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">Trạng thái hiển thị</h3>
            <div className="space-y-3 text-sm text-gray-500 font-medium">
              {/* ĐÃ SỬA: Chuyển Trạng thái về dạng Radio có option Tất cả */}
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="statusFilter" checked={filterStatus === "all"} onChange={() => setFilterStatus("all")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Tất cả
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="statusFilter" checked={filterStatus === "active"} onChange={() => setFilterStatus("active")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Đang kinh doanh
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="statusFilter" checked={filterStatus === "inactive"} onChange={() => setFilterStatus("inactive")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Ngừng kinh doanh
              </label>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">Tồn kho</h3>
            <div className="space-y-3 text-sm text-gray-500 font-medium">
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="stockFilter" checked={stockFilter === "all"} onChange={() => setStockFilter("all")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Tất cả
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="stockFilter" checked={stockFilter === "in_stock"} onChange={() => setStockFilter("in_stock")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Còn hàng
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                <input type="radio" name="stockFilter" checked={stockFilter === "out_of_stock"} onChange={() => setStockFilter("out_of_stock")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" /> Hết hàng
              </label>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CỘT PHẢI: BẢNG DỮ LIỆU SẢN PHẨM */}
        {/* ========================================== */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm</h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setActiveTab(1);
                setEditingProduct(null);
                setFormData({ ...emptyFormData });
              }}
              className="bg-[#4caf50] hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm cursor-pointer"
            >
              <span>+ Thêm sản phẩm</span>
            </button>
          </div>

          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0">
            <button onClick={() => setProductTab("all")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Tất cả ({products.length})</button>
            <button onClick={() => setProductTab("active")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Đang kinh doanh ({countActive})</button>
            <button onClick={() => setProductTab("out_of_stock")} className={`py-3 border-b-2 transition-colors cursor-pointer ${productTab === "out_of_stock" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Hết hàng ({countOutOfStock})</button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Mã & Tên SP</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Nhà cung cấp</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Danh mục</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200 text-right">Kho tổng</th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr><td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Đang tải dữ liệu...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="5" className="py-10 text-center text-red-500 font-medium">Không tìm thấy sản phẩm nào khớp với bộ lọc!</td></tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isExpanded = expandedRows.includes(p.id);
                    const currentDetailTab = activeDetailTab[p.id] || "info";

                    return (
                      <React.Fragment key={p.id}>
                        <tr onClick={() => toggleRow(p.id)} className={`cursor-pointer transition-colors group border-b border-gray-200 ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"}`}>
                          <td className="py-3 px-5">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {p.name}
                              {p.isFeatured && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded border border-yellow-300">Nổi bật</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Mã SP: {p.id} - Thương hiệu: {p.brand}</div>
                          </td>
                          <td className="py-3 px-5">{p.supplier}</td>
                          <td className="py-3 px-5">{p.category}</td>
                          <td className="py-3 px-5 text-right font-medium">{p.stock <= 0 ? <span className="text-red-500 font-bold">Hết hàng</span> : p.stock}</td>
                          <td className="py-3 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {p.status === "active" ? "Đang kinh doanh" : "Ngừng bán"}
                            </span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-0 whitespace-normal">
                              <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50">
                                <button onClick={() => setActiveDetailTab((prev) => ({ ...prev, [p.id]: "info" }))} className={`cursor-pointer px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "info" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Thông tin chung</button>
                                <button onClick={() => setActiveDetailTab((prev) => ({ ...prev, [p.id]: "variants" }))} className={`cursor-pointer px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "variants" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Bảng Biến Thể ({p.variants.length})</button>
                              </div>
                              <div className="p-6">
                                {currentDetailTab === "info" && (
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                      <div className="flex flex-col border-b pb-2 md:col-span-2"><span className="text-gray-500">Mô tả ngắn:</span><span className="font-medium text-gray-800">{p.shortDesc || "Không có"}</span></div>
                                      <div className="flex border-b pb-2"><span className="w-32 text-gray-500">Giá gốc:</span><span className="text-gray-800">{formatPrice(p.cost)}</span></div>
                                      <div className="flex border-b pb-2"><span className="w-32 text-gray-500">Giá bán:</span><span className="text-blue-600 font-bold">{formatPrice(p.price)}</span></div>
                                    </div>
                                    
                                    {/* ĐÃ SỬA: THÊM NÚT ĐỔI TRẠNG THÁI VÀO GIỮA SỬA & XÓA */}
                                    <div className="flex flex-col gap-3 shrink-0 border-l pl-6 min-w-[140px]">
                                      <button 
                                        onClick={() => handleEditClick(p)} 
                                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition w-full text-center shadow-sm"
                                      >
                                        Chỉnh sửa
                                      </button>

                                      <button 
                                        onClick={() => {
                                          const actionText = p.status === "active" ? "ngừng kinh doanh" : "mở bán lại";
                                          setConfirmModal({
                                            isOpen: true,
                                            actionType: "toggleStatus",
                                            product: p,
                                            title: "XÁC NHẬN",
                                            message: `Bạn muốn ${actionText} sản phẩm ${p.name}?`,
                                          });
                                        }} 
                                        className="cursor-pointer px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-500 hover:text-white font-medium transition w-full text-center"
                                      >
                                        {p.status === "active" ? "Ngừng KD" : "Mở bán lại"}
                                      </button>

                                      <button 
                                        onClick={() => {
                                          setConfirmModal({ isOpen: true, actionType: "delete", product: p, title: "CẢNH BÁO XÓA", message: `Bạn có chắc chắn muốn xóa sản phẩm ${p.name}?` });
                                        }} 
                                        className="cursor-pointer px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 font-medium transition w-full text-center"
                                      >
                                        Xóa sản phẩm
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {currentDetailTab === "variants" && (
                                  <table className="w-full text-left text-sm border rounded-lg">
                                    <thead className="bg-gray-100">
                                      <tr><th className="p-3">SKU</th><th className="p-3">Màu sắc</th><th className="p-3 text-right">Giá gốc</th><th className="p-3 text-right">Giá bán</th><th className="p-3 text-right">Tồn kho</th></tr>
                                    </thead>
                                    <tbody>
                                      {p.variants.map((v) => (
                                        <tr key={v.sku} className="border-b bg-white"><td className="p-3 font-medium">{v.sku}</td><td className="p-3">{v.mau_sac || "-"}</td><td className="p-3 text-right">{formatPrice(v.gia_goc)}</td><td className="p-3 text-right text-blue-600 font-medium">{formatPrice(v.gia_ban)}</td><td className="p-3 text-right font-medium">{v.ton_kho}</td></tr>
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

          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-600 shrink-0">
            <span>
              Hiển thị 1 - {filteredProducts.length} của {filteredProducts.length} sản phẩm
            </span>
            <div className="flex gap-1 items-center">
              <button className="cursor-pointer px-2 py-1 hover:bg-gray-200 rounded">&laquo;</button>
              <button className="cursor-pointer px-2 py-1 hover:bg-gray-200 rounded">&lt;</button>
              <button className="cursor-pointer px-3 py-1 bg-[#4caf50] text-white rounded font-bold">1</button>
              <button className="cursor-pointer px-2 py-1 hover:bg-gray-200 rounded">&gt;</button>
              <button className="cursor-pointer px-2 py-1 hover:bg-gray-200 rounded">&raquo;</button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        handleBasicChange={handleBasicChange}
        handleArrayChange={handleArrayChange}
        addRow={addRow}
        removeRow={removeRow}
        handleSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />

      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold">Thêm Danh Mục</h3><button onClick={() => setIsAddCategoryOpen(false)} className="text-2xl cursor-pointer hover:text-red-500">&times;</button></div>
            <form onSubmit={handleQuickSaveCategory}>
              <div className="p-6"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium" placeholder="Tên danh mục..." autoFocus /></div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3"><button type="button" onClick={() => setIsAddCategoryOpen(false)} className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100">Hủy</button><button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700">Tạo mới</button></div>
            </form>
          </div>
        </div>
      )}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold">Thêm Nhà Cung Cấp</h3><button onClick={() => setIsAddSupplierOpen(false)} className="text-2xl cursor-pointer hover:text-red-500">&times;</button></div>
            <form onSubmit={handleQuickSaveSupplier}>
              <div className="p-6"><input type="text" value={newSupplierName} onChange={(e) => setNewSupplierName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium" placeholder="Tên nhà cung cấp..." autoFocus /></div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3"><button type="button" onClick={() => setIsAddSupplierOpen(false)} className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100">Hủy</button><button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700">Tạo mới</button></div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} type={confirmModal.actionType === "delete" ? "danger" : "warning"} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={executeConfirmAction} />
    </div>
  );
};

export default Product;