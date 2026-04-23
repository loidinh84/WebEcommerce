import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../../config/api";
import toast from "react-hot-toast";
import * as Icons from "../../assets/icons/index";

const orderTabs = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đang xử lý" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "refunded", label: "Trả hàng/Hoàn tiền" },
  { id: "cancelled", label: "Đã hủy" },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${time} ${day}`;
};

const OrdersTab = ({ profileData, navigate }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(5);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [ratingInput, setRatingInput] = useState({});
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]);

  useEffect(() => {
    if (profileData?.allOrders) {
      const reviewedIds = profileData.allOrders
        .filter((order) => order.danh_gia && order.danh_gia.length > 0)
        .map((order) => order.id);
      setReviewedOrderIds(reviewedIds);
    }
  }, [profileData]);

  const filteredOrders =
    activeTab === "all"
      ? profileData?.allOrders || []
      : (profileData?.allOrders || []).filter(
          (order) => order.trang_thai === activeTab,
        );

  const displayedOrders = filteredOrders.slice(0, visibleCount);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredOrders.length > visibleCount) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, filteredOrders.length]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisibleCount(5);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-blue-500 text-sm font-medium">
            Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="text-amber-400 text-sm font-medium">Đang xử lý</span>
        );
      case "shipping":
        return (
          <span className="text-orange-600 text-sm font-medium">Đang giao</span>
        );
      case "delivered":
        return (
          <span className="text-green-600 text-sm font-medium">
            Đơn hàng đã hoàn thành
          </span>
        );
      case "refunded":
        return (
          <span className="text-gray-700 text-sm font-medium">
            Trả hàng/Hoàn tiền
          </span>
        );
      case "cancelled":
        return <span className="text-red-500 text-sm font-medium">Đã hủy</span>;
      default:
        return null;
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để đánh giá!");
        return;
      }

      const promises = selectedOrderForReview.chi_tiet.map(async (prod) => {
        const reviewData = ratingInput[prod.id] || {
          sao: 5,
          noi_dung: "Sản phẩm rất tốt!",
          images: [],
        };
        const formData = new FormData();
        formData.append("tai_khoan_id", profileData.userInfo.id);
        formData.append("so_sao", reviewData.sao);
        formData.append("noi_dung", reviewData.noi_dung);
        formData.append("don_hang_id", selectedOrderForReview.id);

        if (reviewData.images && reviewData.images.length > 0) {
          reviewData.images.forEach((file) => {
            formData.append("hinh_anh", file);
          });
        }

        const response = await fetch(
          `${BASE_URL}/api/sanPham/${prod.bien_the.san_pham_id}/danh-gia`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Lỗi khi gửi đánh giá cho sản phẩm!");
        }

        return response.json();
      });

      await Promise.all(promises);

      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
      setReviewModalOpen(false);
      setReviewedOrderIds((prev) => [...prev, selectedOrderForReview.id]);
      setRatingInput({});
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra khi gửi đánh giá!");
    }
  };

  const handleImageUpload = (e, prodId) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setRatingInput((prev) => {
      const currentData = prev[prodId] || {
        sao: 5,
        noi_dung: "",
        images: [],
        previewUrls: [],
      };
      // Giới hạn tối đa 5 ảnh cho mỗi sản phẩm
      const newImages = [...(currentData.images || []), ...files].slice(0, 5);
      // Tạo URL tạm thời để hiển thị ảnh ngay lập tức (Preview)
      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));

      return {
        ...prev,
        [prodId]: {
          ...currentData,
          images: newImages,
          previewUrls: newPreviewUrls,
        },
      };
    });
  };

  const handleRemoveImage = (prodId, indexToRemove) => {
    setRatingInput((prev) => {
      const currentData = prev[prodId];
      if (!currentData) return prev;

      const newImages = currentData.images.filter(
        (_, idx) => idx !== indexToRemove,
      );
      const newPreviewUrls = currentData.previewUrls.filter(
        (_, idx) => idx !== indexToRemove,
      );

      return {
        ...prev,
        [prodId]: {
          ...currentData,
          images: newImages,
          previewUrls: newPreviewUrls,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Bộ lọc trạng thái */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 flex overflow-x-auto no-scrollbar">
        {orderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`whitespace-nowrap flex-1 py-4 px-4 text-sm font-medium transition cursor-pointer relative ${
              activeTab === tab.id
                ? "text-blue-500"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="flex flex-col gap-3">
        {displayedOrders.length > 0 ? (
          <>
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header Card */}
                <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm flex items-center gap-1 ">
                      Mã đơn hàng:{" "}
                      <div className="text-xs">{order.ma_don_hang}</div>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(order.trang_thai)}
                  </div>
                </div>

                <div
                  className="px-3 py-1 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => navigate(`/order-detail/${order.id}`)}
                >
                  {order.chi_tiet?.map((prod, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <img
                        src={
                          prod.bien_the?.san_pham?.hinh_anh?.[0]?.url_anh
                            ? `${BASE_URL}${prod.bien_the.san_pham.hinh_anh[0].url_anh}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={prod.ten_sp_luc_mua}
                        className="w-20 h-18 object-contain border border-gray-100"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-800 text-sm font-medium line-clamp-2 leading-5">
                          {prod.ten_sp_luc_mua}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Phân loại hàng: {prod.bien_the?.mau_sac || "Mặc định"}
                          {prod.bien_the?.dung_luong
                            ? ` - ${prod.bien_the.dung_luong}`
                            : ""}
                          {prod.bien_the?.ram ? ` - ${prod.bien_the.ram}` : ""}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          x{prod.so_luong}
                        </p>
                      </div>
                      <div className="text-right text-sm text-[#ee4d2d]">
                        {formatPrice(prod.don_gia)}₫
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Card */}
                <div className="p-3 bg-[#fffaf9] border-t border-gray-100 flex flex-col">
                  {/* Dòng tổng tiền */}
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-sm text-gray-600">Thành tiền:</span>
                    <span className="text-lg font-medium text-red-500">
                      {formatPrice(order.tong_thanh_toan)}₫
                    </span>
                  </div>

                  {/* Dòng action & thời gian */}
                  <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-600">
                      {order.trang_thai === "cancelled"
                        ? "Đã hủy vào: "
                        : "Ngày đặt: "}
                      {formatDateTime(order.created_at)}
                    </span>

                    <div className="flex gap-2">
                      {order.trang_thai === "delivered" &&
                        !reviewedOrderIds.includes(order.id) && (
                          <button
                            onClick={() => {
                              setSelectedOrderForReview(order);
                              setReviewModalOpen(true);
                            }}
                            className="bg-[#ee4d2d] text-white rounded-sm px-3 py-1.5 text-sm hover:bg-[#d73211] transition cursor-pointer min-w-[120px]"
                          >
                            Đánh Giá
                          </button>
                        )}

                      {(order.trang_thai === "delivered" ||
                        order.trang_thai === "cancelled" ||
                        order.trang_thai === "refunded") && (
                        <button
                          onClick={() => {
                            const currentCart =
                              JSON.parse(localStorage.getItem("cart")) || [];
                            const itemsToRebuy = order.chi_tiet.map((prod) => ({
                              id: prod.bien_the?.san_pham_id,
                              variantId: prod.bien_the_id,
                              ten_san_pham: prod.ten_sp_luc_mua,
                              hinh_anh:
                                prod.bien_the?.san_pham?.hinh_anh?.[0]
                                  ?.url_anh || "",
                              gia_ban: prod.don_gia,
                              so_luong: 1,
                              dung_luong: prod.bien_the?.dung_luong || "",
                              mau_sac: prod.bien_the?.mau_sac || "",
                              selected: true,
                            }));
                            itemsToRebuy.forEach((newItem) => {
                              const existingItem = currentCart.find(
                                (item) => item.variantId === newItem.variantId,
                              );
                              if (existingItem) {
                                existingItem.so_luong += newItem.so_luong;
                              } else {
                                currentCart.push(newItem);
                              }
                            });
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(currentCart),
                            );
                            toast.success("Đã thêm sản phẩm vào giỏ hàng!");
                            navigate("/cart");
                          }}
                          className={`${
                            order.trang_thai === "cancelled"
                              ? "bg-[#ee4d2d] text-white hover:bg-[#d73211] border border-transparent"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          } px-3 py-1.5 rounded-sm text-sm transition cursor-pointer min-w-[120px]`}
                        >
                          Mua Lại
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/order-detail/${order.id}`)}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-sm text-sm hover:bg-gray-50 transition cursor-pointer min-w-[120px]"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator / Intersection Observer Target */}
            {filteredOrders.length > visibleCount && (
              <div ref={observerTarget} className="text-center py-6">
                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-[#ee4d2d] rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-sm py-24 text-center flex flex-col items-center border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">Chưa có đơn hàng nào!</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-2.5 bg-blue-100 text-gray-800 font-bold rounded-sm hover:bg-blue-200 transition cursor-pointer"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
      {reviewModalOpen && selectedOrderForReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in">
            {/* Header Modal */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-md">
              <h3 className="text-lg font-bold text-gray-800">
                Đánh Giá Sản Phẩm
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-2xl font-light cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Nội dung danh sách sản phẩm */}
            <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {selectedOrderForReview.chi_tiet?.map((prod, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  {/* Tên SP */}
                  <div className="flex gap-4 items-center mb-4">
                    <img
                      src={
                        prod.bien_the?.san_pham?.hinh_anh?.[0]?.url_anh
                          ? `${BASE_URL}${prod.bien_the.san_pham.hinh_anh[0].url_anh}`
                          : "https://via.placeholder.com/50"
                      }
                      alt="SP"
                      className="w-12 h-12 object-contain border border-gray-200 rounded"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {prod.ten_sp_luc_mua}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Phân loại hàng: {prod.bien_the?.mau_sac || "Mặc định"}
                        {prod.bien_the?.dung_luong
                          ? ` - ${prod.bien_the.dung_luong}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Chọn Sao */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-700 font-medium">
                      Chất lượng sản phẩm:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setRatingInput({
                              ...ratingInput,
                              [prod.id]: { ...ratingInput[prod.id], sao: star },
                            })
                          }
                          className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${
                            (ratingInput[prod.id]?.sao || 5) >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-light text-yellow-500">
                      {
                        [
                          "",
                          "Tệ",
                          "Không hài lòng",
                          "Bình thường",
                          "Hài lòng",
                          "Tuyệt vời",
                        ][ratingInput[prod.id]?.sao || 5]
                      }
                    </span>
                  </div>

                  {/* Ô nhập Text */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <textarea
                      placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                      className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none h-20"
                      onChange={(e) =>
                        setRatingInput({
                          ...ratingInput,
                          [prod.id]: {
                            ...ratingInput[prod.id],
                            noi_dung: e.target.value,
                          },
                        })
                      }
                    ></textarea>

                    {/* Nút thêm ảnh ảo */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {/* Hiển thị ảnh Preview (nếu có) */}
                      {ratingInput[prod.id]?.previewUrls?.map((url, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative w-16 h-16 border border-gray-200 rounded-sm overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(prod.id, imgIdx)}
                            className="absolute top-0 right-0 bg-black/50 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* Nút upload ẩn */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id={`upload-review-img-${prod.id}`}
                        onChange={(e) => handleImageUpload(e, prod.id)}
                      />
                      {(!ratingInput[prod.id]?.images ||
                        ratingInput[prod.id]?.images.length < 5) && (
                        <button
                          onClick={() =>
                            document
                              .getElementById(`upload-review-img-${prod.id}`)
                              .click()
                          }
                          className="w-16 h-16 border border-dashed border-[#ee4d2d] text-[#ee4d2d] flex flex-col items-center justify-center text-xs rounded-sm hover:bg-red-50 transition"
                        >
                          <Icons.Add />
                          Thêm Ảnh
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-md">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-1 border border-gray-300 rounded-sm text-gray-700 hover:bg-white transition font-medium cursor-pointer"
              >
                Trở lại
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-1 bg-[#ee4d2d] text-white rounded-sm hover:bg-[#d73211] transition font-medium shadow-md shadow-red-200 cursor-pointer"
              >
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
