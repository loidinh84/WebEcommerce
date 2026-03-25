import React from "react";
import * as Icons from "../assets/icons/index"; // Chuẩn bị sẵn icon trái tim nhé

const ProductCard = ({ product }) => {
  const phanTramGiam =
    product.gia_cu > 0
      ? Math.round(((product.gia_cu - product.gia_moi) / product.gia_cu) * 100)
      : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer relative font-sans flex flex-col h-full">
      {/* Khối Header của thẻ: Tag giảm giá & Nút Yêu thích */}
      <div className="flex justify-between items-start z-10 absolute w-full pr-6">
        {phanTramGiam > 0 ? (
          <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Giảm {phanTramGiam}%
          </div>
        ) : (
          <div className="bg-[#FF6A13] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Mới
          </div>
        )}
        <button className="text-blue-500 hover:text-red-500 text-[10px] flex items-center gap-1 font-medium">
          ♡ Yêu thích
        </button>
      </div>

      {/* Ảnh Sản phẩm */}
      <div className="w-full aspect-square flex items-center justify-center p-2 mb-2 overflow-hidden">
        <img
          src={
            product.hinh_anh_url ||
            "https://via.placeholder.com/200x200?text=Product"
          }
          alt={product.ten_san_pham}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Thông tin chữ */}
      <div className="flex-grow flex flex-col">
        <h3 className="text-gray-800 text-xs font-bold leading-tight mb-1.5 hover:text-blue-600 line-clamp-2 min-h-[32px]">
          {product.ten_san_pham}
        </h3>

        {/* Tag Tình trạng (Màu xanh lá) */}
        <div className="mb-2">
          <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-sm font-medium">
            Hàng mới về
          </span>
        </div>

        {/* Cụm Giá */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-red-600 text-sm font-bold">
            {product.gia_moi.toLocaleString("vi-VN")}đ
          </span>
          {product.gia_cu > 0 && (
            <span className="text-gray-400 text-[10px] font-medium line-through">
              {product.gia_cu.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Khuyến mãi Sinh viên */}
        <div className="mb-3">
          <span className="bg-purple-50 text-purple-600 text-[9px] px-1.5 py-0.5 rounded-sm">
            Student giảm thêm 500.000đ
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-2">
          <div className="text-[10px] text-yellow-400 font-medium">
            ⭐ {product.danh_gia}
          </div>
          <div className="text-[10px] text-gray-500 font-medium">
            Đã bán {product.da_ban || 15}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
