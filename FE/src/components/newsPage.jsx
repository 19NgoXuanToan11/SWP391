import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import blog1 from "../assets/pictures/blog1.jpg";
import blog2 from "../assets/pictures/blog2.jpg";
import blog3 from "../assets/pictures/blog3.jpg";
import blog4 from "../assets/pictures/blog4.jpg";
import blog5 from "../assets/pictures/blog5.jpg";

export function NewsPage() {
  const articles = [
    {
      title: "Chăm Sóc Tóc Của Bạn",
      date: "14/07/2022",
      description:
        "Cũng giống như da cần kem chống nắng trước khi ra ngoài, tóc cũng cần được bảo vệ để tránh hư tổn.",
      image: blog1,
      category: "Chăm sóc tóc",
      readTime: "5 phút đọc",
      views: 1234,
    },
    {
      title: "Bổ Sung Tinh Chất Sâu",
      date: "14/07/2022",
      description:
        "Khi tóc bạn hoàn toàn khô, đừng vò tóc một cách thô bạo bằng tay (hoặc lực) để tránh rối.",
      image: blog2,
      category: "Dưỡng da",
      readTime: "4 phút đọc",
      views: 2345,
    },
    {
      title: "Để Tóc Khô Tự Nhiên",
      date: "14/07/2022",
      description:
        "Sấy tóc là lựa chọn hàng đầu của nhiều phụ nữ để thoát khỏi sự ẩm ướt khó chịu, nhưng điều đó không tốt cho tóc của bạn.",
      image: blog3,
      category: "Chăm sóc tóc",
      readTime: "3 phút đọc",
      views: 3456,
    },
    {
      title: "Cung Cấp Dinh Dưỡng Bổ Sung Cho Tóc",
      date: "14/07/2022",
      description:
        "Hầu hết mọi người dừng lại ở bước dùng dầu xả, nghĩ rằng điều này là đủ để có tóc mềm mại và mượt mà.",
      image: blog4,
      category: "Dinh dưỡng",
      readTime: "6 phút đọc",
      views: 4567,
    },
    {
      title: "Sử Dụng Dầu Xả Dưỡng Ẩm Cho Tóc",
      date: "14/07/2022",
      description:
        "Sau khi gội sạch tóc, đã đến lúc sử dụng dầu xả. Dầu xả cung cấp độ ẩm để giữ cho tóc mềm mại và khỏe mạnh.",
      image: blog5,
      category: "Chăm sóc tóc",
      readTime: "4 phút đọc",
      views: 5678,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? articles.length - 3 : prevIndex - 3
    );
  };

  const handleArticleClick = (index) => {
    navigate(`/news/${index + 1}`);
  };

  const visibleArticles = articles.slice(currentIndex, currentIndex + 3);

  return (
    <section className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            Góc Làm Đẹp
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              & Sự Kiện
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá những bí quyết làm đẹp mới nhất
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {visibleArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer h-full"
                onClick={() => handleArticleClick(index)}
              >
                <div
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 
                  transform hover:-translate-y-2 h-full flex flex-col"
                >
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-[240px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-pink-500">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <span>{article.date}</span>
                      </div>
                    </div>

                    <h2
                      className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-pink-500 
                      transition-colors duration-300"
                    >
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <button className="flex items-center gap-2 text-pink-500 font-medium group-hover:gap-4 transition-all duration-300">
                        Đọc thêm
                        <ArrowRightOutlined className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: Math.ceil(articles.length / 3) }).map(
            (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * 3)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === idx
                    ? "w-8 bg-pink-500"
                    : "bg-pink-200 hover:bg-pink-300"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
