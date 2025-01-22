import React, { useEffect } from "react";
import { motion } from "framer-motion";
import productImage1 from "../../assets/pictures/1.jpg";
import productImage2 from "../../assets/pictures/2.jpg";
import productImage3 from "../../assets/pictures/3.jpg";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

const products = [
  {
    id: 1,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage1,
  },
  {
    id: 2,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage2,
  },
  {
    id: 3,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage3,
  },
  {
    id: 4,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage1,
  },
  {
    id: 5,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage2,
  },
  {
    id: 6,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage3,
  },
  {
    id: 7,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage1,
  },
  {
    id: 8,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage2,
  },
  {
    id: 9,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage3,
  },
  {
    id: 10,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage1,
  },
  {
    id: 11,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage2,
  },
  {
    id: 12,
    name: "Retinol Cream",
    price: "1.090.000đ",
    originalPrice: "1.290.000đ",
    discount: "-15%",
    image: productImage3,
  },
];

export function ProductsPage() {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  const handleBuyNowClick = (productId) => {
    if (productId) navigate(`/checkout/${productId}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Products List */}
          <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    className="w-full h-48 object-cover"
                    onClick={() => handleProductClick(product.id)}
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
                  <button
                    className="mt-4 w-full bg-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300"
                    onClick={() => handleBuyNowClick(product.id)}
                  >
                    Mua Ngay
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
