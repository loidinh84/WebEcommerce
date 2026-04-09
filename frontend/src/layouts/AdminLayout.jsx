import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import ProfileModal from "../components/ProfileModal"; // Nhớ import cái Modal vừa tạo nhé

const menuItems = [
  { path: "/admin", label: "Tổng quan" },
  { path: "/admin/products", label: "Sản phẩm" },
  { path: "/admin/categories", label: "Danh mục" },
  { path: "/admin/orders", label: "Đơn hàng" },
  { path: "/admin/customers", label: "Khách hàng" },
  { path: "/admin/inventory", label: "Kho hàng" },
];

const AdminLayout = () => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State mở Modal

  const checkIsActive = (itemPath) => {
    if (itemPath === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(itemPath);
  };

  const currentPageLabel =
    menuItems.find((item) => checkIsActive(item.path))?.label ||
    "Hệ thống Quản trị";

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-gray-900 text-white flex items-center justify-between px-6 h-16 shadow-md shrink-0 z-20">
        <div className="flex items-center h-full">
          <div className="h-16 flex items-center justify-center mr-10 cursor-pointer">
            <h1 className="text-2xl font-bold tracking-wider">
              <span className="text-blue-500">LTL</span> Admin
            </h1>
          </div>

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

        {/* Khối Phải: Thiết lập & User Dropdown */}
        <div className="flex items-center gap-6">
          <Link to="/admin/settings" className="text-gray-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">
            Thiết lập cửa hàng
          </Link>
          
          {/* VÙNG HOVER SẼ HIỆN MENU (Dùng group relative) */}
          <div className="relative group h-16 flex items-center">
            
            {/* Thanh hiển thị tên */}
            <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
              <span className="text-sm font-medium text-gray-300">
                Xin chào, Admin
              </span>
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold border border-gray-400">
                👤
              </div>
            </div>

            {/* DROPDOWN MENU (Chỉ hiện khi hover vào div cha) */}
            <div className="absolute top-[60px] right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Vai trò</p>
                <p className="text-blue-600 font-bold tracking-wide">Admin</p>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer  "
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

      <div className="h-14 bg-white shadow-sm flex items-center px-8 z-10 border-b border-gray-200 shrink-0">
        <div className="text-gray-800 font-semibold text-lg flex items-center gap-2">
          <span className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">Trang chủ</span>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-800">{currentPageLabel}</span>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex bg-[#f0f2f5]">
        <Outlet />
      </main>

      {/* GẮN MODAL VÀO ĐÂY */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

    </div>
  );
};

export default AdminLayout;