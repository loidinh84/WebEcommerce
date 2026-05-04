import React from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/api";

const AccessoryBar = ({ title, data }) => {
  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center gap-4 mb-2">
        {/* Tên mục tự động thay đổi theo biến title */}
        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {data.map((item, index) => (
          <Link
            key={index}
            to={item.categoryId ? `/category/${item.categoryId}` : "#"}
            className="flex items-center justify-start gap-3 bg-white px-3 py-4 rounded-lg shadow-sm hover:shadow-md hover:text-blue-600 cursor-pointer transition border border-gray-100 min-w-[180px] group"
          >
            <div className="h-7 flex items-center justify-center">
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
            <span className="font-bold text-gray-700 whitespace-nowrap group-hover:text-blue-600 transition-colors">
              {item.label || item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccessoryBar;
