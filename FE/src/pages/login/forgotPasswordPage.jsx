import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  MailOutlined,
} from "@ant-design/icons";
import backgroundVideo from "../../assets/videos/beauty-background-2.mp4";
import { useForgotPasswordMutation } from "../../services/api/beautyShopApi";

export function ForgotPasswordPage() {
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
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter new password

  // RTK Query hook for forgotPassword API
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // Extract token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userEmail = params.get("email");

    if (token && userEmail) {
      setResetToken(token);
      setEmail(userEmail);
      setStep(2);
    }
  }, [location]);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (step === 1) {
      if (!email) {
        newErrors.email = "Email là bắt buộc";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email không hợp lệ";
        valid = false;
      }
    } else {
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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Gọi API trực tiếp để kiểm tra định dạng nào hoạt động
      const response = await fetch(
        "https://localhost:7285/api/Auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Thử các định dạng khác nhau
          body: JSON.stringify(email), // Thử 1: Gửi email trực tiếp
          // body: JSON.stringify({ email }), // Thử 2: Gửi object với trường email
          // body: JSON.stringify({ Email: email }), // Thử 3: Gửi với key viết hoa
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        message.success(
          "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!"
        );
      } else {
        throw new Error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("Reset request error:", err);
      message.error(
        "Không thể gửi liên kết đặt lại mật khẩu. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Implement API call to reset password
      // const result = await resetPassword({
      //   token: resetToken,
      //   email: email,
      //   password: formData.password
      // }).unwrap();

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Mật khẩu đã được đặt lại thành công!");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Phần bên trái - Video */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />

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

      {/* Phần bên phải */}
      <div className="w-full lg:w-1/2 min-h-screen bg-gradient-to-br from-gray-50 to-white relative flex items-center justify-center">
        {/* Các yếu tố trang trí */}
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-pink-100/50 blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-purple-100/50 blur-3xl"
        />

        {/* Back button - Đặt ở vị trí tuyệt đối */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-6 left-8"
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

        {/* Container nội dung chính - Đã được căn giữa */}
        <div className="w-full max-w-lg px-8 md:px-12 py-6 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
            </h2>
            <p className="mt-2 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-md mx-auto">
              {step === 1
                ? "Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục mật khẩu"
                : "Tạo mật khẩu mới cho tài khoản của bạn"}
            </p>
          </motion.div>

          {step === 1 ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              onSubmit={handleRequestReset}
              className="space-y-6 backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-100 w-full"
            >
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type="email"
                    className="w-full px-4 py-4 pl-10 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                    <MailOutlined />
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <span className="text-red-500">⚠</span> {errors.email}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md relative overflow-hidden group"
                disabled={loading || isLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {loading || isLoading ? (
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
                  "Gửi liên kết đặt lại"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              onSubmit={handleResetPassword}
              className="space-y-6 backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LockOutlined className="text-pink-500" /> Mật khẩu mới
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                    <LockOutlined />
                  </div>
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
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <span className="text-red-500">⚠</span> {errors.password}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <KeyOutlined className="text-pink-500" /> Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                    placeholder="Xác nhận mật khẩu mới"
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
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300 rounded-full"></div>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <span className="text-red-500">⚠</span>{" "}
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
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
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
