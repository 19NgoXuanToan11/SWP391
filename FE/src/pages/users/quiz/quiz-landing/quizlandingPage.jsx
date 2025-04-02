import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import model from "../../../../assets/pictures/login.jpg";

export default function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden font-orbitron bg-white">
      {/* Animated Background with Grain */}
      <div className="absolute inset-0 bg-grainy opacity-10"></div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-2/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Content Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <motion.span
                className="bg-clip-text inline-block"
                style={{ textShadow: "0 0 10px rgba(236, 72, 153, 0.8)" }}
                animate={{
                  textShadow: [
                    "0 0 10px rgba(236, 72, 153, 0.5)",
                    "0 0 20px rgba(236, 72, 153, 0.8)",
                    "0 0 10px rgba(236, 72, 153, 0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Khám Phá
              </motion.span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-500 to-purple-800"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Làn
                </span>{" "}
                Da Của Bạn
              </motion.span>
            </motion.h1>

            <motion.p
              className="max-w-2xl mx-auto text-gray-400 mb-12 text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Hành trình chăm sóc da hoàn hảo bắt đầu bằng việc hiểu rõ làn da
              của bạn.
            </motion.p>

            {/* CTA Button with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <Link to="/quiz">
                <motion.button
                  whileHover={{ scale: 1.05, rotateX: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 
                    text-white rounded-full font-semibold text-lg overflow-hidden backdrop-blur-md border border-white/20 shadow-lg"
                  initial={{ boxShadow: "0 0 0 rgba(236, 72, 153, 0)" }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(236, 72, 153, 0.2)",
                      "0 0 20px rgba(236, 72, 153, 0.4)",
                      "0 0 10px rgba(236, 72, 153, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Bắt Đầu Ngay
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, Math.random() * 1.5, 0],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Add floating circles with blur effect */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className={`absolute w-32 h-32 rounded-full blur-3xl`}
            style={{
              background: `radial-gradient(circle, rgba(${Math.floor(
                Math.random() * 100 + 155
              )}, ${Math.floor(Math.random() * 50) + 150}, ${Math.floor(
                Math.random() * 100 + 155
              )}, 0.15) 0%, rgba(255,255,255,0) 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
