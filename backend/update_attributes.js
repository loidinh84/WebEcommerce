const path = require('path');
require('dotenv').config();
const sequelize = require("./config/db");
const { SanPham, DanhMuc, BienTheSanPham } = require("./models/index");
const ThuocTinhSanPham = require("./models/ThuocTinhSanPham");

async function updateAttributes() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");

    const products = await SanPham.findAll({
      include: [
        { model: DanhMuc, as: 'danh_muc' }
      ]
    });

    console.log(`Found ${products.length} products. Updating attributes and variants...`);

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (const sp of products) {
      const catName = sp.danh_muc?.ten_danh_muc || "";
      const parentId = sp.danh_muc?.danh_muc_cha_id;

      // 1. Add/Update Variants (Mau sac, RAM, Dung luong)
      const variants = await BienTheSanPham.findAll({ where: { san_pham_id: sp.id } });
      for (const v of variants) {
        let updateData = {};
        
        // Colors
        if (!v.mau_sac) {
          updateData.mau_sac = getRandom(["Đen", "Bạc", "Xám", "Xanh Dương", "Trắng", "Vàng"]);
          updateData.ma_mau_hex = getRandom(["#000000", "#C0C0C0", "#808080", "#0000FF", "#FFFFFF", "#FFD700"]);
        }

        // RAM & Storage for Laptops, Phones, Tablets
        const isTech = sp.danh_muc_id == 4 || parentId == 4 || sp.danh_muc_id == 5 || parentId == 5 || sp.danh_muc_id == 17 || parentId == 17;
        if (isTech) {
          if (!v.ram) v.ram = getRandom(["8GB", "16GB", "32GB"]);
          if (!v.dung_luong) v.dung_luong = getRandom(["128GB", "256GB", "512GB", "1TB"]);
          updateData.ram = v.ram;
          updateData.dung_luong = v.dung_luong;
        }

        if (Object.keys(updateData).length > 0) {
          await v.update(updateData);
        }
      }

      // 2. Add Product Attributes (Specifications)
      const existingAttrs = await ThuocTinhSanPham.count({ where: { san_pham_id: sp.id } });
      if (existingAttrs > 0) continue;

      let attrs = [];
      const isLaptop = sp.danh_muc_id == 4 || parentId == 4;
      const isPhone = sp.danh_muc_id == 5 || parentId == 5;
      const isPC = sp.danh_muc_id == 18 || parentId == 18;
      const isComponent = sp.danh_muc_id == 19 || parentId == 19;
      const isMonitor = sp.danh_muc_id == 20 || parentId == 20;
      const isTablet = sp.danh_muc_id == 17 || parentId == 17;

      if (isLaptop || isPC) {
        attrs = [
          { nhom: "Cấu hình", ten_thuoc_tinh: "CPU", gia_tri: getRandom(["Intel Core i5-13500", "Intel Core i7-13700", "AMD Ryzen 5 7600", "AMD Ryzen 7 7700"]) },
          { nhom: "Cấu hình", ten_thuoc_tinh: "RAM", gia_tri: getRandom(["8GB DDR4", "16GB DDR4", "16GB DDR5", "32GB DDR5"]) },
          { nhom: "Cấu hình", ten_thuoc_tinh: "Ổ cứng", gia_tri: getRandom(["256GB SSD NVMe", "512GB SSD NVMe", "1TB SSD NVMe"]) },
          { nhom: "Cấu hình", ten_thuoc_tinh: "Đồ họa", gia_tri: getRandom(["Intel Iris Xe", "NVIDIA RTX 3050", "NVIDIA RTX 4060", "AMD Radeon 780M"]) }
        ];
        if (isLaptop) {
          attrs.push({ nhom: "Màn hình", ten_thuoc_tinh: "Kích thước", gia_tri: getRandom(["13.3 inch", "14 inch", "15.6 inch", "16 inch"]) });
          attrs.push({ nhom: "Màn hình", ten_thuoc_tinh: "Độ phân giải", gia_tri: getRandom(["Full HD (1920x1080)", "2K (2560x1440)", "Retina"]) });
        }
      } else if (isPhone || isTablet) {
        attrs = [
          { nhom: "Màn hình", ten_thuoc_tinh: "Công nghệ", gia_tri: getRandom(["OLED", "AMOLED", "IPS LCD", "Liquid Retina"]) },
          { nhom: "Màn hình", ten_thuoc_tinh: "Kích thước", gia_tri: getRandom(["6.1 inch", "6.7 inch", "10.9 inch", "12.9 inch"]) },
          { nhom: "Camera", ten_thuoc_tinh: "Camera sau", gia_tri: getRandom(["12MP + 12MP", "48MP + 12MP + 12MP", "50MP + 10MP + 12MP"]) },
          { nhom: "Pin", ten_thuoc_tinh: "Dung lượng", gia_tri: getRandom(["3200 mAh", "4500 mAh", "5000 mAh", "8000 mAh"]) }
        ];
      } else if (isMonitor) {
        attrs = [
          { nhom: "Thông số", ten_thuoc_tinh: "Kích thước", gia_tri: getRandom(["24 inch", "27 inch", "32 inch"]) },
          { nhom: "Thông số", ten_thuoc_tinh: "Tấm nền", gia_tri: getRandom(["IPS", "VA", "TN"]) },
          { nhom: "Thông số", ten_thuoc_tinh: "Tần số quét", gia_tri: getRandom(["60Hz", "75Hz", "144Hz", "165Hz", "240Hz"]) },
          { nhom: "Thông số", ten_thuoc_tinh: "Cổng kết nối", gia_tri: "HDMI, DisplayPort" }
        ];
      } else if (isComponent) {
        if (catName.includes("CPU")) {
          attrs = [
            { nhom: "Thông số", ten_thuoc_tinh: "Số nhân", gia_tri: getRandom(["6 nhân", "8 nhân", "12 nhân", "16 nhân"]) },
            { nhom: "Thông số", ten_thuoc_tinh: "Số luồng", gia_tri: getRandom(["12 luồng", "16 luồng", "24 luồng", "32 luồng"]) },
            { nhom: "Thông số", ten_thuoc_tinh: "Xung nhịp", gia_tri: "2.5GHz - 5.0GHz" }
          ];
        } else if (catName.includes("VGA")) {
          attrs = [
            { nhom: "Thông số", ten_thuoc_tinh: "Dung lượng VRAM", gia_tri: getRandom(["8GB", "12GB", "16GB", "24GB"]) },
            { nhom: "Thông số", ten_thuoc_tinh: "Chuẩn VRAM", gia_tri: "GDDR6" }
          ];
        } else {
          attrs = [{ nhom: "Thông số", ten_thuoc_tinh: "Tính năng", gia_tri: "Chính hãng, độ bền cao" }];
        }
      } else {
        attrs = [{ nhom: "Thông tin chung", ten_thuoc_tinh: "Loại sản phẩm", gia_tri: catName }];
      }

      for (let i = 0; i < attrs.length; i++) {
        await ThuocTinhSanPham.create({
          san_pham_id: sp.id,
          nhom: attrs[i].nhom,
          ten_thuoc_tinh: attrs[i].ten_thuoc_tinh,
          gia_tri: attrs[i].gia_tri,
          thu_tu: i + 1
        });
      }
    }

    console.log("Attributes and variants updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateAttributes();
