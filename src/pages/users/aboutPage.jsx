import React, { useEffect } from "react";
import { motion } from "framer-motion";
import aboutus from "../../assets/pictures/aboutus.jpg";
import aboutus_section from "../../assets/pictures/aboutus_section.jpg";
import aboutus_bottom from "../../assets/pictures/aboutus_bottom.jpg";
import { Link } from "react-router-dom";

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi load
  }, []);

  return (
    <div className="bg-white text-black font-sans">
      {/* Header Section */}
      <header
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${aboutus})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.h1
          className="relative z-10 text-5xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h1>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* About Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-24" // Increased space between image and content
        >
          <img
            src={aboutus_section}
            alt="About Us Section"
            className="w-1/2 rounded-lg shadow-lg"
          />
          <div className="text-right w-1/2 transition-transform transform hover:scale-105 ">
            <h2 className="text-4xl font-semibold mb-4 transition-colors duration-300 hover:text-pink-500">
              We Always Make{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                The Best
              </span>
            </h2>
            <p className="text-lg text-gray-500 mb-6 transition-opacity duration-300 hover:opacity-80">
              Chăm sóc da là một phần quan trọng trong việc duy trì vẻ đẹp và
              sức khỏe của làn da. Sản phẩm của chúng tôi được chiết xuất từ
              thiên nhiên, giúp cung cấp độ ẩm, làm sáng và cải thiện kết cấu
              da. Hãy để làn da bạn tỏa sáng với những sản phẩm chất lượng nhất.
            </p>
            <Link to="/contact">
              <button className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-transparent hover:text-black hover:border-2 hover:border-pink-300 transition duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative bg-cover bg-center h-96 flex items-center justify-center"
          style={{ backgroundImage: `url(${aboutus_bottom})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative z-10 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="mb-6">
              We are dedicated to providing high-quality skincare products that
              enhance your natural beauty.
            </p>
            <button className="bg-red-300 text-black font-semibold py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 hover:opacity-40">
              Get Started
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
