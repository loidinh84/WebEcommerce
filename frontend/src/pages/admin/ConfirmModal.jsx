import React from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "danger",
}) => {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div
          className={`px-6 py-4 border-b ${isDanger ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}
        >
          <h3
            className={`text-lg font-bold ${isDanger ? "text-red-700" : "text-orange-700"}`}
          >
            {title}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-base">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-white rounded-lg font-medium transition shadow-sm ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
