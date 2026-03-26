import React from "react";
import * as Icons from "../assets/icons/index";
import { Outlet, Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/admin", label: "Tổng quan", icon: Icons.Dashboard },
  { path: "/admin/products", label: "Sản phẩm", icon: Icons.Product },
  { path: "/admin/orders", label: "Đơn hàng", icon: Icons.Transaction },
  { path: "/admin/customers", label: "Khách hàng", icon: Icons.Customers },
  { path: "/admin/inventory", label: "Kho hàng", icon: Icons.Inventory },
  { path: "/admin/settings", label: "Thiết lập", icon: Icons.Setting },
];

const AdminLayout = () => {
  const location = useLocation();

  // Hàm kiểm tra Tab đang active (Xử lý riêng để /admin/products không làm sáng luôn /admin)
  const checkIsActive = (itemPath) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      
      {/* --- TOP NAVBAR (Menu chính nằm ngang) --- */}
      <header className="bg-gray-900 text-white flex items-center justify-between px-6 h-16 shadow-md shrink-0 z-20">
        
        {/* Khối Trái: Logo & Menu */}
        <div className="flex items-center h-full">
          
          {/* Logo giữ nguyên bản gốc */}
          <div className="h-16 flex items-center justify-center mr-10">
            <h1 className="text-2xl font-bold tracking-wider">
              <span className="text-blue-500">LTL</span> Admin
            </h1>
          </div>

          {/* Danh sách Menu Ngang */}
          <nav className="h-full hidden lg:block">
            <ul className="flex h-full gap-1">
              {menuItems.map((item) => {
                const isActive = checkIsActive(item.path);
                return (
                  <li key={item.path} className="h-full">
                    <Link
                      to={item.path}
                      className={`flex items-center h-full px-5 font-medium transition-colors border-b-4 ${
                        isActive
                          ? "bg-gray-800 border-blue-500 text-white" // Tab đang chọn
                          : "border-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Khối Phải: Thông tin Admin & Đăng xuất (Giữ nguyên bản gốc) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300">
              Xin chào, Admin
            </span>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-blue-200">
              L
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
            <span>🚪 Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* --- SUB-HEADER (Chứa dòng tiêu đề gốc của Bro) --- */}
      <div className="h-14 bg-white shadow-sm flex items-center px-8 z-10 border-b border-gray-200 shrink-0">
        <div className="text-gray-800 font-semibold text-lg">
          Hệ thống Quản trị LTL Shop
        </div>
      </div>

      {/* --- KHU VỰC CHÍNH (Nơi chứa các trang con) --- */}
      {/* Khung này sẽ bọc toàn bộ màn hình còn lại. Bộ lọc bên trái sẽ được làm ở file Product.jsx */}
      <main className="flex-1 overflow-hidden flex bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;