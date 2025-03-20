import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { HeroSection } from "../../components/hero-section";
import { ProductSlider } from "../../components/product-slider";
import { ProductsSection } from "../../components/products-section";
import { SkinTypes } from "../../components/skin-types";
import { NewsPage } from "../../components/newsPage";
import { BeautyMythbusters } from "../../components/beauty-mythbusters";

// Các biến thể animation cho các thành phần khác nhau
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function HomePage() {
  useEffect(() => {
    // Đảm bảo trang luôn bắt đầu từ trên cùng khi load
    window.scrollTo(0, 0);

    // Thêm class để ngăn chặn thanh cuộn dọc thứ hai
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      // Khôi phục khi component unmount
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="overflow-hidden w-full">
      {/* HeroSection không cần animation vì nó đã hiển thị ngay từ đầu */}
      <HeroSection />

      {/* Các section khác sẽ có animation khi scroll */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeInUp}
        className="w-full"
      >
        <ProductSlider />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeInLeft}
        className="w-full"
      >
        <SkinTypes />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeInRight}
        className="w-full"
      >
        <BeautyMythbusters />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={scaleIn}
        className="w-full"
      >
        <ProductsSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={fadeInUp}
        className="w-full"
      >
        <NewsPage />
      </motion.div>
    </div>
  );
}
