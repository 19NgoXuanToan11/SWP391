import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { HiEye, HiEyeOff, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import {
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import backgroundVideo from "../../../assets/videos/beauty-background.mp4";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState("pending"); // pending, success, error
  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(5);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Extract token from URL
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      message.error("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      setResetStatus("error");
      return;
    }

    setToken(tokenFromUrl);
  }, [searchParams]);

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      password: "",
      confirmPassword: "",
    };

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu mới là bắt buộc";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      valid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Gọi API đặt lại mật khẩu
      const response = await fetch(
        "https://localhost:7285/api/Auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify({
            token: token,
            newPassword: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        message.success(data.message || "Đặt lại mật khẩu thành công");
        setResetStatus("success");

        // Bắt đầu đếm ngược để chuyển hướng
        let count = 5;
        setCountdown(count);

        const countdownInterval = setInterval(() => {
          count -= 1;
          setCountdown(count);

          if (count <= 0) {
            clearInterval(countdownInterval);
            navigate("/login");
          }
        }, 1000);
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      message.error(
        error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại!"
      );
      setResetStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Render different content based on reset status
  const renderContent = () => {
    switch (resetStatus) {
      case "success":
        return (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheck className="text-4xl text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đặt lại mật khẩu thành công!
              </h2>
              <p className="text-gray-600">
                Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến
                trang đăng nhập trong {countdown} giây.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-md"
            >
              Đăng nhập ngay
            </motion.button>
          </>
        );

      case "error":
        return (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mb-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineX className="text-2xl text-red-500" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Đặt lại mật khẩu thất bại
              </h2>
              <p className="mt-2 text-gray-600">
                Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/forgot-password")}
              className="px-6 py-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-md"
            >
              Yêu cầu liên kết mới
            </motion.button>
          </>
        );

      default:
        return (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mb-8 text-center"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafetyOutlined className="text-2xl text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Đặt lại mật khẩu
              </h2>
              <p className="mt-2 text-gray-600">
                Tạo mật khẩu mới an toàn cho tài khoản của bạn
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
                    name="password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
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
                    name="confirmPassword"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="Xác nhận mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <KeyOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
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
          </>
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <motion.video
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={backgroundVideo}
          autoPlay
          muted
          loop
          alt="Hình nền trang trí"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-gray-50 to-white relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

        {/* Main content container */}
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

          {/* Form section */}
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
