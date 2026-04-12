import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import * as Icons from "../assets/icons/index";
import SpecsModal from "../components/SpecsModal";
import CompareModal from "../components/CompareModal";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 1. Quản lý trạng thái dữ liệu
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Quản lý lựa chọn của người dùng
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 3. Quản lý giao diện
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // 4. Quản lý Form Đánh giá
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // 5. State cho Sản phẩm tương tự & Đánh giá
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        if (!id || id === "undefined") return;
        // 1. Fetch Chi tiết sản phẩm
        const resDetail = await fetch(`${BASE_URL}/api/sanpham/${id}`);
        if (!resDetail.ok) throw new Error("Không tìm thấy sản phẩm");
        const dataDetail = await resDetail.json();
        setProduct(dataDetail);

        if (dataDetail.bien_the?.length > 0)
          setSelectedVariant(dataDetail.bien_the[0]);
        if (dataDetail.hinh_anh?.length > 0) {
          const mainImg =
            dataDetail.hinh_anh.find((img) => img.la_anh_chinh) ||
            dataDetail.hinh_anh[0];
          setMainImage(mainImg.url_anh);
        }

        // 2. Fetch Sản phẩm tương tự
        try {
          const resSimilar = await fetch(
            `${BASE_URL}/api/sanpham/${id}/tuong-tu`,
          );
          if (resSimilar.ok) setSimilarProducts(await resSimilar.json());
        } catch (e) {
          console.error("Lỗi lấy SP tương tự", e);
        }

        // 3. Fetch Đánh giá
        fetchReviews();
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const resReviews = await fetch(`${BASE_URL}/api/sanpham/${id}/danh-gia`);
      if (resReviews.ok) {
        const data = await resReviews.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Lỗi lấy đánh giá", e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x400?text=No+Image";
    return url.startsWith("http") ? url : `${BASE_URL}/uploads/${url}`;
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success("Đã thêm vào danh sách yêu thích!");
    } else {
      toast("Đã bỏ khỏi danh sách yêu thích");
    }
  };

  const scrollToReview = () => {
    const reviewSection = document.getElementById("review-section");
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá!");
      navigate("/login");
      return;
    }
    if (userRating === 0) return toast.error("Vui lòng chọn số sao đánh giá!");
    if (reviewText.trim().length < 10)
      return toast.error("Vui lòng nhập đánh giá ít nhất 10 ký tự!");

    try {
      const response = await fetch(`${BASE_URL}/api/sanpham/${id}/danh-gia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tai_khoan_id: user.id,
          so_sao: userRating,
          noi_dung: reviewText,
        }),
      });

      if (response.ok) {
        toast.success("Cảm ơn bạn! Đánh giá đã được gửi.");
        setUserRating(0);
        setReviewText("");
        fetchReviews();
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Lỗi khi gửi đánh giá!");
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ!", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép đường dẫn!");
    setIsShareModalOpen(false);
  };

  const formatTimeAgo = (dateString) => {
    const mailDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - mailDate) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return mailDate.toLocaleDateString("vi-VN");
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return toast.error("Vui lòng chọn phân loại sản phẩm!");
    }

    // 1. Lấy giỏ hàng hiện tại từ localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Tạo đối tượng item mới
    const cartItem = {
      id: product.id,
      variantId: selectedVariant.id,
      ten_san_pham: product.ten_san_pham,
      hinh_anh: mainImage,
      gia_ban: selectedVariant.gia_ban || selectedVariant.gia_goc,
      dung_luong: selectedVariant.dung_luong,
      mau_sac: selectedVariant.mau_sac,
      so_luong: quantity,
    };
    // 3. Kiểm tra xem sản phẩm (cùng variant) đã có trong giỏ chưa
    const existingIndex = currentCart.findIndex(
      (item) => item.variantId === selectedVariant.id,
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].so_luong += quantity;
    } else {
      currentCart.push(cartItem);
    }
    // 4. Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart));

    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3F4F6] min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4A44F2]"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F3F4F6] min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-800 font-bold mb-4">
          Sản phẩm không tồn tại hoặc đã bị xóa!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#4A44F2] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Quay về Trang chủ
        </button>
      </div>
    );
  }

  const giaBan = selectedVariant?.gia_ban || selectedVariant?.gia_goc || 0;
  const giaGoc = selectedVariant?.gia_goc || 0;
  const phanTramGiam =
    giaGoc > giaBan ? Math.round(((giaGoc - giaBan) / giaGoc) * 100) : 0;

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans relative pb-10">
      <Header />

      <Toaster position="bottom-right" reverseOrder={false} />
      <main className="container mx-auto px-4 max-w-[1200px] py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 flex gap-2">
          <span
            onClick={() => navigate("/")}
            className="hover:text-[#4A44F2] cursor-pointer"
          >
            Trang chủ
          </span>{" "}
          /
          <span className="hover:text-[#4A44F2] cursor-pointer">
            {product.thuong_hieu || "Điện thoại"}
          </span>{" "}
          /
          <span className="text-gray-800 font-medium">
            {product.ten_san_pham}
          </span>
        </div>

        {/* ================= KHỐI 1: THÔNG TIN SẢN PHẨM ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* --- CỘT TRÁI: TÊN SP, ĐÁNH GIÁ, 4 NÚT ACTION VÀ HÌNH ẢNH --- */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              {/* 1. Tên Sản Phẩm */}
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                {product.ten_san_pham}
              </h1>

              {/* 2. Sao và Đánh giá */}
              <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icons.Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(reviews.reduce((acc, curr) => acc + curr.so_sao, 0) / (reviews.length || 5)) ? "fill-yellow-400" : "fill-gray-300"}`}
                    />
                  ))}
                </div>
                <span
                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                  onClick={scrollToReview}
                >
                  ({reviews.length} đánh giá)
                </span>
                <span className="text-gray-300 mx-1">|</span>
                <span className="text-gray-500">
                  Lượt xem: {product.luot_xem || 0}
                </span>
              </div>

              {/* 3. Bốn Nút Action */}
              <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-600 mb-3 border-b border-gray-100 pb-4">
                <button
                  onClick={handleWishlist}
                  className={`flex items-center gap-1.5 text-blue-600 cursor-pointer transition ${isWishlisted ? "text-red-500" : "hover:text-blue-400"}`}
                >
                  <Icons.Favorite />
                  Yêu thích
                </button>
                <button
                  onClick={scrollToReview}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer text-blue-600"
                >
                  <Icons.Comment className="w-5 h-5" /> Đánh giá
                </button>
                <button
                  onClick={() => setIsSpecsModalOpen(true)}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition cursor-pointer text-blue-600"
                >
                  <Icons.Memory />
                  Thông số
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="flex items-center gap-1 hover:text-blue-400 transition cursor-pointer text-blue-600"
                >
                  <Icons.Compare /> So sánh
                </button>
              </div>

              {/* Hình ảnh và Nút Chia sẻ */}
              <div className="border border-gray-100 rounded-xl p-4 flex justify-center items-center h-[360px] bg-white relative mt-2 group">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 shadow-sm transition opacity-70 group-hover:opacity-100 cursor-pointer"
                  title="Chia sẻ sản phẩm này"
                >
                  <Icons.Share />
                </button>

                <img
                  src={getImageUrl(mainImage)}
                  alt="Main"
                  className="max-h-full object-contain"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 justify-center mt-2">
                {product.hinh_anh &&
                  product.hinh_anh.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img.url_anh)}
                      className={`w-16 h-16 border rounded-lg p-1 shrink-0 transition-all ${mainImage === img.url_anh ? "border-red-600 border-2" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <img
                        src={getImageUrl(img.url_anh)}
                        alt={`Thumb ${idx}`}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* --- CỘT PHẢI: GIÁ, BIẾN THỂ, KHUYẾN MÃI VÀ NÚT MUA --- */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold text-red-600">
                  {giaBan > 0 ? formatPrice(giaBan) : "Liên hệ"}
                </span>
                {phanTramGiam > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-base mb-1">
                      {formatPrice(giaGoc)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase">
                      Giảm {phanTramGiam}%
                    </span>
                  </>
                )}
              </div>

              {/* Chọn Phiên bản */}
              <div className="mb-5">
                <p className="font-semibold text-gray-800 mb-2">
                  Chọn Phân Loại:
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {product.bien_the &&
                    product.bien_the.map((bt) => (
                      <button
                        key={bt.id}
                        onClick={() => setSelectedVariant(bt)}
                        className={`py-2 px-2 border rounded-lg text-sm cursor-pointer font-medium flex flex-col items-center gap-1 transition ${selectedVariant?.id === bt.id ? "border-red-600 text-red-600 bg-red-50" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}
                      >
                        <span>
                          {bt.dung_luong || ""}{" "}
                          {bt.mau_sac ? `- ${bt.mau_sac}` : ""}
                        </span>
                        <span className="font-bold text-xs">
                          {formatPrice(bt.gia_ban || bt.gia_goc)}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* KHUYẾN MÃI ĐI KÈM */}
              <div className="border border-red-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-red-50 text-red-600 font-bold px-4 py-2.5 flex items-center gap-2 border-b border-red-100">
                  <Icons.Box className="w-6 h-6" />
                  Khuyến mãi đi kèm
                </div>
                <div className="p-4 bg-white text-sm text-gray-700 flex flex-col gap-2.5">
                  {(() => {
                    let promos = [];
                    if (product.danh_muc_id === 5) {
                      // Khuyến mãi cho Điện thoại
                      promos = [
                        "Tặng gói bảo hành độc quyền LTL Care+ 12 tháng",
                        "Trợ giá thêm 2.000.000đ khi thu cũ đổi mới",
                        "Tặng ốp lưng và dán cường lực cao cấp",
                      ];
                    } else if (product.danh_muc_id === 4) {
                      // Khuyến mãi cho Laptop
                      promos = [
                        "Tặng Balo Laptop LTL cao cấp",
                        "Tặng chuột không dây chính hãng",
                        "Giảm 20% khi mua kèm tai nghe hoặc phần mềm Office",
                      ];
                    } else {
                      // Khuyến mãi chung cho Phụ kiện / PC
                      promos = [
                        "Giảm giá 5% cho thành viên LTLShop",
                        "Miễn phí giao hàng toàn quốc cho đơn từ 300K",
                      ];
                    }
                    // Render mảng thành các dòng HTML
                    return promos.map((promo, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] mt-0.5 shrink-0">
                          ✓
                        </span>
                        <span>{promo}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* SỐ LƯỢNG  */}
              <div className="mb-4 flex items-center gap-4">
                <p className="font-semibold text-gray-800 w-20">Số lượng:</p>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit h-10 bg-white shrink-0 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 hover:bg-gray-50 h-full font-bold text-gray-500"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-10 text-center font-medium text-gray-800 outline-none bg-transparent text-sm border-x border-gray-200 h-full"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 hover:bg-gray-50 h-full font-bold text-gray-500"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Nút Mua */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  disabled={!selectedVariant || selectedVariant.ton_kho === 0}
                  className={`flex-1 text-white cursor-pointer h-12 rounded-lg font-bold transition shadow-md leading-tight ${
                    !selectedVariant || selectedVariant.ton_kho === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <span className="text-[16px]">Mua ngay</span>
                </button>
                <div className="flex gap-2 w-full sm:w-1/3">
                  <button
                    disabled={!selectedVariant || selectedVariant.ton_kho === 0}
                    onClick={handleAddToCart}
                    className={`flex-1 text-white h-12 rounded-lg cursor-pointer font-bold transition ${!selectedVariant || selectedVariant.ton_kho === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    <span className="text-[16px]">Thêm vào giỏ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= KHỐI 2: MÔ TẢ & THÔNG SỐ NGẮN ================= */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-8/12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600 uppercase">
              Đặc điểm nổi bật
            </h3>
            <div
              className="prose text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  product.mo_ta_day_du ||
                  product.mo_ta_ngan ||
                  "Chưa có bài viết cho sản phẩm này.",
              }}
            />
          </div>

          <div className="w-full md:w-4/12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Thông số kỹ thuật
            </h3>
            <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden">
              {product.thuoc_tinh && product.thuoc_tinh.length > 0 ? (
                product.thuoc_tinh.slice(0, 6).map((spec, idx) => (
                  <div
                    key={idx}
                    className={`flex py-3 px-3 text-sm ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <span className="w-5/12 text-gray-500 pr-2">
                      {spec.ten_thuoc_tinh}
                    </span>
                    <span className="w-7/12 text-gray-800 font-medium">
                      {spec.gia_tri}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Chưa cập nhật thông số
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= KHỐI 3: SẢN PHẨM TƯƠNG TỰ ================= */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase">
              Sản phẩm tương tự
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((sp) => {
                const imgTuongTu =
                  sp.hinh_anh?.find((i) => i.la_anh_chinh)?.url_anh ||
                  sp.hinh_anh?.[0]?.url_anh;
                const giaTTR =
                  sp.bien_the?.[0]?.gia_ban || sp.bien_the?.[0]?.gia_goc || 0;
                const giaTTRGoc = sp.bien_the?.[0]?.gia_goc || 0;

                return (
                  <div
                    key={sp.id}
                    onClick={() => navigate(`/product/${sp.id}`)}
                    className="border border-gray-100 rounded-lg p-4 hover:shadow-lg transition cursor-pointer flex flex-col group"
                  >
                    <img
                      src={getImageUrl(imgTuongTu)}
                      alt={sp.ten_san_pham}
                      className="w-full h-40 object-contain mb-4 group-hover:-translate-y-1 transition-transform mix-blend-multiply"
                    />
                    <h4 className="text-sm font-bold text-gray-800 mb-2 hover:text-blue-600 line-clamp-2">
                      {sp.ten_san_pham}
                    </h4>
                    <div className="flex items-end gap-2 mt-auto">
                      <span className="text-red-600 font-bold">
                        {formatPrice(giaTTR)}
                      </span>
                      {giaTTRGoc > giaTTR && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">
                          {formatPrice(giaTTRGoc)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= KHỐI 4: ĐÁNH GIÁ & HỎI ĐÁP ================= */}
        <div
          id="review-section"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Đánh giá sản phẩm
          </h2>
          <div className="flex flex-col lg:flex-row gap-4 border-b border-gray-100 pb-8 mb-6">
            <div className="w-full lg:w-1/3 flex flex-col items-center justify-center border-r border-gray-100">
              {/* Tính trung bình sao */}
              <span className="text-3xl font-bold text-yellow-500">
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, curr) => acc + curr.so_sao, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "5.0"}
              </span>
              <div className="flex text-yellow-400 text-xl my-2">★★★★★</div>
              <span className="text-sm text-gray-500">
                {reviews.length} đánh giá
              </span>
            </div>

            <div className="w-full lg:w-2/3">
              <h4 className="font-semibold text-gray-800 mb-3">
                Gửi đánh giá của bạn
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-600">
                    Bạn chấm mấy sao?
                  </span>
                  <div className="flex text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`transition ${star <= userRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-none h-24 mb-3"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitReview}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HIỂN THỊ DANH SÁCH ĐÁNH GIÁ (Thay vì Anh Tú cứng) */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rv) => (
                <div key={rv.id} className="border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full overflow-hidden flex items-center justify-center font-bold">
                      {rv.nguoi_dung?.anh_dai_dien ? (
                        <img
                          src={getImageUrl(rv.nguoi_dung.anh_dai_dien)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        rv.nguoi_dung?.ho_ten?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <span className="font-bold text-gray-800">
                      {rv.nguoi_dung?.ho_ten || "Khách hàng"}
                    </span>
                    <span className="text-xs text-gray-400">
                      ·{formatTimeAgo(rv.created_at)}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 text-sm mb-2">
                    {"★".repeat(rv.so_sao)}
                    {"☆".repeat(5 - rv.so_sao)}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {rv.noi_dung}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Nút Lên đầu trang */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl shadow-xl hover:bg-red-600 transition-colors animate-fade-in-up"
        >
          ↑
        </button>
      )}

      {/* ================= MODAL CHIA SẺ ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                Chia sẻ sản phẩm
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-3xl leading-none  cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex gap-4 justify-center mb-6 border-y border-gray-100 py-6">
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank",
                  )
                }
                className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center font-bold text-2xl hover:opacity-80 transition cursor-pointer"
                title="Chia sẻ lên Facebook"
              >
                f
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://zalo.me/share?url=${window.location.href}`,
                    "_blank",
                  )
                }
                className="w-12 h-12 bg-[#0068FF] text-white rounded-full flex items-center justify-center font-bold text-[14px] hover:opacity-80 transition cursor-pointer"
                title="Chia sẻ qua Zalo"
              >
                Zalo
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${window.location.href}`,
                    "_blank",
                  )
                }
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl hover:opacity-80 transition cursor-pointer"
                title="Chia sẻ lên X"
              >
                X
              </button>
            </div>

            <p className="text-sm text-gray-500 font-medium mb-2">
              Hoặc sao chép liên kết:
            </p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 h-10">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 bg-transparent px-3 text-sm text-gray-600 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 h-full font-semibold text-sm transition  cursor-pointer"
              >
                Sao chép
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GỌI MODAL ================= */}
      <SpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        specs={product.thuoc_tinh || []}
      />
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        productName={product.ten_san_pham}
      />
    </div>
  );
};

export default ProductDetail;
