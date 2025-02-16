import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { message } from "antd";
import background from "../../assets/pictures/background_login.jpg";
import { useRegisterMutation } from "../../services/api/beautyShopApi";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Sử dụng mutation từ RTK Query
  const [register, { isLoading, isSuccess, error }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success("Đăng ký thành công!");
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

  const validateForm = () => {
    const errors = {};
    // Kiểm tra họ và tên
    if (!formData.firstName) {
      errors.firstName = "Vui lòng nhập họ";
    }
    if (!formData.lastName) {
      errors.lastName = "Vui lòng nhập tên";
    }

    // Kiểm tra email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Vui lòng nhập email";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Chỉ gửi email và mật khẩu theo yêu cầu của API
        const registerData = {
          email: formData.email,
          password: formData.password,
        };

        const response = await register(registerData).unwrap();

        // Lưu thông tin người dùng vào localStorage nếu cần
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
          })
        );

        // Hiển thị thông báo thành công
        message.success({
          content: "Đăng ký thành công! Chuyển hướng đến trang đăng nhập...",
          duration: 2, // Hiển thị trong 2 giây
          onClose: () => {
            // Chuyển hướng sau khi thông báo đóng
            navigate("/login");
          },
        });
      } catch (err) {
        // Xử lý lỗi cụ thể từ API
        if (err?.data?.error) {
          message.error(err.data.error);
        } else {
          message.error("Đăng ký thất bại. Vui lòng thử lại!");
        }
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Phần bên trái - Hình nền */}
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

      {/* Phần bên phải - Biểu mẫu */}
      <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto">
        {/* Các yếu tố trang trí */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

        {/* Container nội dung chính */}
        <div className="h-full flex flex-col px-8 md:px-12 py-8 space-y-8 relative z-10">
          {/* Phần trên */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Tạo tài khoản
            </h2>
            <p className="text-gray-600 text-base">
              Tham gia cùng chúng tôi và bắt đầu hành trình của bạn hôm nay
            </p>
          </div>

          {/* Phần giữa - Biểu mẫu */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trường email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Trường mật khẩu */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="••••••••"
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
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Trường xác nhận mật khẩu */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Nút gửi */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl transition-all transform hover:translate-y-[-1px] hover:shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.99] mt-4 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Tạo tài khoản"
                )}
              </button>
            </form>

            {/* Đăng nhập bằng mạng xã hội */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button className="py-4 px-20 rounded-xl border border-gray-300 bg-white/50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all">
                <div className="text-red-500 flex justify-center">
                  <FaGoogle />
                </div>
              </button>
            </div>
          </div>

          {/* Phần dưới */}
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
            >
              Bạn đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
