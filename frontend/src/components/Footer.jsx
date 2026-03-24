import React from "react";
import Logo from "../assets/images/logo.png";
import * as Images from "../assets/images/index";
import * as Icons from "../assets/icons/index";

const Footer = () => {
  return (
    <footer className="bg-[#568FDE] text-white font-sans mt-10">
      {/* --- PHẦN NỘI DUNG CHÍNH --- */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Liên hệ hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Liên hệ hỗ trợ miễn phí
            </h3>
            <ul className="text-sm space-y-3">
              <li>
                Mua hàng - bảo hành -{" "}
                <span className="hover:underline">0333914514</span>
              </li>
              <li>
                Khiếu nại - <span className="hover:underline">0333914514</span>
              </li>
              <li>
                Chăm sóc khách hàng -{" "}
                <span className="hover:underline">0333914514</span>
              </li>
              <li>
                Gmail:{" "}
                <a
                  href="mailto:dinhhoangloibt@gmail.com"
                  className="text-[#201D8A] font-semibold hover:underline hover:underline"
                >
                  dinhhoangloibt@gmail.com
                </a>
              </li>
            </ul>
            <img
              src={Logo}
              alt="LTL Shop Logo"
              className="mt-6 w-56 object-contain cursor-pointer hover:opacity-90 transition"
            />
          </div>

          {/* Cột 2: Thông tin về chính sách */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Thông tin về chính sách
            </h3>
            <ul className="text-sm space-y-3">
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Mua hàng và thanh toán Online
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Mua hàng trả góp Online
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Chính sách giao hàng
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Chính sách đổi trả
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Tra thông tin bảo hành
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Tra cứu hóa đơn điện tử
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Thông tin hóa đơn mua hàng
              </li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ và thông tin khác */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Dịch vụ và thông tin khác
            </h3>
            <ul className="text-sm space-y-3">
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Ưu đãi thanh toán
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Chính sách bảo mật thông tin cá nhân
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                Chính sách bảo hành
              </li>
              <li className="cursor-pointer hover:text-gray-200 transition hover:underline">
                So sánh sản phẩm
              </li>
            </ul>
          </div>

          {/* Cột 4: Kết nối mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kết nối với LTLShop</h3>
            <div className="flex items-center gap-3">
              <img
                src={Images.Facebook}
                alt="Facebook"
                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
              />
              <img
                src={Images.TikTok}
                alt="TikTok"
                className="w-11 h-11 cursor-pointer hover:scale-110 transition-transform"
              />
              <img
                src={Images.Instagram}
                alt="Instagram"
                className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
              />
              <img
                src={Images.Zalo}
                alt="Zalo"
                className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className="bg-[#497BC5] py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>
            Nhóm 5 thuộc học phần Đồ án cơ sở với 3 thành viên tham gia: Đinh
            Thành Lợi - 2380601285. Vũ Thái Tài - 2380601285. Đỗ khắc levis -
            2380601285
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
