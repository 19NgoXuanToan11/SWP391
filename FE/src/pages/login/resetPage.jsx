import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";
import { useForgotPasswordMutation } from "../../services/api/beautyShopApi";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use the mutation hook from your API service
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      console.log("Đang gửi yêu cầu với email:", email);

      // Thử định dạng này thay thế
      const result = await forgotPassword(email).unwrap();
      // Hoặc thay thế: const result = await forgotPassword({ email: email }).unwrap();

      console.log("Phản hồi:", result);

      if (result.success) {
        setSuccess("Đã gửi link đặt lại mật khẩu vào email của bạn");
      } else {
        setError(result.message || "Không thể gửi email đặt lại mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi quên mật khẩu:", err);
      console.error("Chi tiết lỗi:", JSON.stringify(err, null, 2));
      setError(err.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

      {/* Centered form container */}
      <div className="w-full max-w-md px-8 py-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Quên Mật Khẩu?
          </h2>
          <p className="text-gray-600 text-base">
            Nhập email của bạn để đặt lại mật khẩu
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
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
          <p className="text-green-500 text-sm mt-4 text-center">{success}</p>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
          >
            Nhớ mật khẩu của bạn? Đăng nhập
          </Link>
        </div>
      </div>

      {/* Optional decorative background image */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <img
          src={background}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
