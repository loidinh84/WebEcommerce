import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import * as Icons from "../assets/icons/index";

const ProductCard = ({ product, onLikeChange }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user?.id || !product?.id) return;
      try {
        const res = await fetch(
          `${BASE_URL}/api/wishlist/check/${user.id}/${product.id}`,
        );
        const data = await res.json();
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Lỗi kiểm tra yêu thích:", error);
      }
    };
    checkLikeStatus();
  }, [user?.id, product?.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tai_khoan_id: user.id,
          san_pham_id: product.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLiked(data.isLiked);
        if (onLikeChange) onLikeChange(data.isLiked);
        if (data.isLiked) {
          toast.success("Đã thêm vào danh sách yêu thích!");
        } else {
          toast.success("Đã bỏ yêu thích sản phẩm.");
        }
      } else {
        toast.error(data.message || "Có lỗi xảy ra!");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setIsLiking(false);
    }
  };

  let imageUrl = "../assets/NoImage.webp";
  if (product.hinh_anh && product.hinh_anh.length > 0) {
    const mainImg =
      product.hinh_anh.find((img) => img.la_anh_chinh === true) ||
      product.hinh_anh[0];
    imageUrl = mainImg.url_anh;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }
  }

  let giaCu = 0;
  let giaMoi = 0;
  if (product.bien_the && product.bien_the.length > 0) {
    giaCu = product.bien_the[0].gia_goc || 0;
    giaMoi = product.bien_the[0].gia_ban || giaCu;
  }

  const phanTramGiam =
    giaCu > 0 && giaCu > giaMoi
      ? Math.round(((giaCu - giaMoi) / giaCu) * 100)
      : 0;

  // Kiểm tra sản phẩm mới (trong 5 ngày)
  const isNewProduct = product.created_at
    ? (Date.now() - new Date(product.created_at).getTime()) /
        (1000 * 60 * 60 * 24) <=
      5
    : false;

  const avgRating = product.danh_gia_trung_binh
    ? Number(product.danh_gia_trung_binh)
    : null;

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer relative font-sans flex flex-col h-full"
    >
      {/* Khối Header của thẻ: Tag giảm giá & Nút Yêu thích */}
      <div className="flex justify-between items-start z-10 absolute w-full pr-6 top-3">
        {phanTramGiam > 0 ? (
          <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Giảm {phanTramGiam}%
          </div>
        ) : isNewProduct ? (
          <div className="bg-[#FF6A13] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            Mới
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={handleToggleFavorite}
          disabled={isLiking}
          className={`flex items-center gap-1 text-[12px] font-medium z-20 cursor-pointer transition-colors ${
            isLiked ? "text-red-500" : "text-blue-400 hover:text-red-500"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 animate-scale-up"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <Icons.Favorite className="w-5 h-5" />
          )}
          Yêu thích
        </button>
      </div>

      {/* Ảnh Sản phẩm */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden mt-2">
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

        {/* Tag Hàng mới về */}
        {isNewProduct && (
          <div className="mb-2">
            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-sm font-medium">
              Hàng mới về
            </span>
          </div>
        )}

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

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-2">
          <div className="flex text-[10px] gap-0.5 text-yellow-400 font-medium items-center">
            {avgRating !== null ? (
              <>
                <Icons.Star className="w-3 h-3 fill-yellow-400" />
                <span>{avgRating.toFixed(1)}</span>
              </>
            ) : (
              <>
                <Icons.Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400">5.0 </span>
              </>
            )}
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
