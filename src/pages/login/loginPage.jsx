import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import background from "../../assets/pictures/background_login.jpg";
import { useLoginMutation } from "../../services/api/beautyShopApi";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { message } from "antd";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();

  const validateForm = () => {
    let valid = true;
    let errors = {};

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      valid = false;
    }

    // Validate Password
    if (!formData.password) {
      errors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // For Registration, validate password confirmation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      const userInfo = {
        email: formData.email,
        name: formData.email.split('@')[0], // Hoặc thông tin khác từ API
        id: Date.now(), // Hoặc ID từ API
      };

      dispatch(setCredentials({
        user: userInfo,
        token: response.token
      }));

      message.success({
        content: "Đăng nhập thành công!",
        duration: 2,
      });

      const from = location.state?.from || "/";
      navigate(from);
      
    } catch (error) {
      console.error('Login failed:', error);
      message.error({
        content: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
        duration: 2,
      });
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const handleLoginByGoogle = () => {
    console.log("handleLoginByGoogle");

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const token = result.user.accessToken;
        const user = result.user;

        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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
          {/* Form Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h2>
              <p className="mt-1 text-gray-600">
                {isLogin
                  ? "Sign in to continue your journey"
                  : "Sign up to start your journey"}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
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

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/reset">
                  <button className="text-sm text-pink-500 hover:text-pink-600">
                    Forgot password?
                  </button>
                </Link>
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
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Sign up"
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
                <button
                  onClick={handleLoginByGoogle}
                  className="py-4 px-20 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="text-red-500 flex justify-center">
                    <FaGoogle />
                  </div>
                </button>
              </div>
            </div>
            {/* Sign Up Link */}
            {isLogin && (
              <div className="text-center mt-4">
                <Link
                  to="/register"
                  className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
