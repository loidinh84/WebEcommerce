import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MembershipCarousel from "../components/UserProfileTabs/MembershipCarousel";
import BASE_URL from "../config/api";
import { Icons } from "../components/UserProfileTabs/Icons";
import Overview from "../components/UserProfileTabs/Overview";
import ProfileTab from "../components/UserProfileTabs/Profile";
import OrdersTab from "../components/UserProfileTabs/OrderHistories";
import WishlistTab from "../components/UserProfileTabs/Wishlist";

const UserProfile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [profileData, setProfileData] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "overview");

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.san_pham.id !== productId),
    );
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/taiKhoan/dashboard/${user.id}`,
      );
      const data = await response.json();
      setProfileData(data);
      if (updateUser && data.userInfo) {
        updateUser({
          ho_ten: data.userInfo.ho_ten,
          so_dien_thoai: data.userInfo.so_dien_thoai,
          anh_dai_dien: data.userInfo.anh_dai_dien,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await fetchProfile();
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const wishRes = await fetch(
          `${BASE_URL}/api/wishlist/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (wishRes.ok) {
          const wishData = await wishRes.json();
          setWishlist(wishData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) initData();
  }, [user]);

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
      <Toaster position="top-center" />

      <main className="container mx-auto max-w-[1280px] py-3 flex-grow">
        {/* THANH THỐNG KÊ TRÊN CÙNG*/}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 md:w-1/3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-bold text-2xl overflow-hidden border border-gray-200">
              <img
                src={
                  user?.anh_dai_dien?.startsWith("http")
                    ? user.anh_dai_dien
                    : user?.anh_dai_dien
                    ? `${BASE_URL}${user.anh_dai_dien}`
                    : `https://ui-avatars.com/api/?name=${user?.ho_ten || user?.so_dien_thoai || "U"}&background=random`
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
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

          <div className="flex items-center gap-4 ">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl">
              <Icons.Order />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">
                {profileData?.orderCount || 0}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide ">
                Tổng số đơn hàng đã mua
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* CỘT TRÁI: SIDEBAR MENU */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center cursor-pointer gap-3 transition-all mb-1 ${
                    activeTab === item.id
                      ? "text-[#4A44F2] bg-[#4A44F2]/5 font-bold"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <hr className=" border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded text-red-500 hover:bg-red-50 flex items-center gap-3 transition-all font-bold text-sm"
              >
                <Icons.Logout /> Đăng xuất
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
          <div className="w-full md:w-3/4 flex flex-col gap-6">
            {/* TỔNG QUAN */}
            {activeTab === "overview" && (
              <Overview
                profileData={profileData}
                wishlist={wishlist}
                onRemoveWishlistItem={handleRemoveFromWishlist}
                setActiveTab={setActiveTab}
                navigate={navigate}
              />
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
              <ProfileTab
                profileData={profileData}
                onProfileUpdated={fetchProfile}
                onLogout={handleLogout}
              />
            )}

            {/* TAB 3: LỊCH SỬ MUA HÀNG */}
            {activeTab === "orders" && (
              <OrdersTab profileData={profileData} navigate={navigate} />
            )}

            {/* TAB 4: CÁC TRANG CÒN LẠI  */}
            {["address"].includes(activeTab) && activeTab !== "overview" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex items-center justify-center min-h-[300px] text-gray-500">
                Tính năng này đang được phát triển!
              </div>
            )}

            {/* TAB 5: SẢN PHẨM YÊU THÍCH */}
            {activeTab === "wishlist" && (
              <WishlistTab
                wishlist={wishlist}
                onRemoveWishlistItem={handleRemoveFromWishlist}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
