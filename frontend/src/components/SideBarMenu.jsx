import React from "react";
import * as Icons from "../assets/icons/index";

const menuItems = [
  {
    icon: <img src={Icons.Home} alt="Trang chủ" className="w-7 h-7" />,
    label: "Trang chủ",
  },
  {
    icon: (
      <img src={Icons.Phone} alt="Điện thoại, Tablet" className="w-7 h-7" />
    ),
    label: "Điện thoại, Tablet",
  },
  {
    icon: <img src={Icons.Laptop} alt="Laptop" className="w-7 h-7" />,
    label: "Laptop",
  },
  {
    icon: <img src={Icons.PC} alt="PC, Màn hình" className="w-7 h-7" />,
    label: "PC, Màn hình",
  },
  {
    icon: (
      <img src={Icons.Keyboard} alt="Bàn phím, chuột" className="w-7 h-7" />
    ),
    label: "Bàn phím, chuột",
  },
  {
    icon: (
      <img src={Icons.Headphone} alt="Củ sạc, tai nghe" className="w-7 h-7" />
    ),
    label: "Củ sạc, tai nghe",
  },
  {
    icon: <img src={Icons.Box} alt="Hàng cũ" className="w-7 h-7" />,
    label: "Hàng cũ",
  },
  {
    icon: (
      <img src={Icons.Compare} alt="So sánh thiết bị" className="w-7 h-7" />
    ),
    label: "So sánh thiết bị",
  },
  {
    icon: <img src={Icons.Discount} alt="Khuyến mãi" className="w-7 h-7" />,
    label: "Khuyến mãi",
  },
  {
    icon: <img src={Icons.News} alt="Tin công nghệ" className="w-7 h-7" />,
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
                  <span className="text-lg opacity-70 group-hover:opacity-100 text-[#4A44F2]">
                    {item.icon}
                  </span>
                  <span className="text-gray-700 font-medium text-xl group-hover:text-[#4A44F2] transition-colors">
                    {item.label}
                  </span>
                </div>
                <img
                  src={Icons.ArrowForward}
                  alt="Forward"
                  className="h-7 w-5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
