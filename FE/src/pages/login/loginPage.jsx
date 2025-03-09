import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";
import { useLoginMutation } from "../../services/api/beautyShopApi";
import { message } from "antd";
import { auth } from "../../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../store/slices/authSlice";
import { LockOutlined } from "@ant-design/icons";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();

  const validateForm = () => {
    let valid = true;
    let errors = {};

    // Kiểm tra username
    if (!formData.username) {
      errors.username = "Tên đăng nhập là bắt buộc";
      valid = false;
    }

    // Kiểm tra Mật khẩu
    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      valid = false;
    }

    // Đối với Đăng ký, kiểm tra xác nhận mật khẩu
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Kiểm tra xem có đang đăng nhập admin không
      const isAdminLoggedIn = localStorage.getItem("auth_isAdmin") === "true";

      // Nếu đang đăng nhập admin, đăng xuất trước
      if (isAdminLoggedIn) {
        dispatch(logout());
      }

      const result = await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      if (result.success) {
        const token = result.data;
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));

        // Kiểm tra xem có phải admin không
        if (tokenPayload.role === "Admin") {
          message.error("Vui lòng sử dụng trang đăng nhập Admin!");
          setLoading(false);
          return;
        }

        const userData = {
          username: tokenPayload.unique_name,
          name: tokenPayload.unique_name,
          role: tokenPayload.role,
          email: tokenPayload.email,
          isAdmin: false,
        };

        dispatch(
          setCredentials({
            user: userData,
            token: token,
          })
        );

        message.success("Đăng nhập thành công!");

        const redirectPath = location.state?.from;
        if (redirectPath && redirectPath === "/payment") {
          navigate("/qr-payment", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        message.error(result.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error(
        err.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginByGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const token = result.user.accessToken;
        const user = result.user;

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Phần bên trái */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={background}
          alt="Hình nền trang trí"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Phần bên phải */}
      <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-gray-50 to-white relative">
        {/* Các yếu tố trang trí */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

        {/* Container nội dung chính */}
        <div className="h-full flex flex-col px-8 md:px-12 py-6">
          {/* Phần Form */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
              </h2>
              <p className="mt-1 text-gray-600">
                {isLogin
                  ? "Đăng nhập để tiếp tục hành trình của bạn"
                  : "Đăng ký để bắt đầu hành trình của bạn"}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <HiEyeOff size={18} />
                    ) : (
                      <HiEye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Nhớ tôi & Quên mật khẩu */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span>Nhớ tôi</span>
                </label>
                <Link
                  to="/reset"
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Nút Gửi */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl transition-all transform hover:translate-y-[-1px] hover:shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : isLogin ? (
                  "Đăng nhập"
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>

            {/* Liên kết Đăng ký */}
            {isLogin && (
              <div className="text-center mt-4">
                <Link
                  to="/register"
                  className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Bạn chưa có tài khoản? Đăng ký
                </Link>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-pink-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-pink-400 font-medium">
                    Bạn là quản trị viên?
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAdminLogin}
                  className="group relative py-3 px-6 rounded-xl overflow-hidden bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-400/30"
                >
                  {/* Hiệu ứng lóe sáng */}
                  <div className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-pink-200 to-pink-400 opacity-50"></div>

                  {/* Nội dung nút */}
                  <div className="relative flex items-center justify-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <LockOutlined className="text-white text-lg group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">
                      Đăng nhập Quản trị viên
                    </span>
                  </div>

                  {/* Hiệu ứng hover glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-pink-400/20 to-pink-600/20 blur-xl"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
