import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import SidebarMenu from "../components/SideBarMenu";
import ProductSection from "../components/ProductSection";
import AccessoryBar from "../components/AccessoryBar";
import ContactSupport from "../components/ContactSupport";
import ShopReviews from "../components/ShopReviews";
import * as Images from "../assets/images/index";

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


// Widget bên trái cho từng ProductSection
const DealCountdownWidget = () => {
  const [time, setTime] = React.useState({ h: 2, m: 34, s: 59 });
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 2;
          m = 34;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
};

const AINeedsWidget = () => {
  const [selected, setSelected] = React.useState(null);
  const needs = [
    { label: "Học tập", desc: "Pin trâu, nhẹ, Office mượt" },
    { label: "Gaming", desc: "RTX, RAM 16GB+, 144Hz" },
    { label: "Thiết kế đồ họa", desc: "CPU phù hợp, RAM cao, card rời" },
    { label: "Hàng thường", desc: "giá dưới 10 triệu VNĐ" },
    { label: "hàng cận cao cấp", desc: "giá từ 10 - 20 triệu VNĐ" },
    { label: "Hàng cao cấp", desc: "giá trên 20 triệu VNĐ" },
  ];
};

const PCConfigWidget = () => {
  const configs = [
    {
      label: "Gaming",
      cpu: "i7-13700K",
      gpu: "RTX 4070",
      ram: "32GB",
      price: "28.5tr",
    },
    {
      label: "Đồ hoạ",
      cpu: "Ryzen 9 7900X",
      gpu: "RX 7900 XT",
      ram: "64GB",
      price: "42tr",
    },
    {
      label: "Văn phòng",
      cpu: "i5-13400",
      gpu: "Intel UHD",
      ram: "16GB",
      price: "12tr",
    },
  ];
  const [active, setActive] = React.useState(0);
  const c = configs[active];
};

function Home() {

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans relative">
      <Header />

      {/* SỬA TẠI ĐÂY: Thay 'container' thành 'w-full max-w-7xl' để ép cứng 1280px */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 mt-4 mb-10">
        {/* TẦNG 1: Sidebar + Hero Slideshow */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <SidebarMenu />
          </div>
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <HeroBanner />
          </div>
        </div>

        {/* TẦNG 3: Điện thoại */}
        <ProductSection
          tab1="Điện thoại"
          tab2="Tablet"
          sideWidget={<DealCountdownWidget />}
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
          danhMucId={7}
        />

        {/* TẦNG 4: Phụ kiện */}
        <AccessoryBar title="Sắm thêm phụ kiện chất lượng" data={phuKienData} />

        {/* TẦNG 5: Laptop */}
        <ProductSection
          tab1="Laptop"
          tab2="Màn hình"
          sideWidget={<AINeedsWidget />}
          filters={[
            "ASUS",
            "Macbook",
            "Lenovo",
            "MSI",
            "Acer",
            "Dell",
            "HP",
            "Gigabyte",
          ]}
          danhMucId={4}
        />

        {/* TẦNG 6: Hàng cũ */}
        <AccessoryBar title="Hàng cũ giá tốt" data={hangCuData} />

        {/* TẦNG 8: PC & Linh kiện */}
        <ProductSection
          tab1="PC"
          tab2="Linh kiện máy tính"
          sideWidget={<PCConfigWidget />}
          filters={[
            "PC Gaming",
            "PC Đồ họa",
            "PC Văn phòng",
            "VGA",
            "Mainboard",
            "RAM",
          ]}
          danhMucId={6}
        />

        {/* TẦNG 9: ĐÁNH GIÁ SHOP CỦA KHÁCH HÀNG */}
        <ShopReviews />
      </main>

      <Footer />
      <ContactSupport />
    </div>
  );
}

export default Home;