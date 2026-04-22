import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "../assets/icons/index";

// Thêm cục 'megaMenu' vào data để chứa nội dung show ra khi Hover
const menuItems = [
  {
    icon: <Icons.Home className="w-6 h-6" />,
    links: [{ label: "Trang chủ", path: "/" }],
  },
  {
    icon: <Icons.Phone className="w-6 h-6" />,
    links: [
      { label: "Điện thoại", path: "/dienthoai" },
      { label: "Tablet", path: "/tablet" },
    ],
    // --- DATA MEGA MENU GIẢ LẬP THEO CELLPHONES ---
    megaMenu: {
      phoneBrands: ["iPhone", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Nokia", "ASUS"],
      prices: ["Dưới 2 triệu", "Từ 2 - 4 triệu", "Từ 4 - 7 triệu", "Từ 7 - 13 triệu", "Từ 13 - 20 triệu", "Trên 20 triệu"],
      hotPhones: ["iPhone 15 Pro Max", "Galaxy S24 Ultra", "Xiaomi 14", "OPPO Find N3", "iPhone 13", "Redmi Note 13"],
      tabletBrands: ["iPad", "Samsung", "Xiaomi", "Lenovo", "Huawei", "OPPO"],
    }
  },
  {
    icon: <Icons.Laptop className="w-6 h-6" />,
    links: [{ label: "Laptop", path: "/laptop" }],
    // Bro có thể tự thêm megaMenu cho Laptop sau...
  },
  {
    icon: <Icons.PC className="w-6 h-6" />,
    links: [
      { label: "PC", path: "/pc" },
      { label: "Màn hình", path: "/man-hinh" },
    ],
  },
  {
    icon: <Icons.Keyboard className="w-6 h-6" />,
    links: [
      { label: "Bàn phím", path: "/ban-phim" },
      { label: "Chuột", path: "/chuot" }
    ],
  },
  {
    icon: <Icons.Headphone className="w-6 h-6" />,
    links: [
      { label: "Củ sạc", path: "/cu-sac" },
      { label: "Tai nghe", path: "/tai-nghe" }
    ],
  },
  {
    icon: <Icons.Box className="w-6 h-6" />,
    links: [{ label: "Hàng cũ", path: "/hang-cu" }],
  },
  {
    icon: <Icons.Compare className="w-6 h-6" />,
    links: [{ label: "So sánh thiết bị", path: "/so-sanh" }],
  },
  {
    icon: <Icons.Discount className="w-6 h-6" />,
    links: [{ label: "Khuyến mãi", path: "/khuyen-mai" }],
  },
  {
    icon: <Icons.News className="w-6 h-6" />,
    links: [{ label: "Tin công nghệ", path: "/tin-tuc" }],
  },
];

const SidebarMenu = () => {
  // State để lưu vị trí đang hover
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    // Thêm relative vào Container tổng để Mega Menu có thể neo (absolute) theo nó
    <div 
      className="flex flex-col gap-4 w-full h-full relative"
      onMouseLeave={() => setHoveredIndex(null)} // Di chuột ra khỏi menu thì đóng lại
    >
      <div className="bg-white rounded-lg shadow-sm text-sm font-medium h-full">
        <ul className="flex flex-col py-2">
          {menuItems.map((item, index) => {
            
            return (
              <li 
                key={index} 
                className="px-4 py-2.5 hover:bg-gray-100 transition-colors group flex items-center justify-between"
                onMouseEnter={() => setHoveredIndex(index)} // Di chuột vào dòng nào thì lưu index dòng đó
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg opacity-70 group-hover:opacity-100 text-[#2621a3] transition-opacity">
                    {item.icon}
                  </span>
                  
                  {/* Rendering chữ và link */}
                  {item.links.length === 1 ? (
                    <Link to={item.links[0].path} className="text-gray-800 font-medium text-sm group-hover:text-[#4A44F2] transition-colors w-full block">
                      {item.links[0].label}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-800 text-sm w-full">
                      {item.links.map((link, idx) => (
                        <React.Fragment key={idx}>
                          <Link to={link.path} className="hover:text-[#4A44F2] transition-colors">
                            {link.label}
                          </Link>
                          {idx < item.links.length - 1 && <span className="text-gray-500">,</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
                {/* Mũi tên nhỏ bên phải báo hiệu có menu con */}
                {item.megaMenu && <Icons.ArrowForward className="h-4 w-4 text-gray-400 group-hover:text-[#4A44F2]" />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- PHẦN MEGA MENU XUẤT HIỆN KHI HOVER --- */}
      {hoveredIndex !== null && menuItems[hoveredIndex].megaMenu && (
        <div 
          className="absolute top-0 left-full ml-2 w-[750px] bg-white rounded-lg shadow-xl border border-gray-100 p-6 z-[100] min-h-full grid grid-cols-3 gap-6 animate-fade-in"
        >
          {/* Cột 1: Hãng Điện thoại & Mức giá */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Hãng điện thoại</h3>
              <div className="grid grid-cols-2 gap-2">
                {menuItems[hoveredIndex].megaMenu.phoneBrands?.map((brand, idx) => (
                  <Link key={idx} to={`/dienthoai/${brand.toLowerCase()}`} className="border border-gray-200 rounded-md py-1 text-center text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Mức giá điện thoại</h3>
              <div className="grid grid-cols-2 gap-2">
                {menuItems[hoveredIndex].megaMenu.prices?.map((price, idx) => (
                  <Link key={idx} to="/dienthoai" className="border border-gray-200 rounded-md py-1 px-2 text-center text-[11px] font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {price}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Cột 2: Điện thoại HOT */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-1">
              Điện thoại HOT ⚡
            </h3>
            <div className="flex flex-col gap-3">
              {menuItems[hoveredIndex].megaMenu.hotPhones?.map((phone, idx) => (
                <Link key={idx} to="/dienthoai" className="text-xs text-gray-600 hover:text-blue-600 font-medium flex items-center justify-between">
                  {phone}
                  {idx < 2 && <span className="text-[9px] bg-red-500 text-white px-1 rounded-sm">MỚI</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Cột 3: Hãng Máy tính bảng */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Hãng máy tính bảng</h3>
            <div className="grid grid-cols-2 gap-2">
              {menuItems[hoveredIndex].megaMenu.tabletBrands?.map((brand, idx) => (
                <Link key={idx} to="/tablet" className="border border-gray-200 rounded-md py-1 text-center text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;