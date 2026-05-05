import React from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/api";

const AccessoryBar = ({ title, data }) => {
  return (
    <div className="mt-2 mb-2 sm:mt-4 sm:mb-4">
      <div className="flex items-center gap-4 mb-3">
        {/* Tên mục tự động thay đổi theo biến title */}
        <h2 className="text-base sm:text-xl font-medium text-gray-800 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>

      {/* Cuộn ngang trên mobile, layout icon-trên/text-dưới kiểu CellphoneS */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar -mx-2 px-2">
        {data.map((item, index) => (
          <Link
            key={index}
            to={item.categoryId ? `/category/${item.categoryId}` : "#"}
            className="flex flex-col items-center justify-start gap-1.5 bg-white px-2 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:text-[#4A44F2] cursor-pointer transition border border-gray-100 min-w-[68px] sm:min-w-[80px] snap-start shrink-0 group"
          >
            <div className="h-8 w-8 flex items-center justify-center">
              {item.icon && typeof item.icon === "string" ? (
                <img
                  src={
                    item.icon.startsWith("/")
                      ? `${BASE_URL}${item.icon}`
                      : `/assets/icons/${item.icon}`
                  }
                  alt={item.label || item.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              )}
            </div>
            <span className="font-medium text-[11px] sm:text-xs text-gray-700 text-center leading-tight whitespace-normal group-hover:text-[#4A44F2] transition-colors">
              {item.label || item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccessoryBar;
