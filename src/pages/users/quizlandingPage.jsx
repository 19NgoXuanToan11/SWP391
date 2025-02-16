import React, { useState } from "react";
import model from "../../assets/pictures/model.jpg";
import { Link } from "react-router-dom";

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
      </div>
    </div>
  );
}
