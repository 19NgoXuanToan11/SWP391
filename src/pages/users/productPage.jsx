import React, { useEffect } from "react";
import { motion } from "framer-motion";
import productImage1 from "../../assets/pictures/1.jpg"; // Hình ảnh sản phẩm 1
import productImage2 from "../../assets/pictures/2.jpg"; // Hình ảnh sản phẩm 2
import productImage3 from "../../assets/pictures/3.jpg"; // Hình ảnh sản phẩm 3
import { useNavigate } from "react-router-dom";

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
          <div className="col-span-1 bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold mt-6 mb-4">Thương hiệu</h2>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border rounded-lg p-2 mb-4"
            />
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Chanel
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Dior
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Cocoon
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Maybelline
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                L'Oréal
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Estee Lauder
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                MAC Cosmetics
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Clinique
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Bobbi Brown
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Lancome
              </li>
            </ul>
          </div>

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
