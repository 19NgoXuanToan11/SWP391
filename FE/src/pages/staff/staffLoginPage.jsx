import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import backgroundVideo from "../../assets/videos/beauty-background-3.mp4";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../../store/slices/authSlice";
import {
  LockOutlined,
  UserOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useLoginMutation } from "../../services/api/beautyShopApi";

const StaffLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [login, { isLoading }] = useLoginMutation();

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

        // Chú ý: Trong thực tế, bạn có thể cần điều chỉnh logic kiểm tra role tùy thuộc vào hệ thống của bạn
        // Kiểm tra quyền staff - có thể nhận "Staff" hoặc bất kỳ role nào bạn đã đặt cho nhân viên
        if (tokenPayload.role === "Staff" || tokenPayload.role === "Manager") {
          const userData = {
            username: tokenPayload.unique_name,
            name: tokenPayload.unique_name,
            role: "staff", // Đặt role là "staff" trong hệ thống
            email: tokenPayload.email,
            id: tokenPayload.nameid,
            isAdmin: false, // Nhân viên không phải admin
          };

          dispatch(
            setCredentials({
              user: userData,
              token: token,
            })
          );

          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_user", JSON.stringify(userData));
          localStorage.setItem("auth_isAdmin", "false"); // Đảm bảo đặt isAdmin là false

          message.success("Đăng nhập nhân viên thành công!");

          // Chuyển hướng đến trang orders của staff hoặc trang mà user đã cố truy cập trước đó
          const redirectPath = location.state?.from || "/staff/orders";
          navigate(redirectPath, { replace: true });
        } else {
          message.error("Tài khoản không có quyền nhân viên!");
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

        {/* Video background */}
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
              CHÀO MỪNG NHÂN VIÊN
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

          {/* Navigation options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-purple-500 font-medium">
                  Liên kết hữu ích
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link to="/admin/login">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group relative py-3 px-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                >
                  <div className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

                  <div className="relative flex items-center justify-center text-white">
                    <div className="w-7 h-7 rounded-full bg-purple-700/50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <LockOutlined className="text-white group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">Đăng nhập Admin</span>
                  </div>
                </motion.button>
              </Link>

              <button
                onClick={handleBackToUserLogin}
                className="w-full group relative py-3 px-6 rounded-xl overflow-hidden bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 mt-2"
              >
                <div className="relative flex items-center justify-center text-gray-700">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <ArrowLeftOutlined className="text-gray-500 group-hover:-rotate-12 transition-transform" />
                  </div>
                  <span className="text-sm font-medium">
                    Quay lại đăng nhập người dùng
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
