import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import backgroundVideo from "../../assets/videos/beauty-background.mp4";
import { useLoginMutation } from "../../services/api/beautyShopApi";
import { message } from "antd";
import { auth } from "../../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../store/slices/authSlice";
import {
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";

//scripts
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

  const handleLogin = async () => {
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
          id: tokenPayload.nameid,
          isAdmin: false,
        };

        dispatch(
          setCredentials({
            user: userData,
            token: token,
          })
        );

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Kích hoạt sự kiện userLoggedIn để cập nhật avatar ngay lập tức
        window.dispatchEvent(new Event("userLoggedIn"));

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

  const handleLoginByGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Google access token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Create user data object from Google profile
      const userData = {
        username: user.displayName,
        name: user.displayName,
        role: "User", // Default role for Google sign-in users
        email: user.email,
        id: user.uid,
        isAdmin: false,
        photoURL: user.photoURL,
      };

      // Store user data in Redux and localStorage
      dispatch(
        setCredentials({
          user: userData,
          token: user.accessToken, // Use Firebase token
        })
      );

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Kích hoạt sự kiện userLoggedIn để cập nhật avatar ngay lập tức
      window.dispatchEvent(new Event("userLoggedIn"));

      message.success("Đăng nhập Google thành công!");

      // Navigate to home page
      const redirectPath = location.state?.from;
      if (redirectPath && redirectPath === "/payment") {
        navigate("/qr-payment", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);

      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        message.info("Đăng nhập đã bị hủy.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // This is a common error that happens when multiple popups are triggered
        // We can safely ignore this
      } else {
        message.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
      }
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
                handleLogin();
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
                  Mật khẩu đã quên
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

              {/* Google Login Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="button"
                  onClick={handleLoginByGoogle}
                  className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <FaGoogle className="text-red-500" />
                  <span>Đăng nhập với Google</span>
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
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
