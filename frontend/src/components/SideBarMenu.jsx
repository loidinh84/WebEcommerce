import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as Icons from "../assets/icons/index";

const menuItems = [
  {
    icon: <Icons.Home className="w-6 h-6" />,
    label: "Trang chủ",
  },
  {
    icon: <Icons.Phone className="w-6 h-6" />,
    label: "Điện thoại, Tablet",
  },
  {
    icon: <Icons.Laptop className="w-6 h-6" />,
    label: "Laptop",
  },
  {
    icon: <Icons.PC className="w-6 h-6" />,
    label: "PC, Màn hình",
  },
  {
    icon: <Icons.Keyboard className="w-6 h-6" />,
    label: "Bàn phím, chuột",
  },
  {
    icon: <Icons.Headphone className="w-6 h-6" />,
    label: "Củ sạc, tai nghe",
  },
  {
    icon: <Icons.Box className="w-6 h-6" />,
    label: "Hàng cũ",
  },
  {
    icon: <Icons.Compare className="w-6 h-6" />,
    label: "So sánh thiết bị",
  },
  {
    icon: <Icons.Discount className="w-6 h-6" />,
    label: "Khuyến mãi",
  },
  {
    icon: <Icons.News className="w-6 h-6" />,
    label: "Tin công nghệ",
  },
];

const SidebarMenu = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* 1. KHỐI MENU DANH MỤC */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden text-sm font-medium">
        <ul className="flex flex-col py-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-70 group-hover:opacity-100 text-[#2621a3]">
                    {item.icon}
                  </span>
                  <span className="text-gray-800 font-medium text-sm group-hover:text-[#4A44F2] transition-colors">
                    {item.label}
                  </span>
                </div>
                <Icons.ArrowForward className="h-6 w-4 text-gray-500" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
