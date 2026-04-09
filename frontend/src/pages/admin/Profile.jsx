import React, { useState } from "react";

const Profile = () => {
  // State lưu thông tin cá nhân
  const [profileData, setProfileData] = useState({
    fullName: "Admin Quản Trị",
    email: "admin@ltlshop.com",
    phone: "0901234567",
    role: "Quản trị viên cấp cao",
    address: "123 Đường Công Nghệ, Quận 1, TP.HCM"
  });

  // State lưu thông tin đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Tương lai: Gọi API cập nhật profile ở đây
    showToast("Cập nhật thông tin hồ sơ thành công!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "error");
      return;
    }
    // Tương lai: Gọi API đổi mật khẩu ở đây
    showToast("Đổi mật khẩu thành công!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] overflow-y-auto justify-center relative font-sans">
      <div className="w-full max-w-5xl p-4 lg:p-6 flex flex-col gap-6">
        
        {/* Header Trang */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Hồ sơ cá nhân</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin tài khoản và bảo mật</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* CỘT TRÁI: Avatar & Thông tin tóm tắt */}
          <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-blue-50 mb-4 shadow-inner">
                {profileData.fullName.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{profileData.fullName}</h3>
              <p className="text-sm text-gray-500 mb-4">{profileData.role}</p>
              
              <div className="w-full border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 font-medium">Trạng thái:</span>
                  <span className="text-green-600 font-bold uppercase">Đang hoạt động</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Ngày tạo:</span>
                  <span className="text-gray-800 font-medium">01/01/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Form chỉnh sửa */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Form Thông tin cá nhân */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 uppercase text-sm tracking-wider">Thông tin chi tiết</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Họ và tên</label>
                    <input type="text" name="fullName" value={profileData.fullName} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chức vụ</label>
                    <input type="text" name="role" value={profileData.role} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Số điện thoại</label>
                    <input type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Địa chỉ liên hệ</label>
                    <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase transition-colors shadow-sm">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>

            {/* Form Đổi mật khẩu */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 uppercase text-sm tracking-wider">Đổi mật khẩu</h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu hiện tại</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu mới</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors" required />
                </div>
                <div className="pt-2">
                  <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase transition-colors shadow-sm">
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Hệ thống Toast thông báo */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-[200] px-6 py-3.5 rounded-lg shadow-xl font-medium text-white transition-all animate-fade-in-up ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Profile;