import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import person1 from "../assets/pictures/person1.jpg";
import person2 from "../assets/pictures/person2.jpg";
import person3 from "../assets/pictures/person3.jpg";
import {
  StarFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";

export function BlogPage() {
  const testimonials = [
    {
      name: "Cô Vân Lava",
      title: "Giám đốc Marketing Sapa Group",
      message:
        "Sản phẩm giúp tăng doanh số bằng cách tiếp cận đúng khách hàng. Tôi đã sử dụng các sản phẩm của BeautyCare trong hơn 2 năm và luôn hài lòng với kết quả nhận được.",
      image: person1,
      rating: 5,
      date: "15/05/2023",
    },
    {
      name: "Bà Kim Robi",
      title: "Người mẫu",
      message:
        "BeautyCare mang lại sự yên tâm với các sản phẩm chất lượng cao từ nguồn gốc uy tín. Làn da của tôi đã cải thiện đáng kể sau khi sử dụng bộ sản phẩm dưỡng da của họ.",
      image: person2,
      rating: 5,
      date: "22/07/2023",
    },
    {
      name: "Ông Hùng Nguyễn",
      title: "Giám đốc điều hành Beauty Care",
      message:
        "BeautyCare đã tăng doanh số và nhận diện thương hiệu với một đội ngũ chuyên nghiệp. Chúng tôi tự hào về chất lượng sản phẩm và dịch vụ khách hàng mà chúng tôi cung cấp.",
      image: person3,
      rating: 5,
      date: "10/09/2023",
    },
  ];

  // Tạo mảng testimonials lặp lại để tạo hiệu ứng vô hạn
  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardWidth = 600; // Chiều rộng của mỗi card
  const gap = 40; // Khoảng cách giữa các card
  const totalWidth = testimonials.length * (cardWidth + gap);

  // Hiệu ứng tự động lướt từ phải qua trái
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setPosition((prev) => {
          // Khi đã lướt qua hết tất cả testimonials, reset về vị trí ban đầu
          if (Math.abs(prev) >= totalWidth) {
            return 0;
          }
          return prev - 1; // Di chuyển từ phải qua trái 1px mỗi lần
        });
      }, 20); // Tốc độ lướt, càng nhỏ càng nhanh

      return () => clearInterval(interval);
    }
  }, [isPaused, totalWidth]);

  // Tạm dừng khi hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Thêm các hình trang trí */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-lg opacity-20"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
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
            className="text-gray-600 text-lg max-w-3xl mx-auto"
          >
            Khám phá trải nghiệm thực tế và đánh giá chân thực từ những khách
            hàng đã sử dụng sản phẩm và dịch vụ của chúng tôi
          </motion.p>
        </div>

        <div className="relative">
          {/* Gradient Overlay Left */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-pink-50 to-transparent z-10" />

          {/* Slider Container */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex transition-transform duration-1000 ease-linear"
              style={{ transform: `translateX(${position}px)` }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={`testimonial-${index}`}
                  className="flex-none w-[600px] mx-5"
                >
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-pink-50 h-full">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-pink-100 shadow-lg">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {testimonial.name}
                            </h3>
                            <p className="text-pink-500 font-medium text-sm">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>

                        <blockquote className="relative">
                          <div className="absolute -left-6 top-0 text-5xl text-pink-200 opacity-50 font-serif">
                            "
                          </div>
                          <p className="relative z-10 text-gray-600 text-base leading-relaxed italic line-clamp-4">
                            {testimonial.message}
                          </p>
                          <div className="absolute -right-2 bottom-0 text-5xl text-pink-200 opacity-50 font-serif">
                            "
                          </div>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlay Right */}
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-pink-50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
