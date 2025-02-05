import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  CarOutlined,
  StarFilled,
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  MessageOutlined,
  UserOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { Tabs, Rate, Progress, Avatar, Input } from "antd";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("1");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // Mock review data
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      date: "2024-02-15",
      comment:
        "Amazing product! My skin feels so much better after using it for just a week.",
      likes: 24,
      dislikes: 2,
      verified: true,
    },
    // ... more reviews
  ];

  const ratingStats = {
    5: 70,
    4: 20,
    3: 5,
    2: 3,
    1: 2,
  };

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sử dụng URL trực tiếp từ mockAPI
      const response = await fetch(
        `https://6793c6495eae7e5c4d8fd8d4.mockapi.io/api/skincare/${productId}`
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
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            {/* Left Column - Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-w-1 aspect-h-1 mb-4">
                <img
                  src={selectedImage}
                  alt={product?.name}
                  className="w-full h-[500px] object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                />
                {product?.discount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      -{product.discount}% OFF
                    </span>
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <HeartOutlined className="text-2xl text-gray-600 hover:text-pink-500 transition-colors" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[product?.image /* add more images */].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all duration-200 
                      ${
                        selectedImage === img
                          ? "border-pink-500 shadow-md"
                          : "border-transparent"
                      }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                    {product?.category}
                  </span>
                  <span className="flex items-center text-yellow-400">
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <StarFilled />
                    <span className="text-gray-500 ml-2">(4.9/5)</span>
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product?.name}
                </h1>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-pink-600">
                    {formatPrice(product?.price)}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {product?.description}
                </p>

                {/* Product Features */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <SafetyCertificateOutlined className="text-2xl text-green-500" />
                      <span className="text-gray-600">100% Authentic</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SyncOutlined className="text-2xl text-blue-500" />
                      <span className="text-gray-600">30-Day Returns</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CarOutlined className="text-2xl text-purple-500" />
                      <span className="text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ShareAltOutlined className="text-2xl text-pink-500" />
                      <span className="text-gray-600">Share Product</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 bg-pink-600 text-white py-4 px-6 
                             rounded-xl font-semibold text-lg hover:bg-pink-700 transition duration-300 shadow-md"
                  >
                    <ShoppingCartOutlined className="text-xl" />
                    <Link to="/cart">Add to Cart</Link>
                  </motion.button>

                  <p className="text-sm text-gray-500 text-center">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Volume:</span>
                        <span className="font-medium text-gray-900">
                          {product?.volume}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Skin Type:</span>
                        <span className="font-medium text-gray-900">
                          {product?.skinType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Ingredients
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product?.keyIngredients}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  className="product-tabs"
                >
                  <TabPane tab="Description" key="1">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold mb-4">
                        Product Description
                      </h3>
                      <div className="space-y-4">
                        <p className="text-gray-600">{product?.description}</p>

                        {/* Benefits */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold mb-3">
                            Key Benefits
                          </h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Deeply hydrates and nourishes skin</li>
                            <li>Reduces appearance of fine lines</li>
                            <li>Improves skin texture and tone</li>
                            <li>Suitable for all skin types</li>
                          </ul>
                        </div>

                        {/* How to Use */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold mb-3">
                            How to Use
                          </h4>
                          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                            <li>Cleanse face thoroughly</li>
                            <li>Apply toner if desired</li>
                            <li>Apply a small amount to face and neck</li>
                            <li>Gently massage in circular motions</li>
                            <li>Use morning and evening for best results</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </TabPane>

                  <TabPane tab={`Reviews (${reviews.length})`} key="2">
                    <div className="space-y-8">
                      {/* Rating Summary */}
                      <div className="flex items-start space-x-8 p-6 bg-gray-50 rounded-xl">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900">
                            4.8
                          </div>
                          <Rate
                            disabled
                            defaultValue={4.8}
                            className="text-yellow-400"
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            Based on {reviews.length} reviews
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          {Object.entries(ratingStats)
                            .reverse()
                            .map(([rating, percentage]) => (
                              <div
                                key={rating}
                                className="flex items-center space-x-4"
                              >
                                <div className="w-24 text-sm text-gray-600">
                                  {rating} stars
                                </div>
                                <Progress
                                  percent={percentage}
                                  showInfo={false}
                                  strokeColor="#F472B6"
                                  trailColor="#E5E7EB"
                                  className="flex-1"
                                />
                                <div className="w-16 text-sm text-gray-500">
                                  {percentage}%
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Write Review */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Write a Review
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Rating
                            </label>
                            <Rate
                              value={rating}
                              onChange={setRating}
                              className="text-yellow-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Review
                            </label>
                            <TextArea
                              rows={4}
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Share your experience with this product..."
                              className="w-full border-gray-200 rounded-lg"
                            />
                          </div>
                          <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                            Submit Review
                          </button>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <Avatar src={review.avatar} size={40} />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-gray-900">
                                      {review.user}
                                    </h4>
                                    {review.verified && (
                                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                        Verified Purchase
                                      </span>
                                    )}
                                  </div>
                                  <Rate
                                    disabled
                                    defaultValue={review.rating}
                                    className="text-yellow-400 text-sm"
                                  />
                                  <div className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p className="mt-4 text-gray-600">
                              {review.comment}
                            </p>

                            <div className="mt-4 flex items-center space-x-6">
                              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                                <LikeOutlined />
                                <span>{review.likes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                                <DislikeOutlined />
                                <span>{review.dislikes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                                <MessageOutlined />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabPane>

                  <TabPane tab="Shipping & Returns" key="3">
                    <div className="prose max-w-none">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Shipping Information
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Free standard shipping on orders over $50</li>
                            <li>Standard shipping (5-7 business days)</li>
                            <li>Express shipping (2-3 business days)</li>
                            <li>International shipping available</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Return Policy
                          </h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>30-day return policy</li>
                            <li>Must be unopened and in original packaging</li>
                            <li>Free returns on all orders</li>
                            <li>Contact customer service to initiate return</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
