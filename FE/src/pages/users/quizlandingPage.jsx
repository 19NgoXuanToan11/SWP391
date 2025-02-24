import React, { useState } from "react";
import { motion } from "framer-motion";
import model from "../../assets/pictures/model.jpg";
import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  SkinOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5 animate-slide" />
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
          <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </motion.div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-white">
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

            {/* CTA Button */}
            <Link to="/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 
                  text-white rounded-full font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Bắt Đầu Ngay
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 
                  blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s infinite`,
              boxShadow: "0 0 20px rgba(236,72,153,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
