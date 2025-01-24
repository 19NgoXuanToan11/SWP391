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
    setError(""); // Clear error when the user types
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return "Email is required.";
    } else if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
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

    // Simulate password reset process
    setTimeout(() => {
      setLoading(false);
      setSuccess("A password reset link has been sent to your email.");
    }, 1500);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left section - Background */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
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
              Forgot Password?
            </h2>
            <p className="text-gray-600 text-base">
              Enter your email to reset your password
            </p>
          </div>

          {/* Middle Section - Form */}
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
                  "Send Reset Link"
                )}
              </button>
            </form>

            {success && (
              <p className="text-green-500 text-sm mt-4">{success}</p>
            )}
          </div>

          {/* Bottom Section */}
          <Link to="/login">
            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Remember your password? Sign in
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
