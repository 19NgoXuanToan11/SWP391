import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rate,
  Tabs,
  Tag,
  Input,
  Button,
  Tooltip,
  Badge,
  Card,
  Image,
  Typography,
  notification,
  Spin,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  SafetyCertificateOutlined,
  SyncOutlined,
  CarOutlined,
  ShareAltOutlined,
  MinusOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  StarOutlined,
  GiftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useGetProductByIdQuery } from "../../services/api/beautyShopApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { message } from "antd";
import {
  toggleWishlist,
  selectWishlistItems,
} from "../../store/slices/wishlistSlice";
import api from "../../config/axios";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  // Lấy danh sách wishlist từ Redux store
  const wishlistItems = useSelector(selectWishlistItems);

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = wishlistItems.some(
    (item) => item.id === parseInt(productId)
  );

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedImage, setSelectedImage] = useState(0);

  // Xử lý loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Xử lý error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            Có lỗi xảy ra khi tải thông tin sản phẩm
          </div>
          <button
            onClick={() => navigate("/product")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Quay lại trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  // Xử lý khi không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">
            Không tìm thấy sản phẩm
          </div>
          <button
            onClick={() => navigate("/product")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Quay lại trang sản phẩm
          </button>
        </div>
      </div>
    );
  }

  // Cập nhật productImages array sử dụng imageUrl
  const productImages = [
    product?.imageUrl, // Sử dụng imageUrl thay vì image
    product?.imageUrl, // Có thể thêm nhiều ảnh khác nếu có
    product?.imageUrl,
    product?.imageUrl,
  ];

  const formatPrice = (price) => {
    if (!price) return "Giá không có sẵn";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.productId, // Đổi từ id sang productId
      name: product.productName, // Đổi từ name sang productName
      price: product.price,
      quantity: quantity,
      image: product.imageUrls,
      stock: product.stock,
    };

    dispatch(addToCart(cartItem));
    message.success("Đã thêm sản phẩm vào giỏ hàng");
    navigate("/cart");
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    dispatch(
      toggleWishlist({
        id: product.productId,
        name: product.productName,
        price: product.price,
        image: product.imageUrls,
        brand: product.brandName,
        description: product.description,
        stock: product.stock > 0,
        discount: product.discount,
        originalPrice: product.originalPrice,
        rating: product.rating,
      })
    );

    notification.success({
      message: "Danh sách yêu thích",
      description: `${product.productName} đã được ${
        isInWishlist ? "xóa khỏi" : "thêm vào"
      } danh sách yêu thích`,
      placement: "bottomRight",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm font-medium mb-8">
        <Link
          to="/"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <Link
          to="/product"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
        >
          Sản phẩm
        </Link>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 font-semibold">
          {product?.productName}
        </span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images Section - Cập nhật src */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                src={product?.imageUrls}
                alt={product?.productName}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Thumbnail Gallery - Cập nhật src */}
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Brand and Title */}
            <div>
              <Tag color="pink" className="mb-2">
                {product?.brandName}
              </Tag>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product?.productName}
              </h1>
              <div className="flex items-center space-x-4">
                <Rate disabled value={4.9} className="text-yellow-400" />
                <span className="text-gray-500">(4.9/5)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-pink-50 p-6 rounded-xl space-y-4">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-pink-600">
                  {formatPrice(product?.price)}
                </span>
              </div>
              <div className="flex items-center text-pink-600">
                <GiftOutlined className="mr-2" />
                <span>Ưu đãi đặc biệt khi mua trong hôm nay</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <SafetyCertificateOutlined className="text-green-500" />
                  ),
                  text: "100% Chính Hãng",
                  desc: "Sản phẩm được nhập khẩu trực tiếp",
                },
                {
                  icon: <SyncOutlined className="text-blue-500" />,
                  text: "30 Ngày Đổi Trả",
                  desc: "Đổi trả miễn phí trong 30 ngày",
                },
                {
                  icon: <CarOutlined className="text-purple-500" />,
                  text: "Miễn Phí Vận Chuyển",
                  desc: "Cho đơn hàng từ 500k",
                },
                {
                  icon: <StarOutlined className="text-yellow-500" />,
                  text: "Tích Điểm Đổi Quà",
                  desc: "Nhận xu với mỗi đơn hàng",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xl">{feature.icon}</div>
                  <div>
                    <div className="font-medium">{feature.text}</div>
                    <div className="text-sm text-gray-500">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="col-span-4 flex items-center justify-center space-x-2 bg-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-pink-700 transition duration-300"
                >
                  <ShoppingCartOutlined className="text-xl" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlistToggle}
                  className="col-span-1 flex items-center justify-center p-4 rounded-xl border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition-all"
                >
                  {isInWishlist ? (
                    <HeartFilled className="text-2xl text-pink-500" />
                  ) : (
                    <HeartOutlined className="text-2xl text-gray-500 hover:text-pink-500" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="custom-tabs"
            type="card"
            size="large"
            animated
          >
            <TabPane
              tab={
                <span className="flex items-center gap-2 px-6 py-3 font-medium text-pink-600">
                  <InfoCircleOutlined className="text-lg" />
                  Chi tiết sản phẩm
                </span>
              }
              key="1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white rounded-xl shadow-sm">
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                      Thông Số Sản Phẩm
                    </h3>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Thương hiệu", value: product?.brandName },
                        { label: "Thể tích", value: product?.volumeName },
                        { label: "Loại da", value: product?.skinTypeName },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center py-3 border-b border-gray-100 hover:bg-white/50 rounded-lg px-4 transition-all duration-300"
                        >
                          <span className="w-1/3 text-gray-600 font-medium">
                            {item.label}
                          </span>
                          <span className="w-2/3 font-semibold text-gray-800">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                      Mô Tả Sản Phẩm
                    </h3>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                      {product?.description}
                    </p>

                    <div className="mt-8 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">
                        Thành phần nổi bật
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product?.mainIngredients
                          ?.split(",")
                          .map((ingredient, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm"
                            >
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                              <span className="text-gray-700">
                                {ingredient.trim()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            {/* <TabPane
              tab={
                <span className="flex items-center gap-2 px-6 py-3 font-medium text-pink-600">
                  <StarOutlined className="text-lg" />
                  Đánh giá sản phẩm
                </span>
              }
              key="2"
            >
              <div className="p-8 bg-white rounded-xl shadow-sm min-h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <StarOutlined className="text-5xl text-gray-300" />
                  <p className="text-gray-500 text-lg">
                    Chưa có đánh giá nào cho sản phẩm này
                  </p>
                </div>
              </div>
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
