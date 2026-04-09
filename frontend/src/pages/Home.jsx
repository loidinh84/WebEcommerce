import React, { useState, useEffect } from "react";
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

const listDienThoai = Array(8).fill({
  ten_san_pham: "iPhone 16 Pro Max 256GB Chính Hãng VN/A",
  gia_cu: 34990000,
  gia_moi: 29490000,
  hinh_anh_url:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThZbSgSNsN6qNtFww5jpvV6B_BlWxowjyDQ&s",
  danh_gia: 5,
  da_ban: 23,
});

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

  return (
    <div className="flex flex-col gap-3">
      {/* Countdown */}
      <div className="bg-gradient-to-br from-[#4A44F2] to-[#7C78FF] rounded-xl p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
          ⚡ Flash Sale
        </p>
        <p className="text-sm font-bold mb-3">Kết thúc sau</p>
        <div className="flex items-center gap-2 justify-center">
          {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
            <React.Fragment key={i}>
              <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold">
                {val}
              </div>
              {i < 2 && (
                <span className="text-xl font-bold text-white/80">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Đang xem nhiều */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
          🔥 Đang xem nhiều
        </p>
        {[
          { name: "iPhone 16 Pro Max", views: "1.2k" },
          { name: "Samsung S25 Ultra", views: "890" },
          { name: "OPPO Find X8", views: "654" },
          { name: "Xiaomi 15 Ultra", views: "430" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 cursor-pointer hover:text-[#4A44F2] transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 w-4">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 hover:text-[#4A44F2]">
                {item.name}
              </span>
            </div>
            <span className="text-xs text-gray-400">{item.views} lượt</span>
          </div>
        ))}
      </div>
    </div>
  );
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
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm font-bold text-gray-800 mb-1">Gợi ý theo nhu cầu</p>
      <p className="text-xs text-gray-500 mb-3">
        Nhu cầu bạn mua laptop như thế nào?
      </p>
      <div className="flex flex-col gap-2">
        {needs.map((n, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`text-left px-3 py-2.5 rounded-lg border transition text-sm ${
              selected === i
                ? "border-[#4A44F2] bg-[#4A44F2]/5 text-[#4A44F2] font-semibold"
                : "border-gray-200 text-gray-700 hover:border-[#4A44F2]"
            }`}
          >
            <span className="font-medium">{n.label}</span>
            <br />
            <span className="text-xs text-gray-400">{n.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PCConfigWidget = () => {
  const configs = [
    {
      label: "🎮 Gaming",
      cpu: "i7-13700K",
      gpu: "RTX 4070",
      ram: "32GB",
      price: "28.5tr",
    },
    {
      label: "🎨 Đồ hoạ",
      cpu: "Ryzen 9 7900X",
      gpu: "RX 7900 XT",
      ram: "64GB",
      price: "42tr",
    },
    {
      label: "🖥 Văn phòng",
      cpu: "i5-13400",
      gpu: "Intel UHD",
      ram: "16GB",
      price: "12tr",
    },
  ];
  const [active, setActive] = React.useState(0);
  const c = configs[active];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm font-bold text-gray-800 mb-3">
        Bạn có muốn tự build PC ?
      </p>
      <div className="flex flex-col gap-2">
        {[
          ["CPU", c.cpu],
          ["GPU", c.gpu],
          ["RAM", c.ram],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between items-center py-1.5 border-b border-gray-50"
          >
            <span className="text-xs text-gray-500">{k}</span>
            <span className="text-xs font-semibold text-gray-800">{v}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-gray-500">Tổng chi phí ~</span>
          <span className="text-sm font-bold text-[#4A44F2]">{c.price}</span>
        </div>
      </div>
      <button className="mt-3 w-full border border-[#4A44F2] text-[#4A44F2] text-sm font-semibold rounded-lg py-2 hover:bg-[#4A44F2] hover:text-white transition">
        Kiểm tra cấu hình
      </button>
    </div>
  );
};

function Home() {
  const [realProducts, setRealProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sanpham");
        const data = await response.json();

        setRealProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans relative">
      <Header />

      <main className="flex-grow container mx-auto px-4 mt-4 mb-10">
        {/* TẦNG 1: Sidebar + Hero Slideshow */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <SidebarMenu />
          </div>
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <HeroBanner />
          </div>
        </div>

        {/* TẦNG 3: Điện thoại — widget Countdown + Hot */}
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
          products={realProducts}
          isLoading={isLoading}
        />

        {/* TẦNG 4: Phụ kiện */}
        <AccessoryBar title="Sắm thêm phụ kiện chất lượng" data={phuKienData} />

        {/* TẦNG 5: Laptop — widget AI gợi ý */}
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
          products={listDienThoai}
        />

        {/* TẦNG 6: Hàng cũ */}
        <AccessoryBar title="Hàng cũ giá tốt" data={hangCuData} />

        {/* TẦNG 8: PC & Linh kiện — widget cấu hình gợi ý */}
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
          products={listDienThoai}
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
