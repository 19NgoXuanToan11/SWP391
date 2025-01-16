import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left section - Background */}
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

      {/* Right section - Form */}
      <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-50/50 to-transparent" />

        {/* Main Content Container */}
        <div className="h-full flex flex-col px-8 md:px-12 py-8 space-y-8 relative z-10">
          {/* Top Section */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 text-base">
              Join us and start your journey today
            </p>
          </div>

          {/* Middle Section - Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-pink-500 hover:text-pink-600">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-pink-500 hover:text-pink-600">
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl transition-all transform hover:translate-y-[-1px] hover:shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.99] mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: <FaGoogle />, color: "text-red-500" },
                { icon: <FaFacebook />, color: "text-blue-500" },
                { icon: <FaGithub />, color: "text-gray-700" },
              ].map((social, index) => (
                <button
                  key={index}
                  className="p-2.5 rounded-xl border border-gray-300 bg-white/50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className={`${social.color} flex justify-center`}>
                    {social.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
