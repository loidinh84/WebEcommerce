require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");
require("./models/index");

const sanPhamRoutes = require("./routers/sanPhamRoutes");
const TaiKhoanRoutes = require("./routers/taiKhoanRoutes");
const aiRoutes = require("./routers/aiRoutes");
const DonHangRoutes = require("./routers/donHangRoutes");
const DashBoardRoutes = require("./routers/dashBoardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/taiKhoan", TaiKhoanRoutes);
app.use("/api/sanPham", sanPhamRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/donHang", DonHangRoutes);
app.use("/api/dashboard", DashBoardRoutes);

const PORT = process.env.PORT || 5000;
sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với SQL Server");
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
  })
  .catch((error) => {
    console.error("Lỗi khởi động hệ thống:", error);
  });
