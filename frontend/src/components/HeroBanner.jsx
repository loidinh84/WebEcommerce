import React from "react";
import Logo from "../assets/images/logo.png";
import * as Icons from "../assets/icons/index";

const HeroBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* --- CỘT GIỮA: CỤM BANNER CHÍNH --- */}
      {/* Thêm h-full vào đây để cột này cao bằng cột mẹ */}
      <div className="flex-1 flex flex-col gap-4 h-full">
        {/* Banner to phía trên (SỬA LỖI Ở ĐÂY: Dùng flex-1 thay vì h-[300px]) */}
        <div className="w-full bg-blue-100 rounded-lg overflow-hidden shadow-sm flex-1 min-h-[300px] hover:opacity-95 transition cursor-pointer">
          <img
            src="https://cdn.hstatic.net/files/200000722513/article/gearvn-pc-gvn-t9-slider_b3446f40a7e44494846d5b8cb88cbbe0_master.png"
            alt="Giới thiệu bạn mới"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2 Banner nhỏ phía dưới chia đôi (Giữ nguyên) */}
        <div className="flex gap-4 h-[140px] shrink-0">
          <div className="flex-1 bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:opacity-95 transition cursor-pointer">
            <img
              src="https://tinhocpnn.com/wp-content/uploads/2022/11/banner-may-tinh-choi-game-gia-re-may-tinh-do-hoa-gia-re-tphcm-1.png"
              alt="iPhone 17e"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 bg-green-50 rounded-lg overflow-hidden shadow-sm hover:opacity-95 transition cursor-pointer">
            <img
              src="https://hqcomputer.com/assets/uploads/banner-03.jpg"
              alt="MacBook Neo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* --- CHÀO MỪNG & ƯU ĐÃI SINH VIÊN (CỘT PHẢI) --- */}
      {/* Thêm h-full để đảm bảo cột này cũng giãn xuống tận cùng */}
      <div className="w-full lg:w-[270px] flex flex-col gap-4 h-full">
        {/* Khối 1: Chào mừng*/}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <img src={Logo} alt="Logo" className="h-10 w-10" />
            <h3 className="font-bold text-gray-800 text-xl leading-tight">
              Chào mừng bạn đến với LTL Shop.
            </h3>
          </div>
          <p className="text-xs font-medium text-[14px] text-gray-600 mb-3">
            Gia nhập hội thành viên để không bỏ lỡ các ưu đãi hấp dẫn nào!
          </p>
          <div className="text-sm">
            <span className="text-red-500 font-medium cursor-pointer hover:underline">
              Đăng nhập
            </span>
            <span className="text-gray-400 mx-1">hoặc</span>
            <span className="text-red-500 font-medium cursor-pointer hover:underline">
              Đăng ký
            </span>
          </div>
        </div>

        {/* Ưu đãi sinh viên*/}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-gray-300 py-2 px-4 font-semibold text-gray-700 text-sm text-center">
            Ưu đãi cho sinh viên
          </div>
          <ul className="p-3 text-sm space-y-3">
            <li className="flex items-start gap-2 cursor-pointer hover:text-blue-600 hover:underline">
              <img src={Icons.School} alt="Trường học" className="w-5 h-5" />
              <span>Đăng ký nhận ưu đãi</span>
            </li>
            <li className="flex items-start gap-2 cursor-pointer hover:text-blue-600 hover:underline">
              <img src={Icons.School} alt="Trường học" className="w-5 h-5" />
              <span>Deal hot cho học sinh sinh viên</span>
            </li>
            <li className="flex items-start gap-2 cursor-pointer hover:text-blue-600 hover:underline">
              <img src={Icons.School} alt="Trường học" className="w-5 h-5" />
              <span>Laptop ưu đãi khủng</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
