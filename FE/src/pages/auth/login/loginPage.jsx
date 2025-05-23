import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import backgroundVideo from "../../../assets/videos/beauty-background.mp4";
import { useLoginMutation } from "../../../services/api/beautyShopApi";
import { message } from "antd";
import { auth } from "../../../config/firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../../store/slices/auth/authSlice";
import {
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import UserService from "../../../utils/user/userService";

// Thêm hàm parseJwt để giải mã JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return {};
  }
};

export default function LoginPage() {
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
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

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
        const tokenPayload = parseJwt(token);

        // Kiểm tra xem có phải admin không
        if (tokenPayload.role === "Admin") {
          message.error("Vui lòng sử dụng trang đăng nhập Admin!");
          setLoading(false);
          return;
        }

        // Xóa tất cả các key avatar chung trước khi đăng nhập vào tài khoản mới
        localStorage.removeItem("userAvatar");
        localStorage.removeItem("tempUserAvatar");

        const userData = {
          username: tokenPayload.unique_name,
          fullName: tokenPayload.fullName || tokenPayload.unique_name,
          role: tokenPayload.role,
          email: tokenPayload.email,
          id: tokenPayload.nameid,
          isAdmin: false,
          token: token,
        };

        // Sử dụng UserService để đăng nhập
        UserService.login(userData);

        // Vẫn dispatch action cho Redux để tương thích với code hiện tại
        dispatch(
          setCredentials({
            user: userData,
            token: token,
          })
        );

        // Gọi API lấy thông tin đầy đủ của người dùng
        if (userData.id) {
          try {
            const userResponse = await axios.get(
              `https://localhost:7285/api/User/${userData.id}`
            );
            if (userResponse.data) {
              // Cập nhật thông tin người dùng với dữ liệu đầy đủ từ API
              const fullUserData = {
                ...userData,
                fullName: userResponse.data.fullName || userData.fullName,
                phoneNumber: userResponse.data.phoneNumber || "",
                address: userResponse.data.address || "",
              };

              // Cập nhật vào UserService
              UserService.updateUserInfo(fullUserData);
            }
          } catch (error) {
            console.error("Không thể lấy thông tin người dùng từ API:", error);
          }
        }

        message.success("Đăng nhập thành công!");

        const redirectPath = location.state?.from;
        if (redirectPath && redirectPath === "/cart") {
          navigate("/cart", { replace: true });
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

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      // credentialResponse.credential chứa JWT ID token
      const idToken = credentialResponse.credential;

      // Gọi API backend
      const response = await fetch(
        "https://localhost:7285/api/Auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
          body: JSON.stringify(idToken),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Đảm bảo userData có fullName
        const userData = {
          ...result.data,
          fullName:
            result.data.fullName || result.data.name || result.data.username,
        };

        dispatch(
          setCredentials({
            user: userData,
            token: userData.token || idToken,
          })
        );

        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", userData.token || idToken);

        window.dispatchEvent(new Event("userLoggedIn"));
        window.dispatchEvent(
          new CustomEvent("fullNameUpdated", {
            detail: { fullName: userData.fullName },
          })
        );

        message.success("Đăng nhập Google thành công!");

        const redirectPath = location.state?.from;
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        message.error(result.message || "Đăng nhập Google thất bại");
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Floating shapes for decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-pink-200/20 to-purple-200/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            x: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] right-[30%] w-40 h-40 rounded-full bg-gradient-to-r from-yellow-200/20 to-pink-200/20 blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="flex w-full h-full relative z-10">
        {/* Left side - Video thay vì Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />

            {/* Video background thay thế cho hình ảnh */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
              {/* Fallback nếu trình duyệt không hỗ trợ video */}
              Your browser does not support the video tag.
            </video>

            {/* Thêm overlay để tăng độ tương phản cho text */}
            <div className="absolute inset-0 mix-blend-overlay" />
          </motion.div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
                {isLogin ? "Chào mừng đến với Beauty & Care" : "Tạo tài khoản"}
              </h2>
              <p className="mt-2 text-gray-700 text-lg">
                {isLogin
                  ? "Đăng nhập để tiếp tục hành trình của bạn"
                  : "Đăng ký để bắt đầu hành trình của bạn"}
              </p>
            </motion.div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(e);
              }}
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserOutlined /> Tên đăng nhập
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all shadow-sm"
                      placeholder="Nhập tên đăng nhập"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                      <UserOutlined />
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <KeyOutlined /> Mật khẩu
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all shadow-sm"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                      <KeyOutlined />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <HiEyeOff size={18} />
                      ) : (
                        <HiEye size={18} />
                      )}
                    </button>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <KeyOutlined /> Xác nhận mật khẩu
                      </label>
                      <div className="relative group">
                        <input
                          type="password"
                          className="w-full px-4 py-3 pl-10 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all shadow-sm"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                          <KeyOutlined />
                        </div>
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me & Forgot password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-end"
              >
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      <span>Đang xử lý...</span>
                    </div>
                  ) : isLogin ? (
                    "Đăng Nhập"
                  ) : (
                    "Đăng Ký"
                  )}
                </button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              {isLogin ? (
                <Link
                  to="/register"
                  className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Bạn chưa có tài khoản?{" "}
                  <span className="font-medium text-pink-500">Đăng ký</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Đã có tài khoản?{" "}
                  <span className="font-medium text-pink-500">Đăng nhập</span>
                </Link>
              )}
            </motion.div>

            {/* Admin Login Section */}
            <motion.div variants={itemVariants} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-pink-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-pink-400 font-medium">
                    Đăng nhập với vai trò khác
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdminLogin}
                  className="w-full group relative py-3 px-6 rounded-xl overflow-hidden bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition-all duration-300"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-pink-200 to-pink-400 opacity-50"></div>

                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <LockOutlined className="text-white text-lg group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">
                      Đăng nhập Quản trị viên
                    </span>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-pink-400/20 to-pink-600/20 blur-xl"></div>
                </motion.button>

                {/* Staff Login Button - New addition */}
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(255, 135, 135, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/staff/login")}
                  className="w-full group relative py-3 px-6 rounded-xl overflow-hidden bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-400 transition-all duration-300"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-green-500/30 to-green-500/90 opacity-50"></div>

                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/40 to-green-500/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 border border-white/20">
                      <UserOutlined className="text-white text-lg group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-sm font-medium tracking-wide drop-shadow-sm">
                      Đăng nhập Nhân viên
                    </span>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#FF8787]/20 to-[#FFDAB9]/20 blur-xl"></div>

                  {/* Sparkle effect */}
                  <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-white opacity-70 group-hover:animate-ping"></div>
                  <div className="absolute bottom-0 left-0 -mb-1 -ml-1 w-2 h-2 rounded-full bg-white opacity-70 group-hover:animate-ping delay-300"></div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
