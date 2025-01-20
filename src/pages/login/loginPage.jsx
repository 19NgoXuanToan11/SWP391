import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fakeAuthAPI(formData.email, formData.password);
      if (response.success) {
        navigate("/");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Đã xảy ra lỗi trong quá trình xác thực.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={background}
          alt="Decorative Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right section */}
      <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-gray-50 to-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

        {/* Main Content Container */}
        <div className="h-full flex flex-col px-8 md:px-12 py-6">
          {/* Form Section - Điều chỉnh justify-center và spacing */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Header - Chuyển vào trong form section */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-1 text-gray-600">
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span>Remember me</span>
                </label>
                <button className="text-sm text-pink-500 hover:text-pink-600">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl transition-all transform hover:translate-y-[-1px] hover:shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button className="py-4 px-20 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all">
                  <div className="text-red-500 flex justify-center">
                    <FaGoogle />
                  </div>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/register")}
                className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
