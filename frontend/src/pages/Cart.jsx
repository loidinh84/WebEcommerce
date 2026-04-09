import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index"; // Đảm bảo import đúng đường dẫn ảnh

const Cart = () => {
  // Mock data dựa trên ảnh tham khảo
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "PC TTG GAMING i5 12400F - 16GB DDR4- RTX 3060 8GB OC WHITE",
      specs:
        "CPU: i5 12400F | RAM: 16GB DDR4 | Ổ cứng SSD: 500GB | Tản nhiệt: Khí",
      price: 23680000,
      quantity: 1,
      image: Images.Logo, // Ông chủ thay bằng ảnh SP thật: Images.PC1
    },
    {
      id: 2,
      name: "PC TTG GAMING PRO i5 12600KF - 16GB DDR4 - RX 6600 XT 8GB OC",
      specs:
        "CPU: i5 12600KF | RAM: 16GB DDR4 | Ổ cứng SSD: 500GB | Tản nhiệt: Khí",
      price: 23180000,
      quantity: 1,
      image: Images.Logo, // Ông chủ thay bằng ảnh SP thật: Images.PC2
    },
  ]);

  const [formData, setFormData] = useState({
    hoTen: "DOKHACLEVIS",
    sdt: "0346690201",
    email: "levisdokha16@gmail.com",
    diaChi: "34 đường 14 khu phố 2 phường Hiệp Bình Chánh Thủ Đức Hồ Chí Minh",
    tinhThanh: "",
    quanHuyen: "",
    ghiChu: "",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4A44F2]">Giỏ hàng</h1>
          <button className="text-red-500 hover:text-red-700 font-medium cursor-pointer">
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* --- DANH SÁCH SẢN PHẨM --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-100 last:border-0 gap-4"
            >
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain border rounded p-1"
                />
                <div>
                  <h3 className="font-bold text-sm hover:text-[#4A44F2] cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.specs.split(" | ").map((spec, i) => (
                      <span key={i} className="block">
                        {spec}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Bảo hành: 36 tháng
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/6 text-center font-medium">
                {formatPrice(item.price)}
              </div>

              <div className="w-full md:w-1/6 flex justify-center items-center">
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                    -
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="w-10 text-center outline-none text-sm font-medium"
                  />
                  <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/6 flex justify-between md:justify-end items-center gap-4">
                <span className="font-bold text-red-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <img
                    src={Icons.Trash}
                    alt="Xóa"
                    className="w-5 h-5 opacity-60 hover:opacity-100"
                  />
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-gray-50 text-right rounded-b-lg">
            <span className="font-bold text-gray-700 mr-4">Tổng tiền:</span>
            <span className="text-xl font-bold text-red-600">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* --- LAYOUT 2 CỘT: FORM & THANH TOÁN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CỘT TRÁI: THÔNG TIN NGƯỜI MUA */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold bg-gray-100 p-3 rounded mb-4 uppercase text-gray-700">
              Thông tin người mua
            </h2>
            <p className="text-sm mb-4 text-gray-600">
              Để tiếp tục đặt hàng, quý khách xin vui lòng nhập thông tin bên
              dưới
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">
                  Họ tên<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2]"
                  value={formData.hoTen}
                  readOnly
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">
                  SĐT<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2]"
                  value={formData.sdt}
                  readOnly
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2]"
                  value={formData.email}
                  readOnly
                />
              </div>
              <div className="flex items-start">
                <label className="w-1/3 text-gray-600 mt-2">
                  Địa chỉ<span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2] h-20 resize-none"
                  value={formData.diaChi}
                  readOnly
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">
                  Tỉnh/Thành phố<span className="text-red-500">*</span>
                </label>
                <select className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2]">
                  <option>Chọn Tỉnh/Thành phố</option>
                  <option>Hồ Chí Minh</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-1/3 text-gray-600">
                  Quận/Huyện<span className="text-red-500">*</span>
                </label>
                <select className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2]">
                  <option>Chọn Quận/Huyện</option>
                  <option>Thủ Đức</option>
                </select>
              </div>
              <div className="flex items-start">
                <label className="w-1/3 text-gray-600 mt-2">Ghi chú</label>
                <textarea
                  className="w-2/3 border rounded p-2 outline-none focus:border-[#4A44F2] h-24 resize-none"
                  placeholder="Ghi chú thêm về đơn hàng..."
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG TIỀN & CHỐT ĐƠN */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-bold bg-gray-100 p-3 rounded mb-4 uppercase text-gray-700">
              Tổng tiền
            </h2>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Mã Voucher"
                className="flex-1 border rounded p-2 text-sm outline-none focus:border-[#4A44F2]"
              />
              <button className="bg-[#201D8A] hover:bg-[#1a1770] text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer flex items-center gap-1">
                Mã voucher
              </button>
            </div>

            <div className="space-y-3 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng cộng</span>
                <span className="font-medium">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá Voucher</span>
                <span className="font-medium">0 đ</span>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-gray-800 text-base">
                  Thành tiền
                </span>
                <div className="text-right">
                  <span className="font-bold text-xl text-red-600 block">
                    {formatPrice(totalAmount)}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    (Giá đã bao gồm VAT)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="policy"
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="policy"
                className="text-sm font-bold text-gray-800 cursor-pointer hover:underline"
              >
                Tôi đã đọc và đồng ý với các Điều kiện giao dịch chung của
                website
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button className="bg-[#0f212e] hover:bg-black text-white py-3 rounded font-bold text-sm transition cursor-pointer">
                IN BÁO GIÁ
              </button>
              <button className="bg-[#0f212e] hover:bg-black text-white py-3 rounded font-bold text-sm transition cursor-pointer">
                TẢI FILE EXCEL
              </button>
            </div>

            <button className="w-full bg-[#e30019] hover:bg-red-700 text-white py-4 rounded font-bold text-lg transition shadow-md mb-3 cursor-pointer">
              ĐẶT HÀNG
            </button>

            <button className="w-full bg-[#1b365d] hover:bg-[#12243e] text-white py-3 rounded font-bold text-sm transition flex flex-col items-center justify-center cursor-pointer">
              <span>TRẢ GÓP QUA HỒ SƠ</span>
              <span className="font-normal text-xs mt-0.5">
                CHỈ TỪ 6.248.000 Đ/THÁNG
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
