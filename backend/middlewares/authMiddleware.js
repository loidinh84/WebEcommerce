const jwt = require("jsonwebtoken");

// 1. Kiểm tra xem user có đăng nhập chưa
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không tìm thấy token xác thực! Vui lòng đăng nhập." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// 2. Kiểm tra xem user có phải là Admin không
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Chưa xác thực người dùng!" });
  }

  if (req.user.vai_tro !== "admin") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền Admin để thao tác chức năng này!" });
  }

  next();
};
