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

  const checkIsActive = (itemPath) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(itemPath);
  };

  // Xác định tên trang hiện tại cho Sub-header
  const currentPageLabel =
    menuItems.find((item) => checkIsActive(item.path))?.label ||
    "Hệ thống Quản trị";

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* --- TOP NAVBAR --- */}
      <header className="bg-gray-900 text-white flex items-center justify-between px-6 h-16 shadow-md shrink-0 z-20">
        <div className="flex items-center h-full">
          <div className="h-16 flex items-center justify-center mr-10 cursor-pointer">
            {/* Logo Shop bên trái */}
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
                          ? "bg-gray-800 border-blue-500 text-white"
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

        {/* Khối Phải: Xin chào, Avatar, Thiết lập */}
        <div className="flex items-center gap-6">
          <Link
            to="/admin/settings"
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors hidden sm:block"
          >
            Thiết lập cửa hàng
          </Link>
          <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors">
            <span className="text-sm font-medium text-gray-300">
              Xin chào, Admin
            </span>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-blue-200">
              L
            </div>
          </div>
        </div>
      </header>

      {/* --- SUB-HEADER ĐỘNG --- */}
      <div className="h-14 bg-white shadow-sm flex items-center px-8 z-10 border-b border-gray-200 shrink-0">
        <div className="text-gray-800 font-semibold text-lg flex items-center gap-2">
          <span className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
            Trang chủ
          </span>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-800">{currentPageLabel}</span>
        </div>
      </div>

      {/* --- KHU VỰC CHÍNH --- */}
      <main className="flex-1 overflow-hidden flex bg-[#f0f2f5]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
