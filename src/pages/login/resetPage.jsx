import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Xóa lỗi khi người dùng nhập
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return "Email là bắt buộc.";
    } else if (!emailPattern.test(email)) {
      return "Vui lòng nhập địa chỉ email hợp lệ.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateEmail();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Giả lập quá trình đặt lại mật khẩu
    setTimeout(() => {
      setLoading(false);
      setSuccess(
        "Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn."
      );
    }, 1500);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Phần bên trái - Hình nền */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
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
              Quên Mật Khẩu?
            </h2>
            <p className="text-gray-600 text-base">
              Nhập email của bạn để đặt lại mật khẩu
            </p>
          </div>

          {/* Phần giữa - Biểu mẫu */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl transition-all transform hover:translate-y-[-1px] hover:shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.99] mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Gửi Liên Kết Đặt Lại"
                )}
              </button>
            </form>

            {success && (
              <p className="text-green-500 text-sm mt-4">{success}</p>
            )}
          </div>

          {/* Phần dưới */}
          <Link to="/login">
            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Nhớ mật khẩu của bạn? Đăng nhập
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
