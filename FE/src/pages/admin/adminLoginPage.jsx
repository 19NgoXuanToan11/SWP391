import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../../services/api/beautyShopApi";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../store/slices/authSlice";
import { message } from "antd";
import { motion } from "framer-motion";
import backgroundVideo from "../../assets/videos/beauty-background-3.mp4";
import {
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { HiEye, HiEyeOff } from "react-icons/hi";

export function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      message.error("Vui lòng nhập đầy đủ thông tin đăng nhập!");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Kiểm tra xem có đang đăng nhập user không
      const isUserLoggedIn =
        localStorage.getItem("auth_isAdmin") === "false" &&
        localStorage.getItem("auth_token");

      // Nếu đang đăng nhập user, đăng xuất trước
      if (isUserLoggedIn) {
        dispatch(logout());
      }

      const result = await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      if (result.success) {
        const token = result.data;
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));

        if (tokenPayload.role === "Admin") {
          const userData = {
            username: tokenPayload.unique_name,
            name: tokenPayload.unique_name,
            role: tokenPayload.role,
            email: tokenPayload.email,
            isAdmin: true,
          };

          dispatch(
            setCredentials({
              user: userData,
              token: token,
            })
          );

          // Thêm flag để đánh dấu đang ở chế độ admin
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("token", token);
          localStorage.setItem("auth_mode", "admin");

          message.success("Đăng nhập quản trị thành công!");
          const redirectPath = location.state?.from || "/dashboard";
          navigate(redirectPath, { replace: true });
        } else {
          message.error("Tài khoản không có quyền quản trị!");
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

  const handleBackToUserLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Video */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10" />

        {/* Video background thay thế cho hình ảnh */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Phần bên phải - Form đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-r from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md backdrop-blur-sm bg-white/90 p-8 rounded-2xl shadow-xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center mb-8 mt-6"
          >
            <motion.h2
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-500 bg-clip-text text-transparent"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              CHÀO MỪNG QUẢN TRỊ VIÊN
            </motion.h2>
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-purple-600 to-red-500 mt-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "5rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="relative group overflow-hidden rounded-xl">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <UserOutlined />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative group overflow-hidden rounded-xl">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <LockOutlined />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-pink-500/30 relative overflow-hidden group"
              disabled={loading}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Truy cập"
              )}
            </motion.button>
          </form>

          {/* Back to User Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <button
              onClick={handleBackToUserLogin}
              className="text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeftOutlined /> Quay lại đăng nhập người dùng
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
