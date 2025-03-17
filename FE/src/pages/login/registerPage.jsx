import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiUserCircle,
} from "react-icons/hi";
import { message } from "antd";
import background from "../../assets/pictures/login.jpg";
import { useRegisterMutation } from "../../services/api/beautyShopApi";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Thông tin cá nhân, 2: Thông tin tài khoản
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Sử dụng mutation từ RTK Query
  const [register, { isLoading, isSuccess, error }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
    if (error) {
      message.error(
        error?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
      );
    }
  }, [isSuccess, error, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const stepErrors = {};

    // Kiểm tra fullName
    if (!formData.fullName) {
      stepErrors.fullName = "Vui lòng nhập họ và tên";
    }

    // Kiểm tra số điện thoại
    const phonePattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!formData.phoneNumber) {
      stepErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!phonePattern.test(formData.phoneNumber)) {
      stepErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    // Kiểm tra địa chỉ
    if (!formData.address) {
      stepErrors.address = "Vui lòng nhập địa chỉ";
    }

    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors = {};

    // Kiểm tra username
    if (!formData.userName) {
      stepErrors.userName = "Vui lòng nhập tên đăng nhập";
    }

    // Kiểm tra email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      stepErrors.email = "Vui lòng nhập email";
    } else if (!emailPattern.test(formData.email)) {
      stepErrors.email = "Email không hợp lệ";
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      stepErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      stepErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = "Mật khẩu không khớp";
    }

    return stepErrors;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const stepErrors = validateStep1();
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep2();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const registerData = {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        };

        console.log("Sending register data:", registerData);

        const response = await register(registerData).unwrap();

        // Kiểm tra response từ API
        if (response.success) {
          message.success({
            content:
              "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
            duration: 5,
            onClose: () => {
              navigate("/login");
            },
          });
        } else {
          throw new Error(response.message || "Đăng ký thất bại");
        }
      } catch (err) {
        console.error("Registration error:", err);
      }
    }
  };

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
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
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
          className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-pink-200/20 to-purple-200/20"
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
          className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20"
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
          className="absolute top-[40%] right-[30%] w-40 h-40 rounded-full bg-gradient-to-r from-yellow-200/20 to-pink-200/20"
        />
      </div>

      {/* Main content */}
      <div className="flex w-full h-full relative z-10">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden fixed left-0 h-screen">
          <div className="absolute inset-0 bg-gradient-to-r" />
          <img
            src={background}
            alt="Hình nền trang trí"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              position: "fixed",
              left: 0,
              width: "50%",
              height: "100vh",
            }}
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= 1
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <FaUser />
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">
                    Thông tin cá nhân
                  </span>
                </div>

                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep >= 2 ? "bg-pink-500" : "bg-gray-200"
                  }`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= 2
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <HiLockClosed />
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">
                    Thông tin tài khoản
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              key={`step-${currentStep}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="bg-white p-8 rounded-2xl shadow-xl"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6"
              >
                {currentStep === 1
                  ? "Thông tin cá nhân"
                  : "Thông tin tài khoản"}
              </motion.h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep === 1) {
                    handleNextStep(e);
                  } else {
                    handleSubmit(e);
                  }
                }}
                className="space-y-5"
              >
                <AnimatePresence mode="wait">
                  {currentStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className="space-y-5"
                    >
                      {/* Full Name field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HiUserCircle className="text-pink-500" /> Họ và tên
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="Nhập họ và tên"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiUserCircle className="text-lg" />
                          </div>
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </motion.div>

                      {/* Phone Number field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaPhone className="text-pink-500" /> Số điện thoại
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="Nhập số điện thoại"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaPhone className="text-lg" />
                          </div>
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </motion.div>

                      {/* Address field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-pink-500" /> Địa chỉ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="Nhập địa chỉ"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaMapMarkerAlt className="text-lg" />
                          </div>
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.address}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                      className="space-y-5"
                    >
                      {/* Username field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaUser className="text-pink-500" /> Tên đăng nhập
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="Nhập tên đăng nhập"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaUser className="text-lg" />
                          </div>
                        </div>
                        {errors.userName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.userName}
                          </p>
                        )}
                      </motion.div>

                      {/* Email field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HiMail className="text-pink-500" /> Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="you@example.com"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiMail className="text-lg" />
                          </div>
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </motion.div>

                      {/* Password field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HiLockClosed className="text-pink-500" /> Mật khẩu
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="••••••••"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiLockClosed className="text-lg" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <HiEyeOff size={18} />
                            ) : (
                              <HiEye size={18} />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                          </p>
                        )}
                      </motion.div>

                      {/* Confirm Password field */}
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HiLockClosed className="text-pink-500" /> Xác nhận
                          mật khẩu
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                            placeholder="••••••••"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiLockClosed className="text-lg" />
                          </div>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <motion.div variants={itemVariants} className="flex gap-4 pt-4">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Quay lại
                    </button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type={currentStep === 1 ? "button" : "submit"}
                    onClick={currentStep === 1 ? handleNextStep : undefined}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    {isLoading ? (
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
                    ) : currentStep === 1 ? (
                      "Tiếp tục"
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>

            {/* Login link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center mt-6"
            >
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Bạn đã có tài khoản?{" "}
                <span className="font-medium text-pink-500">Đăng nhập</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
