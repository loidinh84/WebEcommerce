import React from "react";
import toast from "react-hot-toast"; // Import thư viện toast vào đây

const CompareModal = ({ isOpen, onClose, productName }) => {
  if (!isOpen) return null;

  const handleCompare = () => {
    toast.success("Bắt đầu so sánh!"); // ĐÃ FIX LỖI Ở ĐÂY
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 flex flex-col items-center text-center shadow-2xl animate-fade-in-up">
        <h3 className="font-bold text-xl text-gray-800 mb-2">
          So sánh sản phẩm
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Bạn muốn so sánh <span className="font-bold">{productName}</span> với
          sản phẩm nào?
        </p>
        <input
          type="text"
          placeholder="Nhập tên điện thoại cần so sánh..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 mb-4"
        />
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleCompare}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700"
          >
            So sánh ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
