const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const sanPhamRoutes = require("./routers/sanPhamRoutes");
const TaiKhoanRoutes = require("./routers/taiKhoanRoutes");

// Kết nối và đồng bộ cơ sở dữ liệu
app.use(cors());
app.use(express.json());

app.use("/api/taiKhoan", TaiKhoanRoutes);
app.use("/api/sanPham", sanPhamRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với SQL");
  })
  .catch((error) => {
    console.error("Lỗi kết nối Database:", error);
  });

app.listen(5000, () => console.log("Server chạy tại port 5000"));
