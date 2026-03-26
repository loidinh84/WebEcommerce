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

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR (Thanh điều hướng bên trái) --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col transition-all duration-300">
        {/* Logo Admin */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wider">
            <span className="text-blue-500">LTL</span> Admin
          </h1>
        </div>

        {/* Danh sách Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Nút Đăng xuất ở đáy Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition">
            <span>🚪 Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* --- KHU VỰC CHÍNH BÊN PHẢI --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <div className="text-gray-800 font-semibold text-lg">
            Hệ thống Quản trị LTL Shop
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              Xin chào, Admin Thành Lợi
            </span>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-blue-200">
              L
            </div>
          </div>
        </header>

        {/* MAIN CONTENT (Nơi chứa các trang con như Dashboard, Sản phẩm...) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Outlet chính là cái "lỗ hổng" để react-router-dom nhét giao diện trang con vào đây */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
