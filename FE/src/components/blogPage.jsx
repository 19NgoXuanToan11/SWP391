import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import person1 from "../assets/pictures/person1.jpg";
import person2 from "../assets/pictures/person2.jpg";
import person3 from "../assets/pictures/person3.jpg";
import {
  StarFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export function BlogPage() {
  const testimonials = [
    {
      name: "Cô Vân Lava",
      title: "Giám đốc Marketing Sapa Group",
      message:
        "Sản phẩm giúp tăng doanh số bằng cách tiếp cận đúng khách hàng.",
      image: person1,
      rating: 5,
    },
    {
      name: "Bà Kim Robi",
      title: "Người mẫu",
      message:
        "BeatyCare mang lại sự yên tâm với các sản phẩm chất lượng cao từ nguồn gốc uy tín.",
      image: person2,
      rating: 5,
    },
    {
      name: "Ông Hùng Nguyễn",
      title: "Giám đốc điều hành Beauty Care",
      message:
        "BeatyCare đã tăng doanh số và nhận diện thương hiệu với một đội ngũ chuyên nghiệp.",
      image: person3,
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Khách Hàng Nói Gì Về
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              BeautyCare
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Trải nghiệm và đánh giá từ khách hàng của chúng tôi
          </motion.p>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
              hover:bg-pink-50 transition-colors duration-300"
          >
            <ArrowLeftOutlined className="text-2xl text-gray-600" />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-pink-100">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {testimonials[currentIndex].name}
                        </h3>
                        <p className="text-pink-500 font-medium">
                          {testimonials[currentIndex].title}
                        </p>
                      </div>
                      <span className="text-gray-400 text-sm mt-2 md:mt-0">
                        {testimonials[currentIndex].date}
                      </span>
                    </div>
                    <blockquote className="relative">
                      <p className="relative z-10 text-gray-600 text-lg leading-relaxed">
                        {testimonials[currentIndex].message}
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg 
              hover:bg-pink-50 transition-colors duration-300"
          >
            <ArrowRightOutlined className="text-2xl text-gray-600" />
          </motion.button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-pink-500"
                  : "bg-pink-200 hover:bg-pink-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
