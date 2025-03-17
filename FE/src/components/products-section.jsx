import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ritualCollection from "../assets/pictures/ritual_collection.jpg";
import recoveryCollection from "../assets/pictures/recovery_collection.jpg";
import {
  StarFilled,
  ArrowRightOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

export function ProductsSection() {
  const [hoveredCollection, setHoveredCollection] = useState(null);

  const collections = [
    {
      id: 1,
      image: ritualCollection,
    },
    {
      id: 2,
      image: recoveryCollection,
    },
  ];

  const features = [
    {
      icon: <SafetyCertificateOutlined className="text-2xl" />,
      title: "Chăm Sóc Da Đặc Biệt",
      description:
        "Tìm ra một kế hoạch chăm sóc da độc quyền phù hợp với từng loại da.  ",
    },
    {
      icon: <ExperimentOutlined className="text-2xl" />,
      title: "Thành Phần Tự Nhiên",
      description:
        "Sản phẩm làm đẹp được chiết xuất từ thiên nhiên, an toàn và hiệu quả cho làn da của bạn.",
    },
    {
      icon: <ThunderboltOutlined className="text-2xl" />,
      title: "Chất Lượng Đảm Bảo",
      description:
        "Tất cả sản phẩm đều được kiểm tra chất lượng kỹ lưỡng bởi đội ngũ chuyên gia da liễu hàng đầu.",
    },
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Khám Phá{" "}
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Vẻ Đẹp Tự Nhiên
            </span>
          </motion.h1>
          <p className="text-lg text-gray-600 mt-4">
            Khám phá các sản phẩm chăm sóc da tự nhiên, an toàn và hiệu quả cho
            làn da của bạn.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
              onMouseEnter={() => setHoveredCollection(collection.id)}
              onMouseLeave={() => setHoveredCollection(null)}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${collection.gradient} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div
                  className="inline-block p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 
                  group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-colors duration-300 mb-4"
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Link to="/product">
          <div className="mt-20 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl 
                font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 
                transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Khám phá tất cả bộ sưu tập
              <ArrowRightOutlined />
            </motion.button>
          </div>
        </Link>
      </div>
    </section>
  );
}
