import React from "react";


const AccessoryBar = ({ title, data }) => {
  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center gap-4 mb-4">
        {/* Tên mục tự động thay đổi theo biến title */}
        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {data.map((item, index) => (
          <button
            key={index}
            className="flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:text-blue-600 cursor-pointer transition border border-gray-100 w-fit"
          >
            <span className="h-17 w-17">
              {item.icon}
            </span>
            <span className="font-medium text-gray-700 whitespace-nowrap">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccessoryBar;
