const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");

// Kết nối và đồng bộ cơ sở dữ liệu
app.use(cors());
app.use(express.json());

const TaiKhoanRoutes = require("./routers/taiKhoanRoutes");
app.use("/api/taiKhoan", TaiKhoanRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với SQL");
  })
  .catch((error) => {
    console.error("Lỗi kết nối Database:", error);
  });

app.listen(5000, () => console.log("Server chạy tại port 5000"));
