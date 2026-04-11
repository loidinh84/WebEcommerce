// backend/config/upload.js
const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu vào thư mục uploads
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Đổi tên file để không bị trùng: timestamp + số ngẫu nhiên + đuôi file gốc
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Bộ lọc: Chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép tải lên hình ảnh!'), false);
  }
};

// Khởi tạo multer với cấu hình trên, giới hạn kích thước 5MB
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;