const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const {
  TaiKhoan,
  DonHang,
  ChiTietDonHang,
  TheThanhVien,
} = require("./models/index");
const sanPhamRoutes = require("./routers/sanPhamRoutes");
const TaiKhoanRoutes = require("./routers/taiKhoanRoutes");
const aiRoutes = require("./routers/aiRoutes");
const ChatHistory = require("./models/ChatHistory");
const DonHangRoutes = require("./routers/donHangRoutes");
const DonViVanChuyen = require("./models/DonViVanChuyen");
const PhuongThucThanhToan = require("./models/PhuongThucThanhToan");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/taiKhoan", TaiKhoanRoutes);
app.use("/api/sanPham", sanPhamRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/donhang", DonHangRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với SQL Server");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(5000, () => console.log("Server chạy tại port 5000"));
  })
  .catch((error) => {
    console.error("Lỗi khởi động hệ thống:", error);
  });
