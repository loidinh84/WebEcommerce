import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import * as Icons from "../assets/icons/index";

const menuItems = [
  { path: "/admin", label: "Tổng quan" },
  { path: "/admin/products", label: "Sản phẩm" },
  { path: "/admin/categories", label: "Danh mục" },
  { path: "/admin/orders", label: "Đơn hàng" },
  { path: "/admin/customers", label: "Khách hàng" },
  {
    label: "Kho hàng",
    hasDropdown: true,
    subPaths: ["/admin/inventory", "/admin/inventory-check"],
    children: [
      { path: "/admin/inventory", label: "Danh sách kho" },
      { path: "/admin/inventory-check", label: "Kiểm kho" },
    ],
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const checkIsActive = (item) => {
    if (item.hasDropdown) {
      return item.subPaths.some((p) => location.pathname === p);
    }
    if (item.path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white flex items-center justify-between px-6 h-16 shadow-md shrink-0 z-20">
        <div className="flex items-center h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center mr-10 cursor-pointer">
            <h1 className="text-2xl font-bold tracking-wider">LTL Store</h1>
          </div>

          {/* Nav */}
          <nav className="h-full hidden lg:block">
            <ul className="flex h-full gap-1">
              {menuItems.map((item) => {
                const isActive = checkIsActive(item);
                if (item.hasDropdown) {
                  return (
                    <li key={item.label} className="relative group h-full">
                      {/* Nút cha */}
                      <div
                        className={`flex items-center h-full px-5 font-medium transition-colors border-b-4 cursor-pointer select-none text-lg font-semibold
                          ${
                            isActive
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-transparent text-white hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        <span>{item.label}</span>
                      </div>

                      {/* Dropdown panel */}
                      <div
                        className="absolute top-[60px] left-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 z-50 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const childActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`flex items-center px-5 py-3.5 text-sm font-semibold transition-colors
                                ${
                                  childActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.path} className="h-full">
                    <Link
                      to={item.path}
                      className={`flex items-center h-full px-5 font-medium transition-colors border-b-4 text-lg font-semibold
                        ${
                          isActive
                            ? "bg-blue-500 border-white text-white"
                            : "border-transparent text-white hover:bg-blue-500 hover:text-white"
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

        {/* Khối Phải: Thiết lập & User Dropdown */}
        <div className="flex items-center gap-1">
          <div className="relative group h-full hidden sm:flex items-center">
          <Link to="/admin/settings">
            <div className="text-white hover:bg-blue-500 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5">
              <Icons.Setting className="w-5 h-5" />
              Thiết lập cửa hàng
            </div>
          </Link>
            <div
              className="absolute top-[37px] left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 z-50 overflow-hidden"
            >
              <div className="py-2">
                <Link
                  to="/admin/settings"
                  className="flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Thiết lập cửa hàng
                </Link>
                <Link
                  to="/admin/banners"
                  className="flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Quản lý Banner
                </Link>
                <Link
                  to="/admin/settings/shipping"
                  className="flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Đơn vị vận chuyển
                </Link>
                <Link
                  to="/admin/settings/payments"
                  className="flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Phương thức thanh toán
                </Link>
                <Link
                  to="/admin/settings/templates"
                  className="flex items-center px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Quản lý mẫu in
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group h-16 flex items-center">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors">
              <span className="text-sm font-medium text-white">
                Xin chào, Admin
              </span>
              <Icons.User className="w-7 h-7" />
            </div>

            <div
              className="absolute top-[60px] right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 z-50 overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Vai trò
                </p>
                <p className="text-blue-600 font-bold tracking-wide">Admin</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Thông tin tài khoản
                </button>
                <button className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex bg-[#f0f2f5]">
        <Outlet />
      </main>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;
