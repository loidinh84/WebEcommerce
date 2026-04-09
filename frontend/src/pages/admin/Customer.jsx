import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

// Dữ liệu mẫu Khách hàng (Kèm theo lịch sử đơn hàng)
const mockCustomers = [
  { 
    id: "KH001", name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0901234567", 
    address: "123 Lê Lợi, Q1, TP.HCM", joinedDate: "15/01/2026", 
    totalOrders: 5, totalSpent: 45000000, status: "active",
    recentOrders: [
      { id: "DH001", date: "09/04/2026", total: 34990000, status: "completed" },
      { id: "DH089", date: "10/02/2026", total: 10010000, status: "completed" }
    ]
  },
  { 
    id: "KH002", name: "Trần Thị B", email: "tranthib.work@yahoo.com", phone: "0987654321", 
    address: "456 Nguyễn Trãi, Ba Đình, HN", joinedDate: "20/02/2026", 
    totalOrders: 1, totalSpent: 27490000, status: "active",
    recentOrders: [
      { id: "DH002", date: "09/04/2026", total: 27490000, status: "processing" }
    ]
  },
  { 
    id: "KH003", name: "Lê Văn C", email: "levanc99@gmail.com", phone: "0911223344", 
    address: "789 Điện Biên Phủ, Đà Nẵng", joinedDate: "05/03/2026", 
    totalOrders: 3, totalSpent: 5500000, status: "banned", // Bị khóa
    recentOrders: [
      { id: "DH003", date: "08/04/2026", total: 1500000, status: "cancelled" },
      { id: "DH102", date: "25/03/2026", total: 4000000, status: "completed" }
    ]
  },
];

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    actionType: null,
    customerId: null,
    newStatus: null,
    title: "",
    message: "",
  });

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      // Tương lai: const response = await axios.get("http://localhost:5000/api/khachhang");
      setTimeout(() => {
        setCustomers(mockCustomers);
        setIsLoading(false);
      }, 400); 
    } catch (error) {
      console.error("Lỗi API Khách hàng:", error);
      setCustomers(mockCustomers); // Fallback an toàn
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const executeConfirmAction = async () => {
    try {
      const { customerId, newStatus } = confirmModal;
      
      // Tương lai: await axios.put(`http://localhost:5000/api/khachhang/${customerId}/status`, { status: newStatus });
      
      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      ));

      const msg = newStatus === "banned" ? "Đã khóa tài khoản khách hàng!" : "Đã mở khóa tài khoản thành công!";
      showToast(msg, "success");
      
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi cập nhật trạng thái!", "error");
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  const renderCustomerStatus = (status) => {
    return status === 'active' 
      ? <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">Hoạt động</span>
      : <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap">Đã khóa</span>;
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 'processing': return <span className="text-blue-600 font-bold text-xs uppercase">Đang giao</span>;
      case 'completed': return <span className="text-green-600 font-bold text-xs uppercase">Hoàn thành</span>;
      case 'cancelled': return <span className="text-red-500 font-bold text-xs uppercase">Đã hủy</span>;
      default: return <span className="text-gray-500 font-bold text-xs uppercase">{status}</span>;
    }
  };

  // Lọc khách hàng
  const filteredCustomers = customers.filter(customer => {
    if (statusFilter !== "all" && customer.status !== statusFilter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return customer.name.toLowerCase().includes(searchLower) || 
             customer.phone.includes(searchTerm) || 
             customer.email.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-hidden justify-center relative font-sans">
      <div className="flex w-full max-w-[1536px] h-full p-4 lg:p-6 gap-4 lg:gap-6">
        
        {/* --- CỘT TRÁI: BỘ LỌC --- */}
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pr-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Tìm kiếm</h3>
            <input 
              type="text" 
              placeholder="Tên, SĐT, Email..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Trạng thái</h3>
            <div className="space-y-3 text-sm text-gray-700 font-medium">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "all"} onChange={() => setStatusFilter("all")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" /> Tất cả
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "active"} onChange={() => setStatusFilter("active")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" /> Đang hoạt động
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="status" checked={statusFilter === "banned"} onChange={() => setStatusFilter("banned")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" /> Bị khóa
              </label>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: BẢNG DỮ LIỆU --- */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
          
          {/* Header Bảng */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Danh sách Khách hàng</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm">
              Xuất dữ liệu
            </button>
          </div>

          {/* KHUNG CHỨA BẢNG */}
          <div className="flex-1 overflow-auto bg-gray-50/30 relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-[#e3f2fd] text-[#1565c0] z-10 text-sm shadow-sm">
                <tr>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Khách hàng</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200">Liên hệ</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Số đơn hàng</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-right">Tổng chi tiêu</th>
                  <th className="py-3 px-6 font-bold border-b border-blue-200 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">Không tìm thấy khách hàng nào.</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const isExpanded = expandedRows.includes(customer.id);
                    return (
                      <React.Fragment key={customer.id}>
                        {/* --- DÒNG CHÍNH --- */}
                        <tr 
                          onClick={() => toggleRow(customer.id)}
                          className={`cursor-pointer transition-colors group border-b border-gray-200 ${isExpanded ? "bg-blue-50/50" : "hover:bg-blue-50/30 bg-white"} ${customer.status === 'banned' ? 'opacity-60 bg-gray-50' : ''}`}
                        >
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-900 text-base">{customer.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Mã: {customer.id}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-800">{customer.phone}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{customer.email}</p>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-gray-800">{customer.totalOrders}</td>
                          <td className="py-4 px-6 text-right font-bold text-blue-600">{formatPrice(customer.totalSpent)}</td>
                          <td className="py-4 px-6 text-center">
                            {renderCustomerStatus(customer.status)}
                          </td>
                        </tr>

                        {/* --- DÒNG CHI TIẾT KHÁCH HÀNG --- */}
                        {isExpanded && (
                          <tr className="bg-[#f8fafc] border-b-2 border-blue-200 shadow-inner">
                            <td colSpan="5" className="p-6">
                              <div className="flex flex-col xl:flex-row gap-6">
                                
                                {/* 1. Thông tin chung */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider">Thông tin chi tiết</h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex"><span className="text-gray-500 w-28 font-medium">Họ và tên:</span> <span className="font-bold text-gray-900">{customer.name}</span></div>
                                    <div className="flex"><span className="text-gray-500 w-28 font-medium">Tham gia từ:</span> <span className="text-gray-800">{customer.joinedDate}</span></div>
                                    <div className="flex"><span className="text-gray-500 w-28 font-medium">Địa chỉ:</span> <span className="text-gray-800">{customer.address}</span></div>
                                  </div>
                                </div>

                                {/* 2. Lịch sử mua hàng */}
                                <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 uppercase text-xs tracking-wider flex justify-between">
                                    <span>Đơn hàng gần đây</span>
                                    <span className="text-blue-600 cursor-pointer hover:underline normal-case">Xem tất cả</span>
                                  </h4>
                                  <div className="space-y-3">
                                    {customer.recentOrders?.length > 0 ? (
                                      customer.recentOrders.map((order, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                          <div>
                                            <p className="font-bold text-blue-600 cursor-pointer hover:underline">{order.id}</p>
                                            <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold text-gray-800">{formatPrice(order.total)}</p>
                                            <p className="mt-1">{renderOrderStatus(order.status)}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm italic">Khách hàng chưa có đơn hàng nào.</p>
                                    )}
                                  </div>
                                </div>

                                {/* 3. Khối Thao tác Quản trị */}
                                <div className="w-full xl:w-48 shrink-0 flex flex-col gap-3">
                                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1 uppercase text-xs tracking-wider text-center xl:text-left">Quản trị</h4>
                                  
                                  {/* Cấm / Mở khóa người dùng */}
                                  {customer.status === 'active' ? (
                                    <button 
                                      onClick={() => setConfirmModal({
                                        isOpen: true, actionType: "ban", customerId: customer.id, newStatus: "banned",
                                        title: "Cảnh báo khóa tài khoản", message: `Bạn có chắc chắn muốn khóa tài khoản của khách hàng ${customer.name}? Họ sẽ không thể đăng nhập và mua hàng được nữa.`
                                      })}
                                      className="w-full py-2.5 bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors"
                                    >
                                      Khóa tài khoản
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => setConfirmModal({
                                        isOpen: true, actionType: "unban", customerId: customer.id, newStatus: "active",
                                        title: "Mở khóa tài khoản", message: `Khôi phục quyền truy cập cho khách hàng ${customer.name}?`
                                      })}
                                      className="w-full py-2.5 bg-green-50 border border-green-300 text-green-700 hover:bg-green-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-wide transition-colors"
                                    >
                                      Mở khóa tài khoản
                                    </button>
                                  )}

                                  <button className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors mt-auto">
                                    Gửi Email
                                  </button>
                                </div>
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
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-600 shrink-0">
            <span className="font-medium">
              Hiển thị 1 - {filteredCustomers.length} của {filteredCustomers.length} khách hàng
            </span>
            <div className="flex gap-1.5 items-center">
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&laquo;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&lt;</button>
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&gt;</button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-md font-medium transition-colors">&raquo;</button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.actionType === "ban" ? "danger" : "primary"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeConfirmAction}
      />

      {toast.show && (
        <div className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all animate-fade-in-up ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Customer;