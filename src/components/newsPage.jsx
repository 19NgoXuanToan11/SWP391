import React, { useState } from "react";
import { motion } from "framer-motion";
import blog1 from "../assets/pictures/blog1.jpg";
import blog2 from "../assets/pictures/blog2.jpg";
import blog3 from "../assets/pictures/blog3.jpg";
import blog4 from "../assets/pictures/blog4.jpg";
import blog5 from "../assets/pictures/blog5.jpg";

export function NewsPage() {
  const articles = [
    {
      title: "Chăm Sóc Tóc Của Bạn",
      date: "Thứ Năm, 14/07/2022",
      description:
        "Cũng giống như da cần kem chống nắng trước khi ra ngoài, tóc cũng cần được bảo vệ để tránh hư tổn.",
      image: blog1,
    },
    {
      title: "Bổ Sung Tinh Chất Sâu",
      date: "Thứ Năm, 14/07/2022",
      description:
        "Khi tóc bạn hoàn toàn khô, đừng vò tóc một cách thô bạo bằng tay (hoặc lực) để tránh rối.",
      image: blog2,
    },
    {
      title: "Để Tóc Khô Tự Nhiên",
      date: "Thứ Năm, 14/07/2022",
      description:
        "Sấy tóc là lựa chọn hàng đầu của nhiều phụ nữ để thoát khỏi sự ẩm ướt khó chịu, nhưng điều đó không tốt cho tóc của bạn.",
      image: blog3,
    },
    {
      title: "Cung Cấp Dinh Dưỡng Bổ Sung Cho Tóc",
      date: "Thứ Năm, 14/07/2022",
      description:
        "Hầu hết mọi người dừng lại ở bước dùng dầu xả, nghĩ rằng điều này là đủ để có tóc mềm mại và mượt mà.",
      image: blog4,
    },
    {
      title: "Sử Dụng Dầu Xả Dưỡng Ẩm Cho Tóc",
      date: "Thứ Năm, 14/07/2022",
      description:
        "Sau khi gội sạch tóc, đã đến lúc sử dụng dầu xả. Dầu xả cung cấp độ ẩm để giữ cho tóc mềm mại và khỏe mạnh.",
      image: blog5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? articles.length - 3 : prevIndex - 3
    );
  };

  const visibleArticles = articles.slice(currentIndex, currentIndex + 3);

  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-pink-100 to-red-100 via-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          Góc Làm Đẹp - Sự Kiện
        </h1>
        <div className="relative flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex space-x-4">
            {visibleArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {article.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-block bg-pink-600 text-white hover:bg-red-200 transition duration-300 ease-in-out text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Xem Tất Cả
          </a>
        </div>
      </div>
    </section>
  );
}
