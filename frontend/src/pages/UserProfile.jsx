import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MembershipCarousel from "../components/MembershipCarousel";
import BASE_URL from "../config/api";

const Icons = {
  Home: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Order: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  ),
  User: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Location: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Card: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  Heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  Logout: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  CartEmpty: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 opacity-20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
};

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/taiKhoan/dashboard/${user.id}`,
        );
        const data = await response.json();
        setProfileData(data);
        if (data?.allMemberships?.length > 0) {
          const currentTier = data.allMemberships.find(
            (t) => t.id === data.userInfo.the_thanh_vien_id,
          );
          setSelectedTier(currentTier || data.allMemberships[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  const [activeTab, setActiveTab] = useState("overview");

  const [userInfo, setUserInfo] = useState({
    fullName: user?.ho_ten || "Khách hàng",
    email: user?.email || "Chưa cập nhật",
    phone: user?.so_dien_thoai || "Chưa cập nhật",
    gender: "male",
    dob: "2000-01-01",
  });

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất tài khoản!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: <Icons.Home /> },
    { id: "orders", label: "Lịch sử mua hàng", icon: <Icons.Order /> },
    { id: "profile", label: "Thông tin tài khoản", icon: <Icons.User /> },
    { id: "address", label: "Sổ địa chỉ", icon: <Icons.Location /> },
    { id: "wishlist", label: "Sản phẩm yêu thích", icon: <Icons.Heart /> },
    {
      id: "CardMember",
      label: "Thẻ thành viên và ưu đãi",
      icon: <Icons.Card />,
    },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans flex flex-col">
      <Header />
      <Toaster position="top-right" />

      <main className="container mx-auto px-4 max-w-[1500px] py-6 flex-grow">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 flex gap-2">
          <span
            onClick={() => navigate("/")}
            className="hover:text-[#4A44F2] cursor-pointer"
          >
            Trang chủ
          </span>{" "}
          /<span className="text-gray-800 font-medium">Hồ sơ tài khoản</span>
        </div>

        {/* THANH THỐNG KÊ TRÊN CÙNG*/}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 md:w-1/3">
            <div className="w-16 h-16 bg-blue-100 text-[#4A44F2] rounded-full flex items-center justify-center font-bold text-2xl">
              {user?.ho_ten?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">
                {user?.ho_ten || "Khách hàng"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.so_dien_thoai || "Chưa có SĐT"}
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl">
              <Icons.Order />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">
                {profileData?.orderCount || 0}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Tổng số đơn hàng đã mua
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* CỘT TRÁI: SIDEBAR MENU */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all mb-1 ${
                    activeTab === item.id
                      ? "text-[#4A44F2] bg-[#4A44F2]/5 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 flex items-center gap-3 transition-all font-bold text-sm"
              >
                <Icons.Logout /> Đăng xuất
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
          <div className="w-full md:w-3/4 flex flex-col gap-6">
            {/* TỔNG QUAN */}
            {activeTab === "overview" && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Đơn hàng gần đây
                  </h2>
                  {profileData?.recentOrders?.length > 0 ? (
                    profileData.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="mt-4 p-4 border border-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">#{order.ma_don_hang}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            {new Intl.NumberFormat("vi-VN").format(
                              order.tong_thanh_toan,
                            )}
                            đ
                          </p>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {order.trang_thai}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 mt-4 italic">
                      Chưa có đơn hàng nào.
                    </p>
                  )}
                </div>

                {/* SẢN PHẨM YÊU THÍCH  */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                    Sản phẩm yêu thích
                  </h2>
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 ">
                    <Icons.Heart />
                    <p className="text-sm mt-2">
                      Bạn chưa có sản phẩm yêu thích nào.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-3 text-sm text-[#4A44F2] hover:underline font-medium"
                    >
                      Mua sắm ngay!
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB: THẺ THÀNH VIÊN */}
            {activeTab === "CardMember" && (
              <MembershipCarousel
                memberships={profileData?.allMemberships || []}
                userInfo={profileData?.userInfo}
              />
            )}

            {/* TAB 2: THÔNG TIN TÀI KHOẢN */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-6">
                {/* Khối 1: Thông tin cá nhân */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Icons.User /> Thông tin cá nhân
                    </h2>
                    <button
                      onClick={() => toast.success("Mở form chỉnh sửa...")}
                      className="text-sm text-red-500 font-medium hover:underline flex items-center gap-1"
                    >
                      <Icons.Edit />
                      Cập nhật
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Họ và tên:</span>
                      <span className="font-bold text-gray-800">
                        {profileData?.userInfo?.ho_ten}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="font-bold text-gray-800">
                        {profileData?.userInfo?.so_dien_thoai ||
                          "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Giới tính:</span>
                      <span className="font-bold text-gray-800">
                        {profileData?.userInfo?.gioi_tinh || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-bold text-gray-800">
                        {profileData?.userInfo?.email}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Ngày sinh:</span>
                      <span className="font-bold text-gray-800">
                        {profileData?.userInfo?.ngay_sinh
                          ? new Date(
                              profileData.userInfo.ngay_sinh,
                            ).toLocaleDateString("vi-VN")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Địa chỉ mặc định:</span>
                      <span className="font-medium text-gray-400 italic">
                        Chưa thiết lập
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khối 2: Sổ địa chỉ */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Icons.Location /> Sổ địa chỉ
                    </h2>
                    <button className="flex text-sm text-red-500 font-medium hover:underline gap-1.5">
                      <Icons.Plus />
                      Thêm địa chỉ
                    </button>
                  </div>

                  {/* Giao diện khi trống địa chỉ */}
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4"></div>
                    <p className="text-gray-400 text-sm italic">
                      Bạn chưa có địa chỉ nào được tạo.
                    </p>
                  </div>
                </div>

                {/* Khối 3: Bảo mật & Liên kết */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mật khẩu */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-md font-bold text-gray-800">
                        Mật khẩu
                      </h2>
                      <button className="text-xs text-red-500 font-bold hover:underline">
                        ✎ Thay đổi
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">
                        Cập nhật lần cuối:
                      </p>
                      <p className="text-sm font-medium">Vừa xong</p>
                    </div>
                  </div>

                  {/* Liên kết mạng xã hội */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-md font-bold text-gray-800 mb-4">
                      Tài khoản liên kết
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">G</span>{" "}
                          <span className="text-gray-600">Google</span>
                        </div>
                        <span className="text-xs text-green-500 font-bold">
                          ✓ Đã liên kết
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg text-blue-500">Z</span>{" "}
                          <span className="text-gray-600">Zalo</span>
                        </div>
                        <button className="text-xs text-blue-600 font-bold hover:underline">
                          🔗 Liên kết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LỊCH SỬ MUA HÀNG */}
            {activeTab === "orders" && (
              <div className="flex flex-col gap-4">
                {/* Bộ lọc trạng thái nhanh */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex overflow-x-auto no-scrollbar gap-2">
                  {[
                    "Tất cả",
                    "Chờ xác nhận",
                    "Đang giao",
                    "Đã giao",
                    "Đã hủy",
                  ].map((status, index) => (
                    <button
                      key={index}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition ${index === 0 ? "bg-[#4A44F2] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Danh sách đơn hàng */}
                <div className="flex flex-col gap-4">
                  {profileData?.allOrders?.length > 0 ? (
                    profileData.allOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#4A44F2]/30 transition-all"
                      >
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                          <div className="flex items-center gap-2">
                            <span className="text-[#4A44F2] font-black uppercase text-xs">
                              Mã đơn: #{order.ma_don_hang}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {new Date(order.created_at).toLocaleString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm ${
                              order.trang_thai === "delivered"
                                ? "bg-green-500 text-white"
                                : "bg-orange-400 text-white"
                            }`}
                          >
                            {order.trang_thai === "delivered"
                              ? "Thành công"
                              : "Đang xử lý"}
                          </span>
                        </div>

                        <div className="p-4 flex gap-4 items-center">
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 line-clamp-1">
                              {order.chi_tiet?.[0]?.ten_sp_luc_mua ||
                                "Đơn hàng hệ thống LTL"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Số lượng sản phẩm: {order.chi_tiet?.length || 1}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Thành tiền</p>
                            <p className="font-black text-[#4A44F2] text-lg">
                              {new Intl.NumberFormat("vi-VN").format(
                                order.tong_thanh_toan,
                              )}
                              đ
                            </p>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50/30 flex justify-end gap-3">
                          <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-white transition">
                            Mua lại
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/order-detail/${order.id}`)
                            }
                            className="px-4 py-1.5 bg-[#4A44F2] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                          >
                            Chi tiết đơn hàng
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-20 text-center flex flex-col items-center border border-dashed border-gray-200">
                      <Icons.CartEmpty />
                      <p className="text-gray-400 font-medium">
                        Bạn chưa thực hiện giao dịch nào.
                      </p>
                      <button
                        onClick={() => navigate("/")}
                        className="mt-4 text-[#4A44F2] font-bold hover:underline"
                      >
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CÁC TRANG CÒN LẠI  */}
            {["address", "wishlist"].includes(activeTab) &&
              activeTab !== "overview" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex items-center justify-center min-h-[300px] text-gray-500">
                  Tính năng này đang được phát triển!
                </div>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
