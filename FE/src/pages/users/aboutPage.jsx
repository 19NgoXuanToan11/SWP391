import React, { useEffect } from "react";
import { motion } from "framer-motion";
import aboutus from "../../assets/pictures/aboutus.jpg";
import aboutus_section from "../../assets/pictures/aboutus_section.jpg";
import aboutus_bottom from "../../assets/pictures/aboutus_bottom.jpg";
import { Link } from "react-router-dom";
import {
  HeartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { icon: <SafetyCertificateOutlined />, title: "Chất Lượng", description: "Sản phẩm đạt tiêu chuẩn quốc tế" },
    { icon: <HeartOutlined />, title: "Tận Tâm", description: "Chăm sóc khách hàng 24/7" },
    { icon: <ThunderboltOutlined />, title: "Hiệu Quả", description: "Kết quả thấy được sau 2 tuần" },
  ];

  const stats = [
    { number: "10K+", label: "Khách Hàng" },
    { number: "50+", label: "Chuyên Gia" },
    { number: "95%", label: "Hài Lòng" },
    { number: "24/7", label: "Hỗ Trợ" },
  ];

  return (
    <div className="bg-gradient-to-b from-rose-50 via-white to-purple-50 text-gray-900 font-orbitron">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-grainy"
      >
        <div className="absolute inset-0">
          <motion.img
            src={aboutus}
            alt="About Us Hero"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          <motion.div
            className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold text-white mb-6"
            style={{ textShadow: "0 0 20px rgba(236, 72, 153, 0.7)" }}
          >
            Về Chúng Tôi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-200 mb-8"
          >
            Khám phá câu chuyện của chúng tôi và sứ mệnh mang đến vẻ đẹp tự nhiên cho mọi người
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* About Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-16 mb-32"
        >
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ rotateY: 5 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <img
                src={aboutus_section}
                alt="About Us Section"
                className="rounded-2xl shadow-2xl border border-white/20"
              />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-6"
          >
            <h2 className="text-4xl font-bold">
              Chúng Tôi Luôn Mang Đến{" "}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
                style={{ textShadow: "0 0 15px rgba(236, 72, 153, 0.8)" }}
              >
                Trải Nghiệm Tốt Nhất
              </span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong ngành làm đẹp, chúng tôi tự hào mang đến những sản phẩm và dịch vụ chất lượng cao, được chứng nhận bởi các chuyên gia hàng đầu trong ngành.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-gray-100/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <img src={aboutus_bottom} alt="CTA Background" className="w-full h-[500px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
            <div className="max-w-3xl mx-auto text-center px-4">
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ textShadow: "0 0 20px rgba(236, 72, 153, 0.7)" }}
              >
                Bắt Đầu Hành Trình Làm Đẹp Của Bạn
              </h2>
              <p className="text-gray-200 text-lg mb-8">
                Để chúng tôi đồng hành cùng bạn trên con đường kiến tạo vẻ đẹp hoàn hảo
              </p>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white rounded-xl 
                    font-medium backdrop-blur-md border border-white/20 relative overflow-hidden"
                >
                  <span className="relative z-10">Liên Hệ Ngay</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}