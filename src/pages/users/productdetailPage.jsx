import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sử dụng URL trực tiếp từ mockAPI
      const response = await fetch(
        `https://67825c20c51d092c3dcf2e82.mockapi.io/skincare/${productId}`
      );

      // Log response để debug
      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product data:", data);

      // Kiểm tra dữ liệu trước khi set state
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data received from server");
      }

      setProduct(data);
      if (data.image) {
        setSelectedImage(data.image);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => (window.location.href = "/product")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Product not found</div>
          <button
            onClick={() => (window.location.href = "/product")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            {/* Left Column - Image Section */}
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-w-1 aspect-h-1">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-lg shadow-md"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-pink-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Product Details
                    </h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume:</span>
                        <span className="font-medium text-gray-900">
                          {product.volume}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skin Type:</span>
                        <span className="font-medium text-gray-900">
                          {product.skinType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {product.keyIngredients && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Key Ingredients
                      </h2>
                      <p className="text-gray-600">{product.keyIngredients}</p>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-8 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 transition duration-300 shadow-md"
                  >
                    Add to Cart
                  </motion.button>
                  <p className="text-sm text-gray-500 text-center">
                    Free shipping on orders over $50
                  </p>
                </div>

                {/* Additional Information */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="block text-2xl font-semibold text-gray-900">
                        <i className="fas fa-truck"></i>
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        Fast Delivery
                      </span>
                    </div>
                    <div>
                      <span className="block text-2xl font-semibold text-gray-900">
                        <i className="fas fa-undo"></i>
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        30 Days Return
                      </span>
                    </div>
                    <div>
                      <span className="block text-2xl font-semibold text-gray-900">
                        <i className="fas fa-shield-alt"></i>
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        Secure Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
