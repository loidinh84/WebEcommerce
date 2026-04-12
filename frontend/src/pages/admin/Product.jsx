import React, { useEffect, useState } from "react";
import ProductModal from "./ProductModal";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import { toast } from "react-toastify";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const API_BASE = "${BASE_URL}";

// ── DỮ LIỆU MẪU FALLBACK ────────────────────────────────────────────────────
const mockProductsData = [
  {
    id: "SP001",
    ten_san_pham: "iPhone 16 Pro Max 256GB",
    thuong_hieu: "Apple",
    supplier: "Apple Vietnam",
    category: "Điện thoại di động",
    bien_the: [
      {
        sku: "IP16-256-TITAN",
        mau_sac: "Titan Đen",
        dung_luong: "256GB",
        ram: "8GB",
        gia_ban: 34990000,
        gia_goc: 30000000,
        ton_kho: 50,
        ma_mau_hex: "#2C2C2C",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "Màn hình",
        gia_tri: "6.9 inch OLED",
        nhom: "Màn hình",
        thu_tu: 1,
      },
      {
        ten_thuoc_tinh: "Chip",
        gia_tri: "Apple A18 Pro",
        nhom: "Hiệu năng",
        thu_tu: 2,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: true,
    mo_ta_ngan: "Flagship Apple mới nhất 2025, chip A18 Pro.",
    mo_ta_day_du:
      "iPhone 16 Pro Max là flagship cao cấp nhất của Apple năm 2025.",
    created_at: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "SP002",
    ten_san_pham: "iPhone 15 128GB",
    thuong_hieu: "Apple",
    supplier: "Apple Vietnam",
    category: "Điện thoại di động",
    bien_the: [
      {
        sku: "IP15-128-PINK",
        mau_sac: "Hồng",
        dung_luong: "128GB",
        ram: "6GB",
        gia_ban: 19990000,
        gia_goc: 17000000,
        ton_kho: 0,
        ma_mau_hex: "#FFB6C1",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "Màn hình",
        gia_tri: "6.1 inch OLED",
        nhom: "Màn hình",
        thu_tu: 1,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: false,
    mo_ta_ngan: "iPhone 15 tiêu chuẩn, camera 48MP.",
    mo_ta_day_du: "",
    created_at: "2025-02-01T00:00:00.000Z",
  },
  {
    id: "SP003",
    ten_san_pham: "Samsung Galaxy S24 Ultra",
    thuong_hieu: "Samsung",
    supplier: "Samsung Vietnam",
    category: "Điện thoại di động",
    bien_the: [
      {
        sku: "S24U-256-BLK",
        mau_sac: "Đen",
        dung_luong: "256GB",
        ram: "12GB",
        gia_ban: 27490000,
        gia_goc: 24000000,
        ton_kho: 20,
        ma_mau_hex: "#1a1a1a",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "Bút S Pen",
        gia_tri: "Tích hợp",
        nhom: "Tính năng",
        thu_tu: 1,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: true,
    mo_ta_ngan: "Flagship Samsung, bút S Pen tích hợp.",
    mo_ta_day_du: "",
    created_at: "2025-02-15T00:00:00.000Z",
  },
  {
    id: "SP004",
    ten_san_pham: "MacBook Air M3 13 inch",
    thuong_hieu: "Apple",
    supplier: "Apple Vietnam",
    category: "Laptop & Macbook",
    bien_the: [
      {
        sku: "MBA-M3-256",
        mau_sac: "Xám",
        dung_luong: "256GB",
        ram: "8GB",
        gia_ban: 27990000,
        gia_goc: 25000000,
        ton_kho: 15,
        ma_mau_hex: "#9EA3A8",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "Chip",
        gia_tri: "Apple M3",
        nhom: "Hiệu năng",
        thu_tu: 1,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: true,
    mo_ta_ngan: "Laptop siêu mỏng nhẹ, chip M3 mạnh mẽ.",
    mo_ta_day_du: "",
    created_at: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "SP005",
    ten_san_pham: "Laptop ASUS ROG Strix G15",
    thuong_hieu: "ASUS",
    supplier: "ASUS Global",
    category: "Laptop & Macbook",
    bien_the: [
      {
        sku: "ROG-G15-512",
        mau_sac: "Xám Eclipse",
        dung_luong: "512GB",
        ram: "16GB",
        gia_ban: 32990000,
        gia_goc: 30000000,
        ton_kho: 5,
        ma_mau_hex: "#3D3D3D",
        trang_thai: "active",
      },
      {
        sku: "ROG-G15-1TB",
        mau_sac: "Xám Eclipse",
        dung_luong: "1TB",
        ram: "32GB",
        gia_ban: 38990000,
        gia_goc: 35000000,
        ton_kho: 3,
        ma_mau_hex: "#3D3D3D",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "GPU",
        gia_tri: "NVIDIA RTX 4070",
        nhom: "Hiệu năng",
        thu_tu: 1,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: false,
    mo_ta_ngan: "Gaming laptop cao cấp, RTX 4070.",
    mo_ta_day_du: "",
    created_at: "2025-03-10T00:00:00.000Z",
  },
  {
    id: "SP006",
    ten_san_pham: "Laptop ASUS TUF Gaming F15",
    thuong_hieu: "ASUS",
    supplier: "ASUS Global",
    category: "Laptop & Macbook",
    bien_the: [
      {
        sku: "TUF-F15-512",
        mau_sac: "Đen",
        dung_luong: "512GB",
        ram: "16GB",
        gia_ban: 22000000,
        gia_goc: 20000000,
        ton_kho: 10,
        ma_mau_hex: "#111111",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [],
    hinh_anh: [],
    trang_thai: "inactive",
    noi_bat: false,
    mo_ta_ngan: "Laptop gaming quốc dân, cấu hình cực mạnh.",
    mo_ta_day_du: "",
    created_at: "2025-03-20T00:00:00.000Z",
  },
  {
    id: "SP007",
    ten_san_pham: "Bàn phím cơ AKKO 3098B",
    thuong_hieu: "AKKO",
    supplier: "GearVN",
    category: "Phụ kiện - Bàn phím",
    bien_the: [
      {
        sku: "AK-3098B-HONG",
        mau_sac: "Hồng",
        dung_luong: "",
        ram: "",
        gia_ban: 1500000,
        gia_goc: 1200000,
        ton_kho: 15,
        ma_mau_hex: "#FF69B4",
        trang_thai: "active",
      },
    ],
    thuoc_tinh: [
      {
        ten_thuoc_tinh: "Switch",
        gia_tri: "Jelly Pink",
        nhom: "Phím",
        thu_tu: 1,
      },
    ],
    hinh_anh: [],
    trang_thai: "active",
    noi_bat: false,
    mo_ta_ngan: "Phím cơ giá sinh viên, switch Jelly Pink.",
    mo_ta_day_du: "",
    created_at: "2025-04-01T00:00:00.000Z",
  },
];

// ── MAP DỮ LIỆU API → STATE ──────────────────────────────────────────────────
const mapProduct = (p) => ({
  id: p.id,
  name: p.ten_san_pham,
  brand: p.thuong_hieu,
  supplier: p.supplier?.ten_nha_cung_cap || p.supplier || "Chưa cập nhật",
  category: p.category?.ten_danh_muc || p.category || "Chưa cập nhật",
  price: p.bien_the?.[0]?.gia_ban ?? 0,
  cost: p.bien_the?.[0]?.gia_goc ?? 0,
  stock: p.bien_the?.reduce((t, bt) => t + (Number(bt.ton_kho) || 0), 0) ?? 0,
  status: p.trang_thai,
  isFeatured: p.noi_bat,
  shortDesc: p.mo_ta_ngan,
  fullDesc: p.mo_ta_day_du,
  variants: p.bien_the || [],
  attributes: p.thuoc_tinh || [],
  images: p.hinh_anh || [],
  createdAt: p.created_at,
  luot_mua: p.luot_mua || 0,
  rawData: p,
});

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── BỘ LỌC ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [productTab, setProductTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  // ────────────────────────────────────────────────────────

  const [categories, setCategories] = useState([
    { id: 7, name: "Điện thoại di động" },
    { id: 8, name: "Laptop & Macbook" },
    { id: 9, name: "Phụ kiện - Bàn phím" },
  ]);
  const [suppliers, setSuppliers] = useState([
    { id: 3, name: "Apple Vietnam" },
    { id: 4, name: "ASUS Global" },
    { id: 5, name: "GearVN" },
    { id: 6, name: "Samsung Vietnam" },
  ]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    product: null,
    title: "",
    message: "",
  });

  const emptyFormData = {
    ten_san_pham: "",
    thuong_hieu: "",
    danh_muc_id: "",
    nha_cung_cap_id: "",
    trang_thai: "active",
    mo_ta_ngan: "",
    mo_ta_day_du: "",
    noi_bat: false,
    thuoc_tinh: [{ ten_thuoc_tinh: "", gia_tri: "", nhom: "", thu_tu: 1 }],
    bien_the: [
      {
        sku: "",
        mau_sac: "",
        dung_luong: "",
        ram: "",
        gia_goc: 0,
        gia_ban: 0,
        ton_kho: 0,
        ma_mau_hex: "",
        trang_thai: "active",
      },
    ],
    hinh_anh: [],
  };
  const [formData, setFormData] = useState(emptyFormData);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ── FETCH ────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE}/api/sanpham`);
      setProducts(res.data.map(mapProduct));
    } catch {
      setProducts(mockProductsData.map(mapProduct));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  // ────────────────────────────────────────────────────────

  // ── BỘ LỌC ──────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    if (productTab === "active" && p.status !== "active") return false;
    if (productTab === "inactive" && p.status !== "inactive") return false;
    if (productTab === "out_of_stock" && p.stock > 0) return false;
    if (productTab === "featured" && !p.isFeatured) return false;
    if (
      searchTerm &&
      !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory)
      return false;
    if (selectedSupplier !== "all" && p.supplier !== selectedSupplier)
      return false;
    if (filterStatus === "active" && p.status !== "active") return false;
    if (filterStatus === "inactive" && p.status !== "inactive") return false;
    if (stockFilter === "in_stock" && p.stock <= 0) return false;
    if (stockFilter === "out_of_stock" && p.stock > 0) return false;
    return true;
  });

  const countTab = (tab) => {
    if (tab === "all") return products.length;
    if (tab === "active")
      return products.filter((p) => p.status === "active").length;
    if (tab === "inactive")
      return products.filter((p) => p.status === "inactive").length;
    if (tab === "out_of_stock")
      return products.filter((p) => p.stock === 0).length;
    if (tab === "featured") return products.filter((p) => p.isFeatured).length;
    return 0;
  };
  const countByCategory = (cat) =>
    cat === "all"
      ? products.length
      : products.filter((p) => p.category === cat).length;
  const countBySupplier = (sup) =>
    sup === "all"
      ? products.length
      : products.filter((p) => p.supplier === sup).length;
  const countByStatus = (s) =>
    s === "all"
      ? products.length
      : products.filter((p) => p.status === s).length;
  const countByStock = (s) => {
    if (s === "all") return products.length;
    if (s === "in_stock") return products.filter((p) => p.stock > 0).length;
    if (s === "out_of_stock")
      return products.filter((p) => p.stock === 0).length;
    return 0;
  };

  const hasActiveFilter =
    selectedCategory !== "all" ||
    selectedSupplier !== "all" ||
    filterStatus !== "all" ||
    stockFilter !== "all" ||
    searchTerm !== "";

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedSupplier("all");
    setFilterStatus("all");
    setStockFilter("all");
    setSearchTerm("");
  };
  // ────────────────────────────────────────────────────────

  // ── HANDLERS ────────────────────────────────────────────
  const handleQuickSaveCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim())
      return toast.warning("Vui lòng nhập tên danh mục!");
    setCategories([...categories, { id: Date.now(), name: newCategoryName }]);
    toast.success("Đã thêm danh mục: " + newCategoryName);
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
  };

  const handleQuickSaveSupplier = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim())
      return toast.warning("Vui lòng nhập tên nhà cung cấp!");
    setSuppliers([...suppliers, { id: Date.now(), name: newSupplierName }]);
    toast.success("Đã thêm nhà cung cấp: " + newSupplierName);
    setIsAddSupplierOpen(false);
    setNewSupplierName("");
  };

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleArrayChange = (arrayName, index, field, value) => {
    const arr = [...formData[arrayName]];
    arr[index][field] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: arr }));
  };
  const addRow = (n, obj) =>
    setFormData((prev) => ({ ...prev, [n]: [...prev[n], obj] }));
  const removeRow = (n, index) =>
    setFormData((prev) => ({
      ...prev,
      [n]: prev[n].filter((_, i) => i !== index),
    }));

  // ── LƯU SẢN PHẨM ────────────────────────────────────────
  const handleSaveProduct = async () => {
    if (!formData.ten_san_pham.trim())
      return toast.warning("Tên sản phẩm không được để trống!");

    const dataToSend = new FormData();
    dataToSend.append("ten_san_pham", formData.ten_san_pham);
    dataToSend.append("thuong_hieu", formData.thuong_hieu);
    dataToSend.append("danh_muc_id", formData.danh_muc_id);
    dataToSend.append("nha_cung_cap_id", formData.nha_cung_cap_id);
    dataToSend.append("trang_thai", formData.trang_thai);
    dataToSend.append("mo_ta_ngan", formData.mo_ta_ngan);
    dataToSend.append("mo_ta_day_du", formData.mo_ta_day_du);
    dataToSend.append("noi_bat", formData.noi_bat);
    dataToSend.append("bien_the", JSON.stringify(formData.bien_the));
    dataToSend.append("thuoc_tinh", JSON.stringify(formData.thuoc_tinh));
    if (formData.hinh_anh?.length > 0)
      dataToSend.append("hinh_anh", JSON.stringify(formData.hinh_anh));
    uploadedFiles.forEach((file) => dataToSend.append("hinh_anh_files", file));

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    try {
      if (editingProduct) {
        await axios.put(
          `${API_BASE}/api/sanpham/${editingProduct.id}`,
          dataToSend,
          config,
        );
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_BASE}/api/sanpham`, dataToSend, config);
        toast.success("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false);
      setUploadedFiles([]);
      fetchProducts();
    } catch (error) {
      // Fallback cập nhật UI khi API lỗi (dev mode)
      const saved = {
        id: editingProduct?.id || `SP${Date.now()}`,
        name: formData.ten_san_pham,
        brand: formData.thuong_hieu,
        supplier:
          suppliers.find(
            (s) => String(s.id) === String(formData.nha_cung_cap_id),
          )?.name || "Chưa cập nhật",
        category:
          categories.find((c) => String(c.id) === String(formData.danh_muc_id))
            ?.name || "Chưa cập nhật",
        price: Number(formData.bien_the[0]?.gia_ban) || 0,
        cost: Number(formData.bien_the[0]?.gia_goc) || 0,
        stock: formData.bien_the.reduce(
          (s, bt) => s + (Number(bt.ton_kho) || 0),
          0,
        ),
        status: formData.trang_thai,
        isFeatured: formData.noi_bat,
        shortDesc: formData.mo_ta_ngan,
        fullDesc: formData.mo_ta_day_du,
        variants: formData.bien_the,
        attributes: formData.thuoc_tinh,
        images: formData.hinh_anh,
        createdAt: new Date().toISOString(),
        rawData: formData,
      };
      if (editingProduct) {
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? saved : p)),
        );
        toast.success("Đã cập nhật (UI)");
      } else {
        setProducts([saved, ...products]);
        toast.success("Đã thêm (UI)");
      }
      setIsModalOpen(false);
      setUploadedFiles([]);
    }
  };

  const executeConfirmAction = async () => {
    const pid = confirmModal.product.id;
    try {
      if (confirmModal.actionType === "delete") {
        await axios.delete(`${API_BASE}/api/sanpham/${pid}`);
        toast.success("Xóa thành công!");
        setProducts(products.filter((p) => p.id !== pid));
      } else {
        await axios.put(`${API_BASE}/api/sanpham/${pid}/status`);
        toast.success("Cập nhật trạng thái thành công!");
        setProducts(
          products.map((p) =>
            p.id === pid
              ? { ...p, status: p.status === "active" ? "inactive" : "active" }
              : p,
          ),
        );
      }
    } catch {
      if (confirmModal.actionType === "delete") {
        setProducts(products.filter((p) => p.id !== pid));
        toast.success("Đã xóa (UI)");
      } else {
        setProducts(
          products.map((p) =>
            p.id === pid
              ? { ...p, status: p.status === "active" ? "inactive" : "active" }
              : p,
          ),
        );
        toast.success("Đã cập nhật (UI)");
      }
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
      setExpandedRows((prev) => prev.filter((r) => r !== pid));
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
    if (!activeDetailTab[id])
      setActiveDetailTab((prev) => ({ ...prev, [id]: "info" }));
  };

  const handleEditClick = async (product) => {
    setUploadedFiles([]);
    try {
      const res = await axios.get(`${API_BASE}/api/sanpham/${product.id}`);
      const d = res.data;
      setEditingProduct(product);
      setFormData({
        ten_san_pham: d.ten_san_pham || "",
        thuong_hieu: d.thuong_hieu || "",
        danh_muc_id: d.danh_muc_id || "",
        nha_cung_cap_id: d.nha_cung_cap_id || "",
        trang_thai: d.trang_thai || "active",
        mo_ta_ngan: d.mo_ta_ngan || "",
        mo_ta_day_du: d.mo_ta_day_du || "",
        noi_bat: d.noi_bat || false,
        thuoc_tinh:
          d.thuoc_tinh?.length > 0 ? d.thuoc_tinh : emptyFormData.thuoc_tinh,
        bien_the: d.bien_the?.length > 0 ? d.bien_the : emptyFormData.bien_the,
        hinh_anh: d.hinh_anh?.length > 0 ? d.hinh_anh : [],
      });
    } catch {
      setEditingProduct(product);
      setFormData({
        ten_san_pham: product.name || "",
        thuong_hieu: product.brand || "",
        danh_muc_id:
          categories.find((c) => c.name === product.category)?.id || "",
        nha_cung_cap_id:
          suppliers.find((s) => s.name === product.supplier)?.id || "",
        trang_thai: product.status || "active",
        mo_ta_ngan: product.shortDesc || "",
        mo_ta_day_du: product.fullDesc || "",
        noi_bat: product.isFeatured || false,
        thuoc_tinh:
          product.attributes?.length > 0
            ? product.attributes
            : emptyFormData.thuoc_tinh,
        bien_the:
          product.variants?.length > 0
            ? product.variants
            : emptyFormData.bien_the,
        hinh_anh: product.images?.length > 0 ? product.images : [],
      });
    }
    setIsModalOpen(true);
    setActiveTab(1);
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
              type="text"
              placeholder="Tên, thương hiệu..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* -- Danh mục -- */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="text-gray-400 hover:text-blue-600 text-xl cursor-pointer font-medium leading-none"
                title="Thêm danh mục"
              >
                +
              </button>
            </div>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ].map((item) => (
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
              <button
                onClick={() => setIsAddSupplierOpen(true)}
                className="text-gray-400 hover:text-blue-600 text-xl cursor-pointer font-medium leading-none"
                title="Thêm nhà cung cấp"
              >
                +
              </button>
            </div>
            <div className="space-y-0.5 text-sm">
              {[
                { value: "all", label: "Tất cả" },
                ...suppliers.map((s) => ({ value: s.name, label: s.name })),
              ].map((item) => (
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
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Đang kinh doanh" },
                { value: "inactive", label: "Ngừng kinh doanh" },
              ].map((item) => (
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
                { value: "all", label: "Tất cả" },
                { value: "in_stock", label: "Còn hàng" },
                { value: "out_of_stock", label: "Hết hàng" },
              ].map((item) => (
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
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng sản phẩm</span>
                <span className="font-bold text-gray-800">
                  {products.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đang kinh doanh</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("active")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngừng kinh doanh</span>
                <span className="font-bold text-gray-800">
                  {countByStatus("inactive")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hết hàng</span>
                <span className="font-bold text-red-500">
                  {countByStock("out_of_stock")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sản phẩm nổi bật</span>
                <span className="font-bold text-yellow-600">
                  {countTab("featured")}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-2 mt-1">
                {/* Bán chạy nhất (top 3 theo luot_mua) */}
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Bán chạy nhất
                </p>
                {[...products]
                  .filter((p) => (p.luot_mua || 0) > 0)
                  .sort((a, b) => (b.luot_mua || 0) - (a.luot_mua || 0))
                  .slice(0, 3)
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center py-1"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0
                          ${
                            i === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : i === 1
                                ? "bg-gray-100 text-gray-600"
                                : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          #{i + 1}
                        </span>
                        <span className="text-xs text-gray-700 truncate">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 shrink-0 ml-1">
                        {(p.luot_mua || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                {products.filter((p) => (p.luot_mua || 0) > 0).length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    Chưa có dữ liệu lượt mua.
                  </p>
                )}
              </div>

              {/* Giá trị cao nhất */}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Giá trị cao nhất
                </p>
                {[...products]
                  .sort((a, b) => b.price - a.price)
                  .slice(0, 3)
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center py-1"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0
                          ${
                            i === 0
                              ? "bg-purple-100 text-purple-700"
                              : i === 1
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          #{i + 1}
                        </span>
                        <span className="text-xs text-gray-700 truncate">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-purple-600 shrink-0 ml-1">
                        {new Intl.NumberFormat("vi-VN", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(p.price)}
                        đ
                      </span>
                    </div>
                  ))}

                {/* Tổng số sản phẩm trên 10 triệu */}
                <div className="mt-2 pt-2 border-t border-dashed border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Trên 10 triệu</span>
                  <span className="text-xs font-bold text-purple-600">
                    {products.filter((p) => p.price >= 10000000).length} SP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Trên 20 triệu</span>
                  <span className="text-xs font-bold text-purple-600">
                    {products.filter((p) => p.price >= 20000000).length} SP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Trên 30 triệu</span>
                  <span className="text-xs font-bold text-purple-600">
                    {products.filter((p) => p.price >= 30000000).length} SP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ================================================ */}
        {/* CỘT PHẢI: BẢNG DỮ LIỆU                          */}
        {/* ================================================ */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách sản phẩm
            </h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setActiveTab(1);
                setEditingProduct(null);
                setFormData({ ...emptyFormData });
                setUploadedFiles([]);
              }}
              className="bg-[#4caf50] hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm cursor-pointer"
            >
              + Thêm sản phẩm
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0 overflow-x-auto hide-scrollbar">
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Đang kinh doanh" },
              { key: "inactive", label: "Ngừng kinh doanh" },
              { key: "out_of_stock", label: "Hết hàng" },
              { key: "featured", label: "Nổi bật" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setProductTab(tab.key)}
                className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap
                  ${productTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                {tab.label} ({countTab(tab.key)})
              </button>
            ))}
          </div>

          {/* Bảng */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-gray-50 text-gray-600 z-10 text-sm">
                <tr>
                  <th className="py-3 px-5 font-bold border-b border-gray-200">
                    Mã & Tên sản phẩm
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-gray-200">
                    Danh mục
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-gray-200">
                    Nhà cung cấp
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-gray-200 text-right">
                    Giá bán
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-gray-200 text-center w-24">
                    Tồn kho
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-gray-200 text-center w-36">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isExpanded = expandedRows.includes(p.id);
                    const currentDetailTab = activeDetailTab[p.id] || "info";
                    return (
                      <React.Fragment key={p.id}>
                        {/* ── DÒNG CHÍNH ── */}
                        <tr
                          onClick={() => toggleRow(p.id)}
                          className={`cursor-pointer transition-colors border-b border-gray-200
                            ${isExpanded ? "bg-blue-50/40" : "hover:bg-gray-50 bg-white"}`}
                        >
                          <td className="py-3 px-5">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {p.name}
                              {p.isFeatured && (
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded border border-yellow-300 font-bold whitespace-nowrap">
                                  Nổi bật
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              Mã: {p.id} · {p.brand}
                            </div>
                          </td>
                          <td className="py-3 px-5 text-gray-600 text-sm">
                            {p.category}
                          </td>
                          <td className="py-3 px-5 text-gray-600 text-sm">
                            {p.supplier}
                          </td>
                          <td className="py-3 px-5 text-right font-bold text-gray-800">
                            {formatPrice(p.price)}
                          </td>
                          <td className="py-3 px-5 text-center font-bold">
                            {p.stock <= 0 ? (
                              <span className="text-red-500">Hết hàng</span>
                            ) : (
                              <span className="text-gray-800">{p.stock}</span>
                            )}
                          </td>
                          <td className="py-3 px-5 text-center">
                            {p.status === "active" ? (
                              <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
                                Đang KD
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-500 border border-red-200 px-3 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">
                                Ngừng bán
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* ── DÒNG CHI TIẾT MỞ RỘNG ── */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200">
                            <td colSpan="6" className="p-0 whitespace-normal">
                              {/* Sub-tabs */}
                              <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50 gap-1">
                                {[
                                  { key: "info", label: "Thông tin" },
                                  {
                                    key: "variants",
                                    label: `Biến thể (${p.variants.length})`,
                                  },
                                  {
                                    key: "attributes",
                                    label: `Thuộc tính (${p.attributes.length})`,
                                  },
                                  {
                                    key: "images",
                                    label: `Hình ảnh (${p.images.length})`,
                                  },
                                ].map((tab) => (
                                  <button
                                    key={tab.key}
                                    onClick={() =>
                                      setActiveDetailTab((prev) => ({
                                        ...prev,
                                        [p.id]: tab.key,
                                      }))
                                    }
                                    className={`cursor-pointer px-4 py-2 text-sm font-semibold border-b-2 transition-colors
                                      ${
                                        currentDetailTab === tab.key
                                          ? "border-blue-600 text-blue-600 bg-white"
                                          : "border-transparent text-gray-500 hover:text-gray-800"
                                      }`}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>

                              <div className="p-5">
                                {/* TAB: THÔNG TIN */}
                                {currentDetailTab === "info" && (
                                  <div className="flex flex-col xl:flex-row gap-5">
                                    {/* Thông tin cơ bản */}
                                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-5">
                                      <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-4 border-b pb-2">
                                        Thông tin cơ bản
                                      </h4>
                                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Tên sản phẩm
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {p.name}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Thương hiệu
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {p.brand || "—"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Danh mục
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {p.category}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Nhà cung cấp
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {p.supplier}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Giá gốc (nhập)
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {formatPrice(p.cost)} ₫
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Giá bán
                                          </p>
                                          <p className="font-bold text-blue-600">
                                            {formatPrice(p.price)} ₫
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Tổng tồn kho
                                          </p>
                                          <p
                                            className={`font-bold ${p.stock === 0 ? "text-red-500" : "text-gray-900"}`}
                                          >
                                            {p.stock === 0
                                              ? "Hết hàng"
                                              : `${p.stock} sản phẩm`}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Nổi bật
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {p.isFeatured ? "✓ Có" : "Không"}
                                          </p>
                                        </div>
                                        <div className="col-span-2">
                                          <p className="text-gray-500 text-xs mb-0.5">
                                            Mô tả ngắn
                                          </p>
                                          <p className="text-gray-700">
                                            {p.shortDesc || (
                                              <span className="italic text-gray-400">
                                                Chưa có mô tả
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        {p.fullDesc && (
                                          <div className="col-span-2">
                                            <p className="text-gray-500 text-xs mb-0.5">
                                              Mô tả đầy đủ
                                            </p>
                                            <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
                                              {p.fullDesc}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Thao tác */}
                                    <div className="w-full xl:w-44 shrink-0 flex flex-col gap-2.5">
                                      <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-1 border-b pb-2">
                                        Thao tác
                                      </h4>
                                      <button
                                        onClick={() => handleEditClick(p)}
                                        className="cursor-pointer w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs uppercase tracking-wide transition shadow-sm"
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        onClick={() =>
                                          setConfirmModal({
                                            isOpen: true,
                                            actionType: "toggleStatus",
                                            product: p,
                                            title: "Xác nhận thay đổi",
                                            message: `${p.status === "active" ? "Ngừng kinh doanh" : "Mở bán lại"} sản phẩm "${p.name}"?`,
                                          })
                                        }
                                        className="cursor-pointer w-full py-2.5 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition"
                                      >
                                        {p.status === "active"
                                          ? "Ngừng KD"
                                          : "Mở bán lại"}
                                      </button>
                                      <button
                                        onClick={() =>
                                          setConfirmModal({
                                            isOpen: true,
                                            actionType: "delete",
                                            product: p,
                                            title: "Cảnh báo xóa sản phẩm",
                                            message: `Bạn có chắc muốn xóa sản phẩm "${p.name}"? Hành động này không thể hoàn tác.`,
                                          })
                                        }
                                        className="cursor-pointer w-full py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg font-bold text-xs uppercase tracking-wide transition mt-auto"
                                      >
                                        Xóa sản phẩm
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* TAB: BIẾN THỂ */}
                                {currentDetailTab === "variants" && (
                                  <div>
                                    {p.variants.length === 0 ? (
                                      <p className="text-gray-500 italic text-sm text-center py-6">
                                        Chưa có biến thể nào.
                                      </p>
                                    ) : (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border rounded-lg overflow-hidden min-w-max">
                                          <thead className="bg-gray-100">
                                            <tr>
                                              <th className="p-3 font-bold text-gray-700">
                                                SKU
                                              </th>
                                              <th className="p-3 font-bold text-gray-700">
                                                Màu sắc
                                              </th>
                                              <th className="p-3 font-bold text-gray-700">
                                                Dung lượng
                                              </th>
                                              <th className="p-3 font-bold text-gray-700">
                                                RAM
                                              </th>
                                              <th className="p-3 font-bold text-gray-700 text-right">
                                                Giá gốc
                                              </th>
                                              <th className="p-3 font-bold text-gray-700 text-right">
                                                Giá bán
                                              </th>
                                              <th className="p-3 font-bold text-gray-700 text-center">
                                                Tồn kho
                                              </th>
                                              <th className="p-3 font-bold text-gray-700 text-center">
                                                Trạng thái
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {p.variants.map((v, idx) => (
                                              <tr
                                                key={idx}
                                                className="border-t bg-white hover:bg-gray-50"
                                              >
                                                <td className="p-3 font-mono text-xs font-semibold text-gray-700">
                                                  {v.sku || "—"}
                                                </td>
                                                <td className="p-3">
                                                  <div className="flex items-center gap-2">
                                                    {v.ma_mau_hex && (
                                                      <span
                                                        className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                                                        style={{
                                                          backgroundColor:
                                                            v.ma_mau_hex,
                                                        }}
                                                      />
                                                    )}
                                                    <span>
                                                      {v.mau_sac || "—"}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td className="p-3">
                                                  {v.dung_luong || "—"}
                                                </td>
                                                <td className="p-3">
                                                  {v.ram || "—"}
                                                </td>
                                                <td className="p-3 text-right text-gray-600">
                                                  {formatPrice(v.gia_goc)} ₫
                                                </td>
                                                <td className="p-3 text-right font-bold text-blue-600">
                                                  {formatPrice(v.gia_ban)} ₫
                                                </td>
                                                <td className="p-3 text-center font-bold">
                                                  {Number(v.ton_kho) === 0 ? (
                                                    <span className="text-red-500">
                                                      Hết
                                                    </span>
                                                  ) : (
                                                    <span className="text-gray-800">
                                                      {v.ton_kho}
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="p-3 text-center">
                                                  <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded ${v.trang_thai === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                                  >
                                                    {v.trang_thai === "active"
                                                      ? "Hiện"
                                                      : "Ẩn"}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* TAB: THUỘC TÍNH */}
                                {currentDetailTab === "attributes" && (
                                  <div>
                                    {p.attributes.length === 0 ? (
                                      <p className="text-gray-500 italic text-sm text-center py-6">
                                        Chưa có thuộc tính nào.
                                      </p>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {p.attributes
                                          .sort(
                                            (a, b) =>
                                              (a.thu_tu || 0) - (b.thu_tu || 0),
                                          )
                                          .map((attr, idx) => (
                                            <div
                                              key={idx}
                                              className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                                            >
                                              <span className="text-gray-500 text-xs font-semibold">
                                                {attr.nhom
                                                  ? `[${attr.nhom}] `
                                                  : ""}
                                                {attr.ten_thuoc_tinh}
                                              </span>
                                              <span className="font-bold text-gray-800 text-sm text-right ml-3">
                                                {attr.gia_tri}
                                              </span>
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* TAB: HÌNH ẢNH */}
                                {currentDetailTab === "images" && (
                                  <div>
                                    {p.images.length === 0 ? (
                                      <p className="text-gray-500 italic text-sm text-center py-6">
                                        Chưa có hình ảnh nào.
                                      </p>
                                    ) : (
                                      <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-3">
                                        {p.images
                                          .sort(
                                            (a, b) =>
                                              (a.thu_tu || 0) - (b.thu_tu || 0),
                                          )
                                          .map((img, idx) => (
                                            <div
                                              key={idx}
                                              className={`relative rounded-lg overflow-hidden border-2 ${img.la_anh_chinh ? "border-blue-500" : "border-gray-200"}`}
                                            >
                                              <img
                                                src={`${API_BASE}${img.url_anh}`}
                                                alt={img.alt_text || p.name}
                                                className="w-full h-24 object-cover"
                                                onError={(e) => {
                                                  e.target.src =
                                                    "https://via.placeholder.com/100x100?text=No+Image";
                                                }}
                                              />
                                              {img.la_anh_chinh && (
                                                <span className="absolute top-0 left-0 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 font-bold">
                                                  Chính
                                                </span>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </div>
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
              Hiển thị{" "}
              <span className="font-semibold text-gray-800">
                {filteredProducts.length}
              </span>{" "}
              / {products.length} sản phẩm
              {hasActiveFilter && (
                <button
                  onClick={clearAllFilters}
                  className="ml-4 text-blue-500 hover:text-blue-700 font-medium cursor-pointer text-xs"
                >
                  ✕ Xóa tất cả bộ lọc
                </button>
              )}
            </span>
            <div className="flex gap-1.5 items-center">
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &laquo;
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &lt;
              </button>
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &gt;
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors cursor-pointer">
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL THÊM/SỬA SẢN PHẨM ── */}
      <ProductModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormData={setFormData}
        handleBasicChange={handleBasicChange}
        handleArrayChange={handleArrayChange}
        addRow={addRow}
        removeRow={removeRow}
        handleSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
        suppliers={suppliers}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {/* ── QUICK ADD MODALS ── */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Thêm Danh Mục</h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-2xl cursor-pointer hover:text-red-500 leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleQuickSaveCategory}>
              <div className="p-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium"
                  placeholder="Tên danh mục..."
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700"
                >
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Thêm Nhà Cung Cấp</h3>
              <button
                onClick={() => setIsAddSupplierOpen(false)}
                className="text-2xl cursor-pointer hover:text-red-500 leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleQuickSaveSupplier}>
              <div className="p-6">
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 font-medium"
                  placeholder="Tên nhà cung cấp..."
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="flex-1 py-2 bg-white border rounded-xl font-bold cursor-pointer hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700"
                >
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.actionType === "delete" ? "danger" : "warning"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
};

export default Product;
