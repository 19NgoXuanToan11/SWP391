import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import model from "../../assets/pictures/model.jpg";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <h1 className="text-6xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Liên Hệ Với Chúng Tôi
            </span>
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm
            nhất.
          </p>
        </motion.div>

        {/* Main Contact Section with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl overflow-hidden 
            border border-gray-200/50 relative"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section with Overlay */}
            <div className="w-full md:w-1/2 relative overflow-hidden">
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 mix-blend-multiply" />
                <img
                  src={model}
                  alt="Contact Us"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Form Section with Enhanced Interactions */}
            <div className="w-full md:w-1/2 p-12">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircleOutlined className="text-3xl text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Cảm ơn bạn!
                    </h3>
                    <p className="text-gray-600">
                      Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className={`w-full px-5 py-4 bg-gray-50 rounded-xl border transition-all duration-300
                            ${
                              focusedField === "name"
                                ? "border-pink-500 ring-2 ring-pink-500/20"
                                : "border-gray-200"
                            }`}
                          placeholder="Nhập họ tên của bạn"
                        />
                        <UserOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className={`w-full px-5 py-4 bg-gray-50 rounded-xl border transition-all duration-300
                            ${
                              focusedField === "email"
                                ? "border-pink-500 ring-2 ring-pink-500/20"
                                : "border-gray-200"
                            }`}
                          placeholder="example@domain.com"
                        />
                        <MailOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Tin nhắn
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          required
                          rows="4"
                          className={`w-full px-5 py-4 bg-gray-50 rounded-xl border transition-all duration-300
                            ${
                              focusedField === "message"
                                ? "border-pink-500 ring-2 ring-pink-500/20"
                                : "border-gray-200"
                            }`}
                          placeholder="Nhập tin nhắn của bạn..."
                        />
                        <MessageOutlined className="absolute right-4 top-6 text-gray-400" />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl
                        font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300
                        flex items-center justify-center gap-2"
                    >
                      <span>Gửi tin nhắn</span>
                      <SendOutlined />
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
