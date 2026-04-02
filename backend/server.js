const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const sanPhamRoutes = require("./routers/sanPhamRoutes");
const TaiKhoanRoutes = require("./routers/taiKhoanRoutes");
const aiRoutes = require("./routers/aiRoutes");
const ChatHistory = require("./models/ChatHistory"); // Import để Sequelize biết đường tạo bảng

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/taiKhoan", TaiKhoanRoutes);
app.use("/api/sanPham", sanPhamRoutes);
app.use("/api/ai", aiRoutes);

// --- PHẦN QUAN TRỌNG NHẤT: ĐỒNG BỘ DATABASE ---
sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với SQL Server");
    // Đồng bộ tất cả các model (bao gồm ChatHistory) với database
    return sequelize.sync();
  })
  .then(() => {
    console.log("Tất cả các bảng (bao gồm ChatHistory) đã được đồng bộ!");
    app.listen(5000, () => console.log("Server chạy tại port 5000"));
  })
  .catch((error) => {
    console.error("Lỗi khởi động hệ thống:", error);
  });
