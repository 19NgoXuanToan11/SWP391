import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import model from "../../assets/pictures/login.jpg";

export function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden font-orbitron">
      {/* Animated Background with Grain */}
      <div className="absolute inset-0"></div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Decorative Elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </motion.div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight">
              <span
                className="bg-clip-text"
                style={{ textShadow: "0 0 10px rgba(236, 72, 153, 0.8)" }}
              >
                Khám Phá
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-500 to-purple-300">
                Làn Da Của Bạn
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-gray-400 mb-12 text-xl leading-relaxed">
              Hành trình chăm sóc da hoàn hảo bắt đầu bằng việc hiểu rõ làn da
              của bạn.
            </p>

            {/* CTA Button with Glassmorphism */}
            <Link to="/quiz">
              <motion.button
                whileHover={{ scale: 1.05, rotateX: 10 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500/80 to-purple-500/80 
                  text-white rounded-full font-semibold text-lg overflow-hidden backdrop-blur-md border border-white/20 shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Bắt Đầu Ngay
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: Math.random() * 1.5 }}
            transition={{ delay: i * 0.1 }}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 5}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
