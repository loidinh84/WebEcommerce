import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingUnits, setShippingUnits] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Các state quản lý form
  const [tempPaymentMethod, setTempPaymentMethod] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [receiveEmail, setReceiveEmail] = useState(false);
  const [vatRequested, setVatRequested] = useState(false);
  const [vatInfo, setVatInfo] = useState({
    ten_cong_ty: "",
    mst: "",
    dia_chi_cty: "",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selected = cart.filter((item) => item.selected);
    if (selected.length === 0) {
      toast.error("Giỏ hàng trống!");
      return navigate("/cart");
    }
    setCheckoutItems(selected);

    if (user) {
      // Lấy địa chỉ
      fetch(`http://localhost:5000/api/taiKhoan/${user.id}/dia-chi`)
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data);
          setSelectedAddress(data.find((a) => a.la_mac_dinh) || data[0]);
        });

      // Lấy Đơn vị vận chuyển
      fetch("http://localhost:5000/api/donhang/vanchuyen")
        .then((res) => res.json())
        .then((data) => {
          setShippingUnits(data);
          if (data.length > 0) setSelectedShipping(data[0]);
        });

      // Lấy Phương thức thanh toán
      fetch("http://localhost:5000/api/donhang/thanhtoan")
        .then((res) => res.json())
        .then((data) => {
          setPaymentMethods(data);
          if (data.length > 0) {
            setPaymentMethod(data[0]);
            setTempPaymentMethod(data[0]);
          }
        });
    }
  }, [user, navigate]);

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === "LTLSHOP") {
      setVoucherDiscount(50000);
      toast.success("Áp dụng mã thành công!");
    } else {
      setVoucherDiscount(0);
      toast.error("Mã không hợp lệ hoặc đã hết hạn!");
    }
  };

  // Tính toán tiền
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.gia_ban * item.so_luong,
    0,
  );
  const shippingFee = selectedShipping
    ? Number(selectedShipping.phi_co_ban)
    : 0;
  const memberDiscountRate = user?.ty_le_giam_gia || 0;
  const paymentFee = paymentMethod ? Number(paymentMethod.phi_thanh_toan) : 0;
  const discountAmount = subtotal * memberDiscountRate;
  const total =
    subtotal + shippingFee - discountAmount - voucherDiscount - paymentFee;

  const handleConfirmOrder = async () => {
    if (!user) return toast.error("Vui lòng đăng nhập!");
    if (!selectedAddress)
      return toast.error("Vui lòng chọn địa chỉ giao hàng!");

    const orderData = {
      tai_khoan_id: user.id,
      dia_chi_id: selectedAddress.id,
      don_vi_vc_id: selectedShipping?.id,
      tong_tien_hang: subtotal,
      phi_van_chuyen: shippingFee,
      tien_giam_gia: discountAmount + voucherDiscount,
      tong_thanh_toan: total,
      ghi_chu: orderNote,
      phuong_thuc_tt: paymentMethod?.id,
      items: checkoutItems.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        ten_san_pham: item.ten_san_pham,
        so_luong: item.so_luong,
        gia_ban: item.gia_ban,
      })),
      vat_info: vatRequested ? vatInfo : null,
      receive_Email: receiveEmail,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/donhang/dat-hang",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Đặt hàng thành công!");

        const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
        const remainingCart = fullCart.filter((item) => !item.selected);
        localStorage.setItem("cart", JSON.stringify(remainingCart));

        setTimeout(() => navigate("/order-history"), 1500);
      } else {
        toast.error(result.message || "Lỗi đặt hàng!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getImageUrl = (url) => {
    if (!url) return "../assets/images/TayNghe.jpg";
    return url.startsWith("http")
      ? url
      : `http://localhost:5000/uploads/${url}`;
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-gray-800">
      <Header />
      <Toaster position="top-center" />

      <main className="container mx-auto p-4 max-w-6xl mt-2 mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Thanh toán đơn hàng
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ================= CỘT TRÁI: THÔNG TIN ================= */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* 1. THÔNG TIN NHẬN HÀNG */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Thông tin nhận hàng
                </h2>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-blue-600 text-xs font-medium hover:underline hover:underline cursor-pointer"
                >
                  Thay đổi
                </button>
              </div>
              {selectedAddress ? (
                <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 relative">
                  <p className="font-bold text-gray-800 text-base mb-1">
                    {selectedAddress.ho_ten_nguoi_nhan || user?.ho_ten}
                    <span className="font-normal text-gray-500 ml-2">
                      | {selectedAddress.so_dien_thoai}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.dia_chi_cu_the} {selectedAddress.phuong_xa}{" "}
                    {selectedAddress.quan_huyen} {selectedAddress.tinh_thanh}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Chưa có địa chỉ. Vui lòng thêm mới!
                </p>
              )}
            </div>

            {/* 2. KIỂM TRA SẢN PHẨM  */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                Danh sách sản phẩm
              </h2>
              <div className="flex flex-col gap-4">
                {checkoutItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <img
                      src={getImageUrl(item.hinh_anh)}
                      className="w-25 h-25 object-contain rounded bg-white p-2"
                      alt="sp"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700 text-sm">
                        {item.ten_san_pham}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Phân loại: {item.dung_luong} | {item.mau_sac}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">
                          Số lượng:{" "}
                          <b className="text-red-600 font-medium">
                            {item.so_luong}
                          </b>
                        </span>
                        <span className="font-bold text-[#e30019]">
                          {formatPrice(item.gia_ban)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VẬN CHUYỂN */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Phương thức vận chuyển
              </h2>
              <div className="flex flex-col gap-3 mb-6">
                {shippingUnits.map((unit) => (
                  <label
                    key={unit.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping?.id === unit.id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        className="w-4 h-4 accent-blue-600"
                        checked={selectedShipping?.id === unit.id}
                        onChange={() => setSelectedShipping(unit)}
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {unit.ten_don_vi}
                        </p>
                        <p className="text-xs text-gray-500">
                          Dự kiến nhận: {unit.thoi_gian_du_kien || "2-3 ngày"}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-800">
                      {formatPrice(unit.phi_co_ban)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
              <div
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(paymentMethod?.logo_url)}
                    className="w-10 h-10 object-contain"
                    alt="logo"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {paymentMethod?.ten_phuong_thuc || "Chọn phương thức"}
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-xs">
                  Thay đổi
                </button>
              </div>
            </div>

            {/* CÁC CHECKBOX TIỆN ÍCH */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-4">
              <label className="flex items-center font-medium gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                  checked={receiveEmail}
                  onChange={(e) => setReceiveEmail(e.target.checked)}
                />
                Nhận thông báo đơn hàng và ưu đãi qua Email
              </label>
              <label className="flex items-center font-medium gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                  checked={vatRequested}
                  onChange={(e) => setVatRequested(e.target.checked)}
                />
                Yêu cầu xuất hóa đơn công ty
              </label>
              {vatRequested && (
                <div className="p-4 bg-gray-50 rounded-lg grid grid-rows-3 border-gray-300 font-medium gap-4 ">
                  <input
                    type="text"
                    placeholder="Tên công ty"
                    className="row-span-1 border-b border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={vatInfo.ten_cong_ty}
                    onChange={(e) =>
                      setVatInfo({ ...vatInfo, ten_cong_ty: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Mã số thuế"
                    className="px-3 py-2 border-b border-gray-300 text-sm outline-none focus:border-blue-500"
                    value={vatInfo.mst}
                    onChange={(e) =>
                      setVatInfo({ ...vatInfo, mst: e.target.value })
                    }
                  />
                  <p className="text-gray-500 ml-3 font-inter text-xs italic">
                    Nhập 10 số hoặc 10 số - 3 số chi nhánh. Ví dụ: 1234567890
                    hoặc 1234567890-123.
                  </p>
                  <input
                    type="text"
                    placeholder="Địa chỉ công ty"
                    className="px-3 py-2 border-b border-gray-400 text-sm outline-none focus:border-blue-500"
                    value={vatInfo.dia_chi_cty}
                    onChange={(e) =>
                      setVatInfo({ ...vatInfo, dia_chi_cty: e.target.value })
                    }
                  />
                  <p className="text-gray-500 ml-3 font-inter text-xs italic">
                    <strong className="text-gray-700">Lưu ý:</strong> Từ ngày
                    1/7/2025, Quý khách vui lòng nhập địa chỉ mới theo bản đồ
                    sáp nhập để đảm bảo hóa đơn hợp lệ.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ================= CỘT PHẢI: TÓM TẮT ĐƠN HÀNG ================= */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-30">
              <h2 className="text-xl font-bold font-inter text-gray-800">
                Chi tiết thanh toán
              </h2>

              {/* Voucher */}
              <div className="py-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 "
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Tính tiền */}
              <div className="flex flex-col gap-3 text-sm text-gray-600 mb-2 border-b border-gray-300 pb-5">
                <div className="flex justify-between">
                  <span>Số lượng sản phẩm:</span>
                  <b>{checkoutItems.length}</b>
                </div>
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <b>{formatPrice(subtotal)}</b>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <b>{formatPrice(shippingFee)}</b>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 rounded text-xs font-medium tracking-wider p-1">
                    <span>Giảm giá ({user?.ten_hang || "Thành viên"}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-blue-600 bg-blue-50 rounded text-xs font-medium tracking-wider p-1">
                    <span>Mã ưu đãi:</span>
                    <span>-{formatPrice(voucherDiscount)}</span>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Ghi chú..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-none h-20 bg-gray-50/50"
                ></textarea>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-800 text-xl">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-[#e30019]">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full bg-[#e30019] text-white py-2.5 rounded-lg font-bold text-lg hover:bg-red-700 shadow-md transition cursor-pointer"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">
                Chọn phương thức thanh toán
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-3xl text-gray-400 hover:text-red-500 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <div
                    onClick={() => setTempPaymentMethod(method)}
                    className={`flex items-center gap-4 p-4 border border-gray-300 rounded-xl cursor-pointer transition-all ${tempPaymentMethod?.id === method.id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <img
                      src={getImageUrl(method.logo_url)}
                      className="w-10 h-10 object-contain"
                      alt="bank"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">
                        {method.ten_phuong_thuc}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {method.loai === "bank_transfer"
                          ? "Quét mã để thanh toán nhanh"
                          : "Thanh toán an toàn"}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tempPaymentMethod?.id === method.id ? "border-blue-600" : "border-gray-300"}`}
                    >
                      {tempPaymentMethod?.id === method.id && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setPaymentMethod(tempPaymentMethod);
                  setIsPaymentModalOpen(false);
                }}
                className="w-full bg-[#e30019] text-white py-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
