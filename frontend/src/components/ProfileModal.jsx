import React, { useEffect, useState, useRef } from "react";
import * as Icons from "../assets/icons/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config/api";

const mockUser = {
  TENDANGNHAP: "admin",
  TENNGUOIDUNG: "Vũ Thái Tài",
  SDT: "0941311339",
  EMAIL: "vuthaitai2000@gmail.com",
  NGAYSINH: "2000-01-01",
  GIOITINH: "Nam",
  DIACHI: "Quận 7",
  QUYENHAN: "ADMIN",
  HINHANH: "",
};

const ProfileModal = ({ isOpen, onClose }) => {
  const [user, setUser] = useState({ TENDANGNHAP: "" });
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const loginName = savedUser?.TENDANGNHAP || savedUser?.username || "admin";

    fetch(`${BASE_URL}/api/user/profile/${loginName}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Backend not ready");
        return res.json();
      })
      .then((data) => {
        if (data.NGAYSINH) data.NGAYSINH = data.NGAYSINH.split("T")[0];
        setUser(data);
        setTempUser(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setUser(mockUser);
        setTempUser(mockUser);
        setIsLoading(false);
      });
  };

  const toggleEdit = () => {
    if (isEditing) {
      setUser(tempUser);
    } else {
      setTempUser(user);
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    const toastId = toast.loading("Đang lưu thay đổi...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/user/update/${user.TENDANGNHAP}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.update(toastId, {
          render: "Cập nhật thông tin thành công!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setTempUser(user);
        setIsEditing(false);
      } else {
        toast.update(toastId, {
          render: "Lỗi từ server: " + data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(toastId, {
        render: "Đã lưu (Chế độ test UI)!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTempUser(user);
      setIsEditing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }

    const toastId = toast.loading("Đang xử lý...");
    try {
      toast.update(toastId, {
        render: "Đã đổi mật khẩu (Chế độ test UI)!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Lỗi hệ thống!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, HINHANH: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-6 font-inter">
      <ToastContainer position="top-right" />

      {/* Nút X Đóng Modal Chính */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-500 hover:scale-110 transition-all z-[250] text-3xl pb-1 cursor-pointer"
        title="Đóng"
      >
        &times;
      </button>

      <div className="w-full max-w-7xl h-auto max-h-[95vh] bg-[#F8F9FD] rounded-[30px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center font-bold text-gray-500 py-32">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
            {/* --- CỘT TRÁI: AVATAR & BẢO MẬT --- */}
            <div className="w-full lg:w-[380px] space-y-6 shrink-0">
              {/* Box Avatar */}
              <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100 text-center relative">
                <div
                  className="relative w-32 h-32 mx-auto mb-5 group cursor-pointer"
                  onClick={() => isEditing && fileInputRef.current.click()}
                >
                  <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden transition-all group-hover:border-purple-100">
                    {user.HINHANH ? (
                      <img
                        src={user.HINHANH}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl opacity-30">👤</span>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-[#5D5FEF]/60 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-xs font-bold uppercase">
                        Đổi ảnh
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {user.TENNGUOIDUNG || user.TENDANGNHAP}
                </h3>
                <p className="text-[#5D5FEF] font-bold text-sm mb-4 uppercase tracking-widest mt-1">
                  {user.QUYENHAN}
                </p>
                <div className="inline-flex gap-3 px-5 py-2 bg-green-50 text-green-700 text-xs font-black rounded-full uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse self-center"></div>
                  Đang hoạt động
                </div>
              </div>

              {/* Box Bảo mật */}
              <div className="bg-white rounded-[25px] p-8 shadow-sm border border-gray-100 space-y-6">
                <h4 className="font-bold text-gray-800 text-lg">
                  Bảo mật tài khoản
                </h4>
                <div className="space-y-4">
                  <StatusItem label="Xác thực Email" isDone={false} />
                  <StatusItem label="Xác thực Số Điện Thoại" isDone={false} />
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full mt-4 flex items-center justify-center gap-3 py-3.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-700 transition-all border border-gray-200 cursor-pointer"
                >
                  Đổi mật khẩu bảo mật
                </button>
              </div>
            </div>

            {/* --- CỘT PHẢI: FORM THÔNG TIN --- */}
            <div className="flex-1 bg-white rounded-[30px] p-8 lg:p-10 shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-6">
                  {/* Nút Trở về */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all group cursor-pointer"
                  >
                    <span className="opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-xl">
                      &larr;
                    </span>
                    <span className="font-bold text-gray-500 group-hover:text-[#5D5FEF] text-sm">
                      Trở về
                    </span>
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Hồ sơ cá nhân
                  </h2>
                </div>
                {/* Nút Chỉnh Sửa */}
                <button
                  onClick={toggleEdit}
                  className="flex items-center justify-center gap-2.5 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                <InfoField
                  label="Tên người dùng"
                  name="TENDANGNHAP"
                  value={user.TENDANGNHAP}
                  isLocked={true}
                />
                <InfoField
                  label="Họ và tên"
                  name="TENNGUOIDUNG"
                  value={user.TENNGUOIDUNG}
                  isLocked={!isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Số điện thoại"
                  name="SDT"
                  value={user.SDT}
                  isLocked={!isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Email"
                  name="EMAIL"
                  value={user.EMAIL}
                  isLocked={!isEditing}
                  onChange={handleChange}
                />

                <div className="md:col-span-2 grid grid-cols-2 gap-10">
                  <InfoField
                    label="Ngày Sinh"
                    name="NGAYSINH"
                    value={user.NGAYSINH}
                    type="date"
                    isLocked={!isEditing}
                    onChange={handleChange}
                  />
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 tracking-widest">
                      Giới tính
                    </label>
                    <div className="relative">
                      <select
                        name="GIOITINH"
                        value={user.GIOITINH || "Nam"}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 outline-none appearance-none focus:border-[#5D5FEF] transition-all disabled:opacity-60 ${!isEditing ? "" : "cursor-pointer"}`}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none text-xs">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <InfoField
                    label="Địa chỉ thường trú"
                    name="DIACHI"
                    value={user.DIACHI}
                    isLocked={!isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6 pt-6 animate-in fade-in slide-in-from-bottom-2">
                  {/* Nút Lưu Thay Đổi */}
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-4 bg-[#5D5FEF] text-white rounded-2xl font-black text-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Lưu thay đổi thông tin
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[30px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Đổi mật khẩu bảo mật
              </h3>
              {/* Nút X Đóng Modal Mật Khẩu */}
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-2xl opacity-40 hover:opacity-100 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <PasswordField
                label="Mật khẩu hiện tại"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
              <PasswordField
                label="Mật khẩu mới"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <PasswordField
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              {/* Nút Cập Nhật Mật Khẩu */}
              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm mt-6 hover:bg-black transition-all cursor-pointer"
              >
                Cập nhật mật khẩu mới
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT TRÍCH XUẤT ---
function InfoField({
  label,
  name,
  value,
  type = "text",
  isLocked = false,
  onChange,
  placeholder = "",
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 tracking-widest">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={isLocked}
        placeholder={placeholder}
        className={`w-full p-3.5 rounded-2xl border text-sm font-bold outline-none transition-all ${
          isLocked
            ? "bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
            : "bg-white border-gray-200 text-gray-800 focus:border-[#5D5FEF]"
        }`}
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500">{label}</label>
      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-gray-400"
      />
    </div>
  );
}

function StatusItem({ label, isDone }) {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${isDone ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
        ></div>
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${isDone ? "text-green-600" : "text-red-500"}`}
        >
          {isDone ? "Hoàn tất" : "Chưa xác thực"}
        </span>
      </div>
    </div>
  );
}

export default ProfileModal;
