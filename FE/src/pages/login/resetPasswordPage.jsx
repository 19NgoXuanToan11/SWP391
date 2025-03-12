import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import background from "../../assets/pictures/background_login.jpg";
import axios from "axios";
import api from "../../config/axios";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  // Extract token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userEmail = params.get("email");

    if (token && userEmail) {
      setResetToken(token);
      setEmail(userEmail);
      // Verify token validity
      verifyToken(token, userEmail);
    } else {
      setTokenChecked(true);
      setTokenValid(false);
    }
  }, [location]);

  const verifyToken = async (token, email) => {
    try {
      // You can implement an API call to verify the token
      // For now, we'll assume it's valid if both token and email exist
      setTokenValid(true);
    } catch (error) {
      console.error("Token verification error:", error);
      setTokenValid(false);
    } finally {
      setTokenChecked(true);
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Kiểm tra Mật khẩu
    if (!formData.password) {
      newErrors.password = "Mật khẩu mới là bắt buộc";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      valid = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log("Đang gửi yêu cầu đặt lại mật khẩu với thông tin:", {
      email: email,
      token: resetToken,
      newPassword: formData.password,
    });

    try {
      const response = await fetch(
        "http://localhost:7285/api/Auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            token: resetToken,
            newPassword: formData.password,
          }),
        }
      );

      const data = await response.json();
      console.log("Phản hồi từ API:", data);

      if (data && data.success) {
        message.success("Mật khẩu đã được đặt lại thành công!");
        navigate("/login");
      } else {
        message.error(data.message || "Không thể đặt lại mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi khi đặt lại mật khẩu:", err);
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking token
  if (!tokenChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Đang xác thực liên kết...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Liên kết không hợp lệ
          </h2>
          <p className="text-gray-600 mb-6">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu
            cầu liên kết mới.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-md"
          >
            Yêu cầu liên kết mới
          </button>
        </div>
      </div>
    );
  }

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
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-auto"
          >
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-300"
            >
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeftOutlined className="text-sm" />
              </motion.span>
              <span className="font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-pink-500 group-hover:after:w-full after:transition-all after:duration-300">
                Quay lại đăng nhập
              </span>
            </button>
          </motion.div>

          {/* Phần Form */}
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mb-8 text-center"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Đặt lại mật khẩu
              </h2>
              <p className="mt-2 text-gray-600">
                Tạo mật khẩu mới cho tài khoản của bạn
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff size={18} />
                    ) : (
                      <HiEye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md"
                disabled={loading}
              >
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
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
