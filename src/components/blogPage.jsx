import React, { useState } from "react";
import { motion } from "framer-motion";
import person1 from "../assets/pictures/person1.jpg";
import person2 from "../assets/pictures/person2.jpg";
import person3 from "../assets/pictures/person3.jpg";

export function BlogPage() {
  const testimonials = [
    {
      name: "Ms. Vân Lava",
      title: "CMO Sapa Group",
      message:
        "Products help increase sales by reaching the right customers.",
      image: person1,
    },
    {
      name: "Mrs. Kim Robi",
      title: "Model",
      message:
        "BeatyCare brings peace of mind with high-quality products from a reputable source.",
      image: person2,
    },
    {
      name: "Mr. Hùng Nguyễn",
      title: "CEO Beauty Care",
      message:
        "BeatyCare has increased sales and brand recognition with a professional team.",
      image: person3,
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
    <section className="bg-gradient-to-br from-pink-300 to-red-100 via-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex justify-center items-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 text-gray-500 hover:text-gray-900 focus:outline-none"
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
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg p-6 max-w-md text-center"
          >
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold">
              {testimonials[currentIndex].name}
            </h2>
            <h3 className="text-sm text-gray-600">
              {testimonials[currentIndex].title}
            </h3>
            <p className="text-gray-700 mt-4">
              {testimonials[currentIndex].message}
            </p>
          </motion.div>
          <button
            onClick={handleNext}
            className="absolute right-0 text-gray-500 hover:text-gray-900 focus:outline-none"
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
      </div>
    </section>
  );
}
