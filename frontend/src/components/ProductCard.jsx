import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "../assets/icons/index";

const ProductCard = ({ product }) => {
  // 1. Logic lấy hình ảnh
  let imageUrl = "https://via.placeholder.com/200x200?text=No+Image";
  if (product.hinh_anh && product.hinh_anh.length > 0) {
    const mainImg =
      product.hinh_anh.find((img) => img.la_anh_chinh === true) ||
      product.hinh_anh[0];
    imageUrl = mainImg.url_anh;
  }

  // 2. Logic lấy Giá tiền
  let giaCu = 0;
  let giaMoi = 0;
  if (product.bien_the && product.bien_the.length > 0) {
    giaCu = product.bien_the[0].gia_goc || 0;
    giaMoi = product.bien_the[0].gia_ban || giaCu;
  }

  // 3. Logic tính % Giảm giá
  const phanTramGiam =
    giaCu > 0 && giaCu > giaMoi
      ? Math.round(((giaCu - giaMoi) / giaCu) * 100)
      : 0;

  return (
    // Bọc toàn bộ card bằng thẻ Link để có thể click chuyển trang
    <Link
      to={`/product/${product.id}`}
      className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer relative font-sans flex flex-col h-full block"
    >
      {/* Khối Header của thẻ: Tag giảm giá & Nút Yêu thích */}
      <div className="flex justify-between items-start z-10 absolute w-full pr-6 top-3">
        {phanTramGiam > 0 ? (
          <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Giảm {phanTramGiam}%
          </div>
        ) : (
          <div className="bg-[#FF6A13] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Mới
          </div>
        )}
        <button
          className="text-blue-500 hover:text-red-500 text-[12px] flex items-center gap-1 font-medium z-20 cursor-pointer "
          onClick={(e) => {
            e.preventDefault();
            // TODO: Hàm thêm vào danh sách yêu thích
          }}
        >
          <img
            src={Icons.Favorite}
            alt="Yêu thích"
            className="w-5 h-5 brightness-100 invert"
          />
          Yêu thích
        </button>
      </div>

      {/* Ảnh Sản phẩm */}
      <div className="w-full aspect-square flex items-center justify-center p-2 mb-2 overflow-hidden mt-4">
        <img
          src={imageUrl}
          alt={product.ten_san_pham}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
        />
      </div>

      {/* Thông tin chữ */}
      <div className="flex-grow flex flex-col">
        <h3 className="text-gray-800 text-xs font-bold leading-tight group-hover:text-blue-600 line-clamp-2 min-h-[25px]">
          {product.ten_san_pham}
        </h3>

        {/* Tag Tình trạng */}
        <div className="mb-2">
          <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-sm font-medium">
            Hàng mới về
          </span>
        </div>

        {/* Cụm Giá */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-red-600 text-sm font-bold">
            {giaMoi > 0 ? giaMoi.toLocaleString("vi-VN") + "đ" : "Liên hệ"}
          </span>
          {giaCu > 0 && giaCu > giaMoi && (
            <span className="text-gray-400 text-[10px] font-medium line-through">
              {giaCu.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Khuyến mãi Sinh viên */}
        <div className="mb-3">
          <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded-sm">
            Student giảm thêm 500.000đ
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-2">
          <div className="flex text-[10px] gap-1.5 text-yellow-400 font-medium">
            <img src={Icons.Star} alt="đánh giá" className="w-3 h-3" />
            5.0
          </div>
          <div className="text-[10px] text-gray-500 font-medium">
            Lượt xem: {product.luot_xem || 0}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
