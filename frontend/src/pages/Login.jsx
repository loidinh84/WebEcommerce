import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Icons from "../assets/icons/index";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config/api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/taikhoan/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, mat_khau: password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token, rememberMe);
        if (rememberMe) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }

        if (data.user.vai_tro === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-end p-4 pt-12 pb-8">
        <div className="max-w-[600px] w-full bg-white shadow-sm border border-gray-100 p-12">
          <h2 className="text-center text-3xl font-bold uppercase mb-10 text-gray-800 tracking-tight">
            Đăng nhập tài khoản
          </h2>

          {/* GẮN SỰ KIỆN ONSUBMIT VÀO FORM */}
          <form className="space-y-7" onSubmit={handleLogin}>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Email / Số điện thoại
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-3.5 focus:outline-none focus:border-blue-500 text-base transition-colors"
                placeholder="Nhập email hoặc số điện thoại"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Mật khẩu<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 px-4 py-3.5 focus:outline-none focus:border-blue-500 text-base transition-colors"
                  placeholder="Nhập mật khẩu"
                  required
                  value={password} // Gắn biến password
                  onChange={(e) => setPassword(e.target.value)} // Bắt sự kiện gõ
                />

                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? Icons.EyeOff : Icons.EyeOn}
                    alt="Toggle Password"
                    className="w-6 h-6 opacity-70"
                  />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-[#e31e24] border-gray-300 rounded focus:ring-[#e31e24] cursor-pointer"
                />
                <span className="ml-3 text-base text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                  Duy trì đăng nhập
                </span>
              </label>

              <a
                href="#"
                className="text-base text-blue-600 hover:text-blue-800 hover:underline italic font-medium transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#e31e24] text-white font-bold py-4 px-4 hover:bg-red-700 transition duration-200 text-base uppercase shadow-sm"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 text-base">
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 px-4 hover:bg-gray-50 transition duration-200 text-base shadow-sm uppercase"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                GOOGLE
              </button>
            </div>
          </div>

          <div className="mt-2 pt-4 border-t border-gray-100 text-center">
            <a
              href="/register"
              className="text-base text-[#e31e24] hover:text-red-700 uppercase font-bold transition-colors underline underline-offset-4"
            >
              ĐĂNG KÝ TÀI KHOẢN Ở ĐÂY
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
