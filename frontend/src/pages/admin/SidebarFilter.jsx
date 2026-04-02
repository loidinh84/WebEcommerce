import React from "react";
import * as Icons from "../../assets/icons/index";

const SidebarFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-[280px] shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar pb-6 pr-2">
      {/* 1. Khối Tìm kiếm */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-base">Tìm kiếm</h3>
        <div className="relative">
          <img
            src={Icons.Search}
            alt="Tìm kiếm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40 hover:opacity-70 transition"
          />
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Khối Danh mục */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-base">Danh mục</h3>
          <img
            src={Icons.Add}
            alt="Thêm danh mục"
            className="h-6 w-6 cursor-pointer"
          />
        </div>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="font-semibold text-blue-600 cursor-pointer">Tất cả</li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors">
            Điện thoại di động
          </li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors">
            Laptop & Macbook
          </li>
          <li className="hover:text-blue-600 cursor-pointer transition-colors">
            Phụ kiện - Bàn phím
          </li>
        </ul>
      </div>

      {/* 3. Khối Nhà cung cấp */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-base">Nhà cung cấp</h3>
          <img
            src={Icons.Add}
            alt="Thêm nhà cung cấp"
            className="h-6 w-6 cursor-pointer"
          />
        </div>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="font-semibold text-blue-600 cursor-pointer">Tất cả</li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />{" "}
            Apple Vietnam
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />{" "}
            ASUS Global
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />{" "}
            GearVN
          </li>
        </ul>
      </div>

      {/* 4. Khối Trạng thái & Nổi bật */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-base">
          Trạng thái hiển thị
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />{" "}
            Sản phẩm nổi bật
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />{" "}
            Đang kinh doanh
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />{" "}
            Ngừng kinh doanh
          </label>
        </div>
      </div>

      {/* 5. Khối Tồn kho */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-base">Tồn kho</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="radio"
              name="stock_filter"
              defaultChecked
              className="w-4 h-4 text-blue-600"
            />{" "}
            Tất cả
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="radio"
              name="stock_filter"
              className="w-4 h-4 text-blue-600"
            />{" "}
            Còn hàng
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input
              type="radio"
              name="stock_filter"
              className="w-4 h-4 text-blue-600"
            />{" "}
            Hết hàng
          </label>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
