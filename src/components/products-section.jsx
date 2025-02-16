import { useState } from "react";
import { motion } from "framer-motion";
import ritualCollection from "../assets/pictures/ritual_collection.jpg";
import recoveryCollection from "../assets/pictures/recovery_collection.jpg";
import { Link } from "react-router-dom";

export function ProductsSection() {
  const [activeTab, setActiveTab] = useState("skincare");

  return (
    <section className="relative min-h-screen">
      {/* Trang trí nền */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      {/* Nội dung chính */}
      <div className="relative max-w-7xl mx-auto px-4 py-24">
        {/* Tiêu đề phần */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Khám Phá{" "}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Vẻ Đẹp
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Khám phá bộ sưu tập sản phẩm làm đẹp cao cấp được thiết kế để nâng
            cao vẻ rạng rỡ tự nhiên của bạn
          </motion.p>
        </div>
        {/* Bộ sưu tập nổi bật */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-purple-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={ritualCollection}
              alt="Nghi thức chăm sóc da"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                Bộ Sưu Tập Nghi Thức Buổi Sáng
              </h3>
              <p className="text-white/90 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                Bắt đầu ngày mới với quy trình chăm sóc da buổi sáng được chọn
                lọc kỹ lưỡng của chúng tôi
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={recoveryCollection}
              alt="Quy trình ban đêm"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                Bộ Sưu Tập Phục Hồi Ban Đêm
              </h3>
              <p className="text-white/90 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                Rejuvenate your skin while you sleep with our night care
                essentials
              </p>
            </div>
          </motion.div>
        </div>

        {/* Beauty Tips Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "✨",
                title: "Lịch Trình Cá Nhân Hóa",
                description:
                  "Nhận một lịch trình chăm sóc da được tùy chỉnh dựa trên loại da và mối quan tâm của bạn",
              },
              {
                icon: "🌿",
                title: "Nguyên Liệu Tự Nhiên",
                description:
                  "Sản phẩm làm đẹp sạch được làm từ các nguyên liệu tự nhiên được chọn lọc kỹ lưỡng",
              },
              {
                icon: "🔬",
                title: "Được Kiểm Nghiệm Bởi Bác Sĩ Da Liễu",
                description:
                  "Tất cả sản phẩm đều được kiểm tra và phê duyệt bởi các bác sĩ da liễu có chứng nhận",
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Phần CTA */}
        <Link to="/product">
          <div className="mt-20 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-shadow duration-300"
            >
              Khám phá tất cả bộ sưu tập
            </motion.button>
          </div>
        </Link>
      </div>
    </section>
  );
}
