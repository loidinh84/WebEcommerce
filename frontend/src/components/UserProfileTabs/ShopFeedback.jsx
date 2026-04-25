import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BASE_URL from "../../config/api";

const ShopFeedback = () => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung góp ý!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/danh-gia-shop`,
        { so_sao: rating, noi_dung: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cảm ơn bạn đã gửi góp ý cho shop!");
      setContent("");
      setRating(5);
    } catch (error) {
      console.error("Lỗi gửi góp ý:", error);
      toast.error("Không thể gửi góp ý lúc này!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Góp ý & Phản hồi</h2>
        <p className="text-sm text-gray-500">
          Mọi ý kiến của bạn đều giúp LTL Shop hoàn thiện hơn mỗi ngày.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn số sao */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Bạn đánh giá thế nào về trải nghiệm dịch vụ của shop?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  rating >= star ? "text-yellow-400 bg-yellow-50" : "text-gray-300 bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Nội dung chi tiết
          </label>
          <textarea
            rows="5"
            placeholder="Hãy chia sẻ ý kiến hoặc góp ý của bạn tại đây..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi góp ý ngay"}
        </button>
      </form>
    </div>
  );
};

export default ShopFeedback;
