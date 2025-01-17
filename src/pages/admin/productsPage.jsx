import React, { useEffect } from "react";
import { motion } from "framer-motion";
import productImage1 from "../../assets/pictures/1.jpg"; // Hình ảnh sản phẩm 1
import productImage2 from "../../assets/pictures/2.jpg"; // Hình ảnh sản phẩm 2
import productImage3 from "../../assets/pictures/3.jpg"; // Hình ảnh sản phẩm 3

const products = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "1.000.000đ",
    image: productImage1,
    description: "Mô tả ngắn gọn về sản phẩm 1.",
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: "1.200.000đ",
    image: productImage2,
    description: "Mô tả ngắn gọn về sản phẩm 2.",
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: "900.000đ",
    image: productImage3,
    description: "Mô tả ngắn gọn về sản phẩm 3.",
  },
];

export function ProductsPage() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <span className="text-lg font-bold text-pink-500">
                  {product.price}
                </span>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-300">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
