import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import SidebarMenu from "../components/SideBarMenu";
import HorizontalBanner from "../components/HorizontalBanner";
import ProductSection from "../components/ProductSection";
import AccessoryBar from "../components/AccessoryBar";
import * as Images from "../assets/images/index";
import ContactSupport from "../components/ContactSupport";

const phuKienData = [
  { name: "Tai nghe", icon: <img src={Images.TayNghe} alt="Tai nghe" /> },
  { name: "Củ sạc", icon: <img src={Images.CuSac} alt="Củ sạc" /> },
  { name: "Bàn phím", icon: <img src={Images.BanPhim} alt="Bàn phím" /> },
  { name: "Chuột", icon: <img src={Images.Chuot} alt="Chuột" /> },
];

const hangCuData = [
  { name: "Điện thoại cũ", icon: <img src={Images.DienThoaiCu} alt="ĐT cũ" /> },
  {
    name: "Máy tính bảng cũ",
    icon: <img src={Images.TabletCu} alt="Tablet cũ" />,
  },
  { name: "Laptop cũ", icon: <img src={Images.LaptopCu} alt="Laptop cũ" /> },
  {
    name: "Màn hình cũ",
    icon: <img src={Images.ManHinhCu} alt="Màn hình cũ" />,
  },
];

const listDienThoai = Array(12).fill({
  ten_san_pham: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
  gia_cu: 34990000,
  gia_moi: 29490000,
  hinh_anh_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
  danh_gia: 5,
  da_ban: 23,
});

function Home() {
  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans relative">
      {" "}
      {/* Thêm relative để an toàn */}
      <Header />
      <main className="flex-grow container mx-auto px-4 mt-4 mb-10">
        {/* Tầng 1: Hero */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <SidebarMenu />
          </div>
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <HeroBanner />
          </div>
        </div>

        {/* Tầng 2: Banner ngang */}
        <HorizontalBanner />

        {/* TẦNG 3: Khu vực Sản phẩm */}
        <ProductSection
          tab1="Laptop"
          tab2="Màn hình"
          banners={[
            "https://cdn.s99.vn/ss2/prod/product/ea79bc9783494f489eaabf5927183770_1693927207.jpg?at=1701836730",
            "https://cms.piklab.vn/resources/Tai%20nguyen%20Piklab/File%20design%20TMDT/piklab3673.jpg",
          ]}
          filters={[
            "Apple",
            "Samsung",
            "Xiaomi",
            "OPPO",
            "Sony",
            "Nokia",
            "vivo",
            "TECNO",
            "ASUS",
          ]}
          products={listDienThoai}
        />

        {/* Tầng 4: Thanh phụ kiện */}
        <AccessoryBar title="Sắm thêm phụ kiện chất lượng" data={phuKienData} />

        {/* Tầng 5: Khối laptop */}
        <ProductSection
          tab1="Laptop"
          tab2="Màn hình"
          banners={[
            "https://phongvu.vn/cong-nghe/wp-content/uploads/2025/11/build-pc-tai-phong-vu-banner-ngang.jpg",
            "https://unica.vn/media/imagesck/1602820929_banner-quang-cao-dep-4.jpg?v=1602820929",
          ]}
          filters={[
            "ASUS",
            "Macbook",
            "Lenovo",
            "MSI",
            "Acer",
            "Dell",
            "HP",
            "Gigabyte",
            "Mastel",
          ]}
          products={listDienThoai}
        />

        {/* Tầng 6: Hàng cũ */}
        <AccessoryBar title="Hàng cũ" data={hangCuData} />

        {/* TẦNG 7: PC VÀ LINH KIỆN MÁY TÍNH */}
        <ProductSection
          tab1="PC"
          tab2="Linh kiện máy tính"
          banners={[
            "https://www.thanhgiong.com.vn/images/hinhanh/endab2abc16f8395ddcc922020416191549.jpg",
            "https://img.pikbest.com/origin/10/01/60/75UpIkbEsTmkR.png!w700wp",
          ]}
          filters={[
            "PC Gaming",
            "PC Đồ họa",
            "PC Văn phòng",
            "VGA",
            "Mainboard",
            "RAM",
            "RAM",
          ]}
          products={listDienThoai}
        />
      </main>
      <Footer />
      <ContactSupport /> {/* <-- Đã thêm component ở đây */}
    </div>
  );
}

export default Home;
