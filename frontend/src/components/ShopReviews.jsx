import React from "react";

// Dữ liệu giả lập (Sau này có thể lấy từ bảng DanhGiaCuaHang trong DB)
const reviews = [
  {
    id: 1,
    name: "Nguyễn Minh Tuấn",
    role: "Khách hàng VIP",
    avatar: "T",
    color: "bg-blue-500",
    content:
      "Shop tư vấn cực kỳ nhiệt tình. Mình mua con iPhone 16 Pro Max ở đây giá rẻ hơn mặt bằng chung mà máy đập hộp chuẩn VN/A. Sẽ ủng hộ dài dài!",
    date: "12/04/2026",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    role: "Khách hàng mua Online",
    avatar: "M",
    color: "bg-pink-500",
    content:
      "Lần đầu mua laptop giá trị cao qua mạng cũng hơi lo, nhưng nhận máy đóng gói siêu cẩn thận. Cấu hình đúng như shop tư vấn cho dân đồ họa.",
    date: "08/04/2026",
    rating: 5,
  },
  {
    id: 3,
    name: "Lê Hoàng Bách",
    role: "Kỹ sư IT",
    avatar: "B",
    color: "bg-green-500",
    content:
      "Giao hàng thần tốc, đặt sáng chiều có luôn. Mình có test thử kỹ các linh kiện PC bên trong thì đều là hàng chính hãng bảo hành đầy đủ. Rất uy tín!",
    date: "01/04/2026",
    rating: 5,
  },
];

const ShopReviews = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 my-8">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Khách hàng nói gì về LTL Shop
        </h2>
        <p className="text-sm text-gray-500">
          Hơn 10.000+ khách hàng đã tin tưởng và đồng hành cùng chúng tôi
        </p>
      </div>

      {/* Lưới Đánh giá */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
          >
            {/* Header: Avatar + Tên + Sao */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 ${review.color}`}
              >
                {review.avatar}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">
                  {review.name}
                </h4>
                <div className="flex text-yellow-400 text-sm my-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-400">{review.role}</p>
              </div>
            </div>

            {/* Nội dung đánh giá */}
            <div className="text-gray-600 text-sm italic flex-grow">
              "{review.content}"
            </div>

            {/* Ngày tháng */}
            <div className="mt-4 text-right text-xs text-gray-400 font-medium">
              {review.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopReviews;
