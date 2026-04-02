import React, { useEffect, useState } from "react";
import SidebarFilter from "./SidebarFilter";
import ProductModal from "./ProductModal";
import * as Icons from "../../assets/icons/index";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productTab, setProductTab] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/sanpham");

      const mappedProducts = response.data.map((p) => ({
        id: p.id,
        name: p.ten_san_pham,
        brand: p.thuong_hieu,
        supplier: p.supplier?.ten_nha_cung_cap || "Chưa cập nhật",
        category: p.category?.ten_danh_muc || "Chưa cập nhật",
        price: p.bien_the && p.bien_the.length > 0 ? p.bien_the[0].gia_ban : 0,
        cost: p.bien_the && p.bien_the.length > 0 ? p.bien_the[0].gia_goc : 0,
        stock: p.bien_the
          ? p.bien_the.reduce((total, bt) => total + (bt.ton_kho || 0), 0)
          : 0,
        status: p.trang_thai,
        views: p.luot_xem || 0,
        isFeatured: p.noi_bat,
        shortDesc: p.mo_ta_ngan,
        variants: p.bien_the || [],
        attributes: p.thuoc_tinh || [],
        images: p.hinh_anh || [],
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      alert("Không thể kết nối đến Server!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // STATE CHO MODAL XÁC NHẬN
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    product: null,
    title: "",
    message: "",
  });

  // Khung dữ liệu rỗng
  const emptyFormData = {
    ten_san_pham: "",
    thuong_hieu: "",
    danh_muc_id: "",
    nha_cung_cap_id: "",
    trang_thai: "active",
    ton_kho: 0,
    mo_ta_ngan: "",
    mo_ta_day_du: "",
    noi_bat: false,
    thuoc_tinh: [{ ten_thuoc_tinh: "", gia_tri: "", nhom: "", thu_tu: 1 }],
    bien_the: [
      {
        sku: "",
        mau_sac: "",
        dung_luong: "",
        gia_goc: 0,
        gia_ban: 0,
        ton_kho: 0,
      },
    ],
    hinh_anh: [{ url_anh: "", alt_text: "", la_anh_chinh: true }],
  };

  const [formData, setFormData] = useState(emptyFormData);

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const addRow = (arrayName, emptyObject) =>
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyObject],
    }));

  const removeRow = (arrayName, index) =>
    setFormData((prev) => ({
      ...prev,
      [arrayName]: formData[arrayName].filter((_, i) => i !== index),
    }));

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // NẾU ĐANG CHỈNH SỬA -> GỌI API PUT
        await axios.put(
          `http://localhost:5000/api/sanpham/${editingProduct.id}`,
          formData,
        );
        showToast("Lưu thành công!", "success");
      } else {
        // NẾU LÀ THÊM MỚI -> GỌI API POST
        await axios.post("http://localhost:5000/api/sanpham", formData);
        showToast("Thêm sản phẩm mới thành công");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      showToast("Có lỗi xảy ra!");
    }
  };

  // HÀM XỬ LÝ KHI BẤM NÚT XÁC NHẬN TRONG MODAL CONFIRM
  const executeConfirmAction = async () => {
    try {
      const productId = confirmModal.product.id;
      if (confirmModal.actionType === "delete") {
        await axios.delete(`http://localhost:5000/api/sanpham/${productId}`);
        showToast("Xóa sản phẩm thành công!", "success");
      } else if (confirmModal.actionType === "toggleStatus") {
        await axios.put(
          `http://localhost:5000/api/sanpham/${productId}/status`,
        );
        showToast("Cập nhật trạng thái thành công!", "success");
      }
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  // Hàm mở/đóng dòng và thiết lập Tab mặc định là 'info'
  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
    if (!activeDetailTab[id]) {
      setActiveDetailTab((prev) => ({ ...prev, [id]: "info" }));
    }
  };

  const handleEditClick = async (product) => {
    try {
      // 1. Gọi API lấy dữ liệu FULL của sản phẩm từ Backend
      const response = await axios.get(
        `http://localhost:5000/api/sanpham/${product.id}`,
      );
      const dbData = response.data;

      // 2. Set tên sản phẩm đang sửa cho Tiêu đề Modal
      setEditingProduct(dbData);

      // 3. Đổ dữ liệu từ Database khớp vào Form
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
        // Nếu DB chưa có biến thể/thuộc tính thì nạp cái mảng rỗng mặc định 1 dòng vào
        thuoc_tinh:
          dbData.thuoc_tinh?.length > 0
            ? dbData.thuoc_tinh
            : emptyFormData.thuoc_tinh,
        bien_the:
          dbData.bien_the?.length > 0
            ? dbData.bien_the
            : emptyFormData.bien_the,
        hinh_anh:
          dbData.hinh_anh?.length > 0
            ? dbData.hinh_anh
            : emptyFormData.hinh_anh,
      });

      // 4. Mở Modal ở Tab 1
      setIsModalOpen(true);
      setActiveTab(1);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      alert("Không thể tải thông tin sản phẩm từ Server!");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2000,
    );
  };

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        {/* CỘT TRÁI: BỘ LỌC */}
        <SidebarFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* CỘT PHẢI: BẢNG DỮ LIỆU SẢN PHẨM */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
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
              }}
              className="bg-[#4caf50] hover:bg-green-600 text-white pl-2 pr-3 cursor-pointer px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <img
                src={Icons.Add}
                alt="Thêm sản phẩm"
                className="h-5 w-5 brightness-0 invert"
              />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          <div className="px-6 bg-white border-b border-gray-100 flex gap-6 text-sm font-medium shrink-0">
            <button
              onClick={() => setProductTab("all")}
              className={`py-3 border-b-2 transition-colors ${productTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              Tất cả ({products.length})
            </button>
            <button
              onClick={() => setProductTab("active")}
              className={`py-3 border-b-2 transition-colors ${productTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              Đang kinh doanh
            </button>
            <button
              onClick={() => setProductTab("out_of_stock")}
              className={`py-3 border-b-2 transition-colors ${productTab === "out_of_stock" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              Hết hàng (0)
            </button>
          </div>

          {/* KHUNG CHỨA BẢNG */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">
                    Mã & Tên SP
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">
                    Nhà cung cấp
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">
                    Danh mục
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200 text-right">
                    Kho tổng
                  </th>
                  <th className="py-3 px-5 font-bold border-b border-blue-200">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  /* TRẠNG THÁI 1: ĐANG TẢI DỮ LIỆU */
                  <tr>
                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  /* TRẠNG THÁI 2: KHÔNG CÓ DỮ LIỆU */
                  <tr>
                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-500 font-medium"
                    >
                      Chưa có sản phẩm nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isExpanded = expandedRows.includes(p.id);
                    const currentDetailTab = activeDetailTab[p.id] || "info";

                    return (
                      <React.Fragment key={p.id}>
                        {/* --- DÒNG CHÍNH --- */}
                        <tr
                          onClick={() => toggleRow(p.id)}
                          className={`cursor-pointer transition-colors group border-b border-gray-200 ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"}`}
                        >
                          <td className="py-3 px-5">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {p.name}
                              {p.isFeatured && (
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded border border-yellow-300">
                                  Nổi bật
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Mã SP: {p.id} - Thương hiệu: {p.brand}
                            </div>
                          </td>
                          <td className="py-3 px-5">{p.supplier}</td>
                          <td className="py-3 px-5">{p.category}</td>
                          <td className="py-3 px-5 text-right">
                            <span
                              className={
                                p.stock === 0
                                  ? "text-red-500 font-bold"
                                  : "font-medium"
                              }
                            >
                              {p.stock === 0 ? "Hết hàng" : `${p.stock} (SP)`}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            {/* Trạng thái */}
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${p.status === "active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
                            >
                              {p.status === "active"
                                ? "Đang kinh doanh"
                                : "Ngừng bán"}
                            </span>
                          </td>
                        </tr>

                        {/* --- DÒNG CHI TIẾT ĐA NĂNG --- */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-0 whitespace-normal">
                              {/* Header Tabs của Chi tiết */}
                              <div className="flex border-b border-gray-200 px-6 pt-2 bg-gray-50">
                                <button
                                  onClick={() =>
                                    setActiveDetailTab((prev) => ({
                                      ...prev,
                                      [p.id]: "info",
                                    }))
                                  }
                                  className={`px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "info" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                                >
                                  Thông tin chung
                                </button>
                                <button
                                  onClick={() =>
                                    setActiveDetailTab((prev) => ({
                                      ...prev,
                                      [p.id]: "variants",
                                    }))
                                  }
                                  className={`px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "variants" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                                >
                                  Bảng Biến Thể ({p.variants.length})
                                </button>
                                <button
                                  onClick={() =>
                                    setActiveDetailTab((prev) => ({
                                      ...prev,
                                      [p.id]: "attributes",
                                    }))
                                  }
                                  className={`px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "attributes" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                                >
                                  Thông số kỹ thuật
                                </button>
                                <button
                                  onClick={() =>
                                    setActiveDetailTab((prev) => ({
                                      ...prev,
                                      [p.id]: "images",
                                    }))
                                  }
                                  className={`px-4 py-2 text-sm font-semibold border-b-2 ${currentDetailTab === "images" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                                >
                                  Hình ảnh
                                </button>
                              </div>

                              {/* Nội dung Tabs */}
                              <div className="p-6">
                                {/* Tab 1: Info */}
                                {currentDetailTab === "info" && (
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 content-start text-sm">
                                      <div className="flex flex-col border-b border-gray-200 pb-2 md:col-span-2">
                                        <span className="mb-1 text-gray-500">
                                          Mô tả ngắn:
                                        </span>
                                        <span className="text-gray-800 font-medium break-works line-clamp-2">
                                          {p.shortDesc || "Không có mô tả"}
                                        </span>
                                      </div>
                                      <div className="flex border-b border-gray-200 pb-2">
                                        <span className="w-32 text-gray-500">
                                          Giá gốc:
                                        </span>
                                        <span className="text-gray-800">
                                          {formatPrice(p.cost)}
                                        </span>
                                      </div>
                                      <div className="flex border-b border-gray-200 pb-2">
                                        <span className="w-32 text-gray-500">
                                          Giá bán (Thấp nhất):
                                        </span>
                                        <span className="text-blue-600 font-bold">
                                          {formatPrice(p.price)}
                                        </span>
                                      </div>
                                      <div className="flex border-b border-gray-200 pb-2">
                                        <span className="w-32 text-gray-500">
                                          Lượt xem:
                                        </span>
                                        <div className="flex gap-2">
                                          <span className="text-gray-800">
                                            {p.views}
                                          </span>
                                          <img
                                            src={Icons.EyeOn}
                                            alt="Lượt xem"
                                            className="h-5 w-5 brightness-75"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* Cụm Nút Action */}
                                    <div className="flex flex-col gap-2 shrink-0 border-l border-gray-200 pl-6">
                                      <button
                                        onClick={() => handleEditClick(p)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-600 hover:text-white transition font-medium cursor-pointer"
                                      >
                                        Chỉnh sửa
                                      </button>

                                      {/* Nút Ngừng kinh doanh */}
                                      <button
                                        onClick={() => {
                                          const actionText =
                                            p.status === "active"
                                              ? "ngừng kinh doanh"
                                              : "mở bán lại";
                                          setConfirmModal({
                                            isOpen: true,
                                            actionType: "toggleStatus",
                                            product: p,
                                            title: "Xác nhận đổi trạng thái",
                                            message: `Bạn có chắc chắn muốn ${actionText} sản phẩm ${p.name} không?`,
                                          });
                                        }}
                                        className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-500 hover:text-white transition font-medium"
                                      >
                                        {p.status === "active"
                                          ? "Ngừng kinh doanh"
                                          : "Mở bán lại"}
                                      </button>

                                      {/* Nút Xóa */}
                                      <button
                                        onClick={() => {
                                          setConfirmModal({
                                            isOpen: true,
                                            actionType: "delete",
                                            product: p,
                                            title: "CẢNH BÁO XÓA DỮ LIỆU",
                                            message: `Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm ${p.name}? Thao tác này không thể hoàn tác!`,
                                          });
                                        }}
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-600 hover:text-white transition font-medium"
                                      >
                                        Xóa sản phẩm
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Tab 2: Biến Thể */}
                                {currentDetailTab === "variants" && (
                                  <div className="border rounded-lg overflow-hidden border-gray-200">
                                    <table className="w-full text-left text-sm">
                                      <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                          <th className="p-3 border-b">
                                            Mã SKU
                                          </th>
                                          <th className="p-3 border-b">
                                            Màu sắc
                                          </th>
                                          <th className="p-3 border-b">
                                            Dung lượng
                                          </th>
                                          <th className="p-3 border-b">RAM</th>
                                          <th className="p-3 border-b text-right">
                                            Giá gốc
                                          </th>
                                          <th className="p-3 border-b text-right">
                                            Giá bán
                                          </th>
                                          <th className="p-3 border-b text-right">
                                            Tồn
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {p.variants.map((v) => (
                                          <tr
                                            key={v.sku}
                                            className="border-b last:border-0 hover:bg-gray-50 bg-white"
                                          >
                                            <td className="p-3 font-medium text-gray-800">
                                              {v.sku}
                                            </td>
                                            <td className="p-3">{v.color}</td>
                                            <td className="p-3">
                                              {v.capacity || "-"}
                                            </td>
                                            <td className="p-3">
                                              {v.ram || "-"}
                                            </td>
                                            <td className="p-3 text-right">
                                              {formatPrice(v.cost)}
                                            </td>
                                            <td className="p-3 text-right text-blue-600 font-medium">
                                              {formatPrice(v.price)}
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                              {v.stock}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Tab 3: Thuộc Tính */}
                                {currentDetailTab === "attributes" && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {p.attributes.map((attr, idx) => (
                                      <div
                                        key={idx}
                                        className="flex bg-white border border-gray-200 rounded p-3 shadow-sm"
                                      >
                                        <span className="w-1/3 text-gray-500 font-medium">
                                          {attr.name}:
                                        </span>
                                        <span className="w-2/3 text-gray-800">
                                          {attr.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Tab 4: Hình ảnh sản phẩm */}
                                {currentDetailTab === "images" && (
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <h5 className="font-bold text-gray-800">
                                        Hình ảnh sản phẩm
                                      </h5>
                                      <button className="text-[13px] bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-200 hover:bg-blue-600 hover:text-white transition font-medium flex gap-1 justify-center pl-2">
                                        <img
                                          src={Icons.Add}
                                          alt="Thêm ảnh"
                                          className="h-4 w-4 hover:brightness-0 invert"
                                        />
                                        <span>Tải thêm ảnh</span>
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                      {[1, 2, 3, 4].map((imgOrder) => (
                                        <div
                                          key={imgOrder}
                                          className={`relative border rounded-lg p-2 flex flex-col items-center gap-2 ${imgOrder === 1 ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
                                        >
                                          {/* Cờ đánh dấu ảnh chính */}
                                          {imgOrder === 1 && (
                                            <span className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-br-lg rounded-tl-lg z-10 font-bold shadow-sm">
                                              Ảnh chính
                                            </span>
                                          )}

                                          {/* Khung hiển thị ảnh */}
                                          <div className="w-full h-28 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs object-cover overflow-hidden">
                                            Preview Ảnh {imgOrder}
                                          </div>

                                          {/* Mũi tên thay đổi thứ tự */}
                                          <div className="flex w-full justify-between items-center px-1">
                                            <button
                                              className="text-gray-400 hover:text-blue-600 text-xl leading-none transition"
                                              title="Dịch sang trái"
                                            >
                                              <img
                                                src={Icons.ArrowLeftLong}
                                                alt="Đổi vị trí sang trái"
                                                className="h-5 w-5 brightness-200  hover:brightness-100 cursor-pointer"
                                              />
                                            </button>
                                            <span className="text-xs font-semibold text-gray-600">
                                              Vị trí: {imgOrder}
                                            </span>
                                            <button
                                              className="text-gray-400 hover:text-blue-600 text-xl leading-none transition"
                                              title="Dịch sang phải"
                                            >
                                              <img
                                                src={Icons.ArrowRightLong}
                                                alt="Đổi vị trí sang phải"
                                                className="h-5 w-5 brightness-200  hover:brightness-100 cursor-pointer"
                                              />
                                            </button>
                                          </div>

                                          {/* Nút thao tác ảnh */}
                                          <div className="flex w-full gap-2 mt-1">
                                            {imgOrder !== 1 && (
                                              <button className="flex-1 bg-white border border-gray-300 text-[11px] py-1.5 rounded hover:bg-gray-100 font-bold transition cursor-pointer ">
                                                Ảnh chính
                                              </button>
                                            )}
                                            <button className="flex-1 bg-white border border-red-200 text-red-500 text-[12px] py-1.5 rounded hover:bg-red-50 font-bold transition cursor-pointer">
                                              Xóa
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
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

          {/* Footer phân trang */}
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-600 shrink-0">
            <span>
              Hiển thị 1 - {products.length} của {products.length} sản phẩm
            </span>
            <div className="flex gap-1 items-center">
              <button className="px-2 py-1 hover:bg-gray-200 rounded">
                &laquo;
              </button>
              <button className="px-2 py-1 hover:bg-gray-200 rounded">
                &lt;
              </button>
              <button className="px-3 py-1 bg-[#4caf50] text-white rounded font-bold">
                1
              </button>
              <button className="px-2 py-1 hover:bg-gray-200 rounded">
                &gt;
              </button>
              <button className="px-2 py-1 hover:bg-gray-200 rounded">
                &raquo;
              </button>
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
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.actionType === "delete" ? "danger" : "warning"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirmAction}
      />
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[200] px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-all animate-fade-in-up ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Product;
