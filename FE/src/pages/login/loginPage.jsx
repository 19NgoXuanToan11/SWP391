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
import { setCredentials } from "../../store/slices/authSlice";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
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

    // Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email là bắt buộc";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Vui lòng nhập địa chỉ email hợp lệ";
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
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      const userInfo = {
        email: formData.email,
        name: formData.email.split("@")[0], // Hoặc thông tin khác từ API
        id: Date.now(), // Hoặc ID từ API
      };

      dispatch(
        setCredentials({
          user: userInfo,
          token: response.token,
        })
      );

      message.success({
        content: "Đăng nhập thành công!",
        duration: 2,
      });

      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      message.error({
        content: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
        duration: 2,
      });
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
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
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
                <Link to="/reset">
                  <button className="text-sm text-pink-500 hover:text-pink-600">
                    Quên mật khẩu?
                  </button>
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

            {/* Đăng nhập bằng mạng xã hội */}
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleLoginByGoogle}
                  className="py-4 px-20 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="text-red-500 flex justify-center">
                    <FaGoogle />
                  </div>
                </button>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
