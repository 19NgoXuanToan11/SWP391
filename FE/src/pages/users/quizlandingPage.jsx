import React, { useState } from "react";
import model from "../../assets/pictures/model.jpg";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import { ArrowRightOutlined } from "@ant-design/icons";
import model from "../../assets/pictures/model.jpg";

export function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 font-orbitron">
      {/* Animated Background with Grain */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grainy opacity-20 animate-slide" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-900/80" />
      </div>

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
                className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-white"
                style={{ textShadow: "0 0 10px rgba(236, 72, 153, 0.8)" }}
              >
                Khám Phá
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-300 to-purple-300">
                Làn Da Của Bạn
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-gray-200 mb-12 text-xl leading-relaxed">
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

        {/* Model Image */}
        <motion.img
          src={model}
          alt="Skin Model"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 right-10 w-64 h-64 object-cover rounded-full shadow-xl border border-white/20"
        />
=======

export function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
      {/* Mẫu nền hoạt hình */}
      <div
        className="absolute inset-0 opacity-10 animate-slide"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 L15 0 L45 0 L60 30 L45 60 L15 60' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nội dung */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {/* Hình tròn trang trí */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl" />

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-white">
            Kiểm Tra Da
          </span>
        </h1>

        <p className="max-w-xl text-gray-200 mb-12 text-lg leading-relaxed animate-fade-in-delay">
          Vẻ đẹp thực sự tỏa sáng từ bên trong, nhưng sản phẩm chăm sóc da phù
          hợp sẽ làm nổi bật ánh sáng đó, giúp bạn tỏa ra sự tự tin và ôm trọn
          vẻ đẹp tự nhiên của mình.
        </p>

        <Link to="/quiz">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] active:scale-95">
            <span className="relative z-10">Bắt Đầu Hành Trình Của Bạn</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>

        {/* Các điểm sáng được nâng cao */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                boxShadow: "0 0 20px rgba(236,72,153,0.5)",
              }}
            />
          ))}
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}