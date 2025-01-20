import React, { useEffect } from "react";
import { motion } from "framer-motion";
import productImage1 from "../../assets/pictures/1.jpg"; // Hình ảnh sản phẩm 1
import productImage2 from "../../assets/pictures/2.jpg"; // Hình ảnh sản phẩm 2
import productImage3 from "../../assets/pictures/3.jpg"; // Hình ảnh sản phẩm 3
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

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
  {
    id: 4,
    name: "Sản phẩm 1",
    price: "1.500.000đ",
    image: productImage1,
    description: "Mô tả ngắn gọn về sản phẩm 1.",
  },
  {
    id: 5,
    name: "Sản phẩm 2",
    price: "1.000.000đ",
    image: productImage2,
    description: "Mô tả ngắn gọn về sản phẩm 2.",
  },
  {
    id: 6,
    name: "Sản phẩm 3",
    price: "300.000đ",
    image: productImage3,
    description: "Mô tả ngắn gọn về sản phẩm 3.",
  },
  {
    id: 7,
    name: "Sản phẩm 1",
    price: "800.000đ",
    image: productImage1,
    description: "Mô tả ngắn gọn về sản phẩm 1.",
  },
  {
    id: 8,
    name: "Sản phẩm 2",
    price: "2.000.000đ",
    image: productImage2,
    description: "Mô tả ngắn gọn về sản phẩm 2.",
  },
  {
    id: 9,
    name: "Sản phẩm 3",
    price: "900.000đ",
    image: productImage3,
    description: "Mô tả ngắn gọn về sản phẩm 3.",
  },
];

export function ProductsPage() {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Sidebar */}
          <Sidebar />

          {/* Products List */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                      {product.discount}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-pink-500 font-bold">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
