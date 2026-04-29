import React, { useState, useEffect, useRef, useContext } from "react";
import * as Icons from "../assets/icons/index";
import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config/api";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [storeConfig, setStoreConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const categoryMenuRef = useRef(null);
  const [brands, setBrands] = useState({});

  useEffect(() => {
    const fetchStoreConfig = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/store-settings`);
        const result = await response.json();
        if (result.success) {
          setStoreConfig(result.data);
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình cửa hàng:", error);
      }
    };
    fetchStoreConfig();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sanPham/danhMuc-sidebar`);
        if (res.ok) {
          let flatData = await res.json();
          const lookup = {};
          flatData.forEach((cat) => {
            lookup[cat.id] = { ...cat, children: [] };
          });

          const roots = [];
          flatData.forEach((cat) => {
            if (cat.danh_muc_cha_id) {
              if (lookup[cat.danh_muc_cha_id]) {
                lookup[cat.danh_muc_cha_id].children.push(lookup[cat.id]);
              }
            } else {
              roots.push(lookup[cat.id]);
            }
          });

          const grouped = {};
          roots.forEach((root) => {
            const order = parseInt(root.thu_tu, 10) || 0;
            if (!grouped[order]) grouped[order] = [];
            grouped[order].push(root);
          });

          const sortedGroups = Object.keys(grouped)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((orderKey) => {
              return grouped[orderKey].sort((a, b) => {
                const nameA = (a.ten_danh_muc || "").trim().toLowerCase();
                const nameB = (b.ten_danh_muc || "").trim().toLowerCase();
                return nameA.localeCompare(nameB, "vi");
              });
            });

          setCategoryGroups(sortedGroups);

          // Tải trước thương hiệu cho các danh mục gốc để hiện mũi tên ngay lập tức
          flatData.forEach(async (cat) => {
            if (!cat.danh_muc_cha_id) {
              try {
                const bRes = await fetch(
                  `${BASE_URL}/api/sanPham/thuong-hieu/${cat.id}`,
                );
                if (bRes.ok) {
                  const bData = await bRes.json();
                  setBrands((prev) => ({ ...prev, [cat.id]: bData }));
                }
              } catch (err) {
                console.error("Lỗi tải trước thương hiệu:", err);
              }
            }
          });
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 30) {
        // Gần đỉnh trang → luôn hiện thanh top bar
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Lăn xuống rõ ràng (> 8px) → ẩn thanh top bar
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Lăn lên rõ ràng (> 8px) → hiện thanh top bar
        setIsScrolled(false);
      }
      // Các thay đổi nhỏ (< 8px) sẽ bị bỏ qua → tránh giật

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHoverGroup = (group) => {
    group.forEach(async (parent) => {
      if (!brands[parent.id]) {
        try {
          const res = await fetch(
            `${BASE_URL}/api/sanPham/thuong-hieu/${parent.id}`,
          );
          if (res.ok) {
            const data = await res.json();
            setBrands((prev) => ({ ...prev, [parent.id]: data }));
          }
        } catch (error) {
          console.error(
            `Lỗi tải thương hiệu cho danh mục ${parent.id}:`,
            error,
          );
        }
      }
    });
  };

  const renderCategoryIcon = (categoryName, className) => {
    const name = (categoryName || "").toLowerCase();

    if (name.includes("điện thoại"))
      return <Icons.Phone className={className} />;
    if (name.includes("laptop")) return <Icons.Laptop className={className} />;
    if (name.includes("tablet")) return <Icons.Phone className={className} />;
    if (name.includes("pc") || name.includes("máy tính"))
      return <Icons.PC className={className} />;
    if (name.includes("màn hình")) return <Icons.PC className={className} />;
    if (name.includes("phụ kiện") || name.includes("tai nghe"))
      return <Icons.Headphone className={className} />;
    if (name.includes("bàn phím") || name.includes("chuột"))
      return <Icons.Keyboard className={className} />;
    if (name.includes("Hàng cũ")) return <Icons.Box className={className} />;
    if (name.includes("cũ")) return <Icons.Box className={className} />;

    return <Icons.DanhMuc className={className} />;
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm("");
      }
    }
  };

  return (
    <header className="bg-[#4A44F2] text-white font-sans shadow-md sticky top-0 z-[1000]">
      {/* --- 1. THANH TOP BAR TRÊN CÙNG --- */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? "max-h-0 py-0 opacity-0" : "max-h-[50px] opacity-100"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6 hidden lg:flex">
            <span className="flex items-center text-sm gap-1.5 hover:text-gray-200">
              <Icons.ChinhHang className=" w-4 h-4 brightness-0 invert" />
              Sản phẩm chính hãng - Xuất hóa đơn đầy đủ
            </span>

            <span className="flex items-center text-sm  gap-1.5 hover:text-gray-200">
              <Icons.Delivery className="w-4 h-4 brightness-0 invert" />
              Giao nhanh - miễn phí cho hóa đơn 300k
            </span>

            <span className="flex items-center text-sm gap-1.5 hover:text-gray-200">
              <Icons.Build className=" w-4 h-4 brightness-0 invert" />
              Lắp đặt tại nhà - Giao hàng tận tay
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="cursor-pointer text-sm hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <Icons.Bill className="w-4 h-4 brightness-0 invert" />
              Tra cứu đơn hàng
            </span>

            <span className="text-white/40">|</span>

            <span className="font-semibold cursor-pointer text-sm hover:text-gray-200 flex items-center gap-1.5 text-white/90">
              <Icons.Call className="w-4 h-4 gap-2 brightness-0 invert" />
              {storeConfig?.so_dien_thoai}
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. THANH HEADER CHÍNH --- */}
      <div
        ref={categoryMenuRef}
        className="w-full max-w-7xl mx-auto flex items-center px-4 justify-start gap-4"
      >
        <Link to="/">
          <div
            className="flex gap-1 bg-white/10 shadow cursor-pointer px-3 py-1.5 rounded-full shadow-lg my-3"
            onClick={() => {
              if (window.location.pathname === "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
          >
            <img
              src={
                storeConfig?.logo_url
                  ? `${BASE_URL}${storeConfig.logo_url}`
                  : Logo
              }
              alt={storeConfig?.ten_cua_hang}
              className="h-10 w-auto object-contain"
            />{" "}
            <span className="brightness font-bold pl-1.5  text-xl justify-center items-center flex">
              {storeConfig?.ten_cua_hang || ""}
            </span>
          </div>
        </Link>

        {/* Hai nút Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* <button className="flex cursor-pointer items-center gap-2 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition">
            <Icons.DanhMuc className="w-5 h-5 brightness-0" />
            <span className="font-medium text-[15px] text-gray-900">
              Thông tin shop
            </span>
            <Icons.ArrowDown className="w-5 h-5 text-gray-600" />
          </button> */}

          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex cursor-pointer items-center gap-1 bg-white/90 hover:bg-white/70 px-3.5 py-2 rounded-lg transition "
          >
            <Icons.DanhMuc className="w-5 h-5 brightness-0" />
            <span className="font-medium text-[15px] text-gray-900">
              Danh mục
            </span>
            <Icons.ArrowDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 relative">
          <button
            onClick={handleSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          >
            <Icons.Search className="w-6 h-6 brightness-0 cursor-pointer" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Hôm nay bạn muốn mua gì?"
            className="w-full py-2.5 pl-10 pr-4 rounded-lg text-gray-800 bg-white outline-none shadow-inner text-[14px]"
          />
        </div>

        {/* --- CỤM NÚT BẤM BÊN PHẢI ĐÃ ĐƯỢC GẮN LOGIC --- */}
        <div className="flex items-center gap-1 text-sm flex-shrink-0 font-medium">
          <button
            onClick={() => navigate("/cart")}
            className="flex cursor-pointer hover:bg-white/10 hover:border-white px-4 py-2 rounded-lg text-sm items-center gap-1 hover:text-gray-200 transition"
          >
            <span>Giỏ hàng</span>
            <Icons.ShoppingCart className="w-5 h-5 brightness-0 invert" />
          </button>

          {user ? (
            <div
              className="relative group py-2"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="flex items-center gap-3 hover:bg-white/10 transition bg-black/10 px-4 py-1.5 rounded-lg cursor-pointer">
                <span className="text-white text-sm font-bold truncate max-w-[150px] text-right">
                  {user.ho_ten || user.so_dien_thoai}
                </span>
                <img
                  src={
                    user.anh_dai_dien?.startsWith("http")
                      ? user.anh_dai_dien
                      : user.anh_dai_dien
                        ? `${BASE_URL}${user.anh_dai_dien}`
                        : `https://ui-avatars.com/api/?name=${user.ho_ten || user.so_dien_thoai || "User"}&background=random`
                  }
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 text-gray-800 z-50 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#4A44F2] transition flex items-center gap-3 cursor-pointer"
                  >
                    Hồ sơ tài khoản
                  </button>

                  <button
                    onClick={() =>
                      navigate("/profile", { state: { activeTab: "orders" } })
                    }
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-[#4A44F2] transition flex items-center gap-3 cursor-pointer"
                  >
                    Đơn hàng của tôi
                  </button>

                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-3 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Nút Đăng Ký */}
              <Link to="/register">
                <button className="flex text-[16px] cursor-pointer items-center gap-1 text-xl hover:bg-white/10 transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <Icons.User className="w-7 h-7 brightness-0 invert" />
                  <span>Đăng Ký</span>
                </button>
              </Link>

              {/* Nút Đăng Nhập */}
              <Link to="/login">
                <button className="flex cursor-pointer items-center gap-1 text-[16px] hover:bg-[#4A44F2] transition border border-white/40 hover:border-white px-4 py-2 rounded-lg">
                  <Icons.User className="w-7 h-7 brightness-0 invert" />
                  <span>Đăng nhập</span>
                </button>
              </Link>
            </>
          )}
        </div>

        {showCategories && (
          <div
            className="fixed inset-0 w-full h-screen bg-black/40 z-[-1]"
            onClick={() => setShowCategories(false)}
          />
        )}

        {showCategories && (
          <div className="absolute top-full left-34 mt-4 w-[245px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 text-gray-800 animate-fade-in z-[1001]">
            <div className="relative px-2 flex flex-col">
              <Link
                onClick={() => setShowCategories(false)}
                to="/"
                className="flex items-center gap-3 px-2 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors hover:text-[#4A44F2]"
              >
                <Icons.Home className="w-6 h-6 text-[#2621a3]" />
                Trang chủ
              </Link>

              {categoryGroups.length > 0 ? (
                categoryGroups.map((group, groupIndex) => {
                  const hasChildrenInGroup = group.some(
                    (parent) => parent.children.length > 0,
                  );
                  const hasBrandsInGroup = group.some(
                    (p) => brands[p.id] && brands[p.id].length > 0,
                  );
                  const shouldShowPopup =
                    hasChildrenInGroup || hasBrandsInGroup;

                  return (
                    <div
                      key={groupIndex}
                      className="group"
                      onMouseEnter={() => handleHoverGroup(group)}
                    >
                      <div className="flex items-center p-2 rounded-lg transition-colors group-hover:bg-gray-50 cursor-default">
                        {renderCategoryIcon(
                          group[0].ten_danh_muc,
                          "w-6 h-6 text-[#2621a3] mr-3",
                        )}

                        <div className="flex flex-wrap items-center flex-1 gap-x-1.5">
                          {group.map((parent, catIndex) => (
                            <div key={parent.id} className="flex items-center">
                              <Link
                                to={`/category/${parent.slug}`}
                                onClick={() => setShowCategories(false)}
                                className="font-medium text-sm text-gray-700 hover:text-[#4A44F2] transition-colors"
                              >
                                {parent.ten_danh_muc}
                              </Link>

                              {catIndex < group.length - 1 && (
                                <span className="text-gray-700 text-sm font-medium">
                                  ,
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {shouldShowPopup && (
                          <Icons.ArrowForward className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
                        )}
                      </div>

                      {shouldShowPopup && (
                        <div className="absolute -top-2.5 bottom-0 left-full ml-4 w-[731px] min-h-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="flex flex-col gap-8">
                            {group.map((parent) => {
                              const parentBrands = brands[parent.id] || [];
                              const hasChildren = parent.children.length > 0;
                              const hasBrands = parentBrands.length > 0;

                              if (!hasChildren && !hasBrands) return null;

                              return (
                                <div
                                  key={parent.id}
                                  className="flex flex-col gap-4"
                                >
                                  <h3 className="font-bold text-base text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    {parent.ten_danh_muc}
                                  </h3>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {hasBrands && (
                                      <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                          Thương hiệu nổi bật
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {parentBrands.map(
                                            (brandName, bIndex) => (
                                              <Link
                                                key={`brand-${bIndex}`}
                                                to={`/category/${parent.slug}?brand=${encodeURIComponent(brandName)}`}
                                                onClick={() =>
                                                  setShowCategories(false)
                                                }
                                                className="border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:border-[#4A44F2] hover:text-[#4A44F2] hover:bg-blue-50 transition-all"
                                              >
                                                {brandName}
                                              </Link>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {hasChildren && (
                                      <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                          Dòng sản phẩm
                                        </p>
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                          {parent.children.map((child) => (
                                            <Link
                                              key={child.id}
                                              to={`/category/${child.slug}`}
                                              onClick={() =>
                                                setShowCategories(false)
                                              }
                                              className="text-sm text-gray-600 hover:text-[#4A44F2] hover:font-bold transition-all flex items-center gap-2"
                                            >
                                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full inline-block"></span>
                                              {child.ten_danh_muc}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <span className="block px-4 py-3 text-sm text-gray-400 italic">
                  Đang tải danh mục...
                </span>
              )}

              <Link
                onClick={() => setShowCategories(false)}
                to="/so-sanh"
                className="flex items-center gap-3 px-2 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors hover:text-[#4A44F2]"
              >
                <Icons.Compare className="w-6 h-6 text-[#2621a3]" />
                So sánh Sản phẩm
              </Link>
              <Link
                onClick={() => setShowCategories(false)}
                to="/"
                className="flex items-center gap-3 px-2 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors hover:text-[#4A44F2]"
              >
                <Icons.ChatAI className="w-6 h-6 text-[#2621a3]" />
                Build PC với AI
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
