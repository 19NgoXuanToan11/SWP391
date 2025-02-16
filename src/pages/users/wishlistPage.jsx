import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Tag,
  Empty,
  Image,
  Space,
  Divider,
  theme,
  notification,
} from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const WishlistPage = () => {
  const { token } = theme.useToken();

  const colors = {
    primary: "#ff4d6d", // Hồng đậm
    secondary: "#ff8fa3", // Hồng nhạt
    accent: "#ff9a76", // Da cam
    dark: "#1a1a1a", // Đen
    light: "#ffffff", // Trắng
    red: "#ff0a54", // Đỏ
  };

  const customStyles = {
    pageContainer: {
      padding: "32px",
      maxWidth: 1200,
      margin: "0 auto",
      backgroundColor: "#fafafa",
      minHeight: "100vh",
    },
    headerSection: {
      marginBottom: 32,
      position: "relative",
      padding: "24px",
      background: colors.light,
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      marginBottom: 8,
      color: colors.dark,
      fontSize: 28,
    },
    heartIcon: {
      color: colors.primary,
      marginRight: 12,
      fontSize: 28,
    },
    productCard: {
      height: "100%",
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      border: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      },
    },
    imageContainer: {
      position: "relative",
      paddingTop: "100%",
      overflow: "hidden",
    },
    productImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    discountTag: {
      position: "absolute",
      top: 12,
      left: 12,
      padding: "6px 12px",
      borderRadius: 8,
      fontSize: "14px",
      fontWeight: 600,
      background: colors.red,
      border: "none",
    },
    brandText: {
      fontSize: 13,
      color: colors.dark,
      opacity: 0.6,
      fontWeight: 500,
    },
    productName: {
      fontSize: 16,
      fontWeight: 600,
      margin: "8px 0",
      color: colors.dark,
      lineHeight: 1.4,
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
    },
    currentPrice: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.primary,
    },
    originalPrice: {
      fontSize: 14,
      color: colors.dark,
      opacity: 0.5,
      textDecoration: "line-through",
    },
    actionButton: {
      borderRadius: 8,
      height: 40,
      padding: "0 16px",
      fontWeight: 500,
      transition: "all 0.3s ease",
    },
    cartButton: {
      background: colors.primary,
      borderColor: colors.primary,
      "&:hover": {
        background: colors.red,
        borderColor: colors.red,
      },
      "&:disabled": {
        background: "#f5f5f5",
        borderColor: "#d9d9d9",
      },
    },
    deleteButton: {
      color: colors.primary,
      "&:hover": {
        color: colors.red,
        background: "rgba(255,77,109,0.1)",
      },
    },
  };

  // Mock data - thay thế bằng data thật từ API sau
  const wishlistItems = [
    {
      id: 1,
      name: "Kem Dưỡng Ẩm Chuyên Sâu",
      brand: "La Roche-Posay",
      price: 890000,
      originalPrice: 1200000,
      rating: 4.5,
      image: "https://source.unsplash.com/random/400x400/?moisturizer",
      discount: 25,
      stock: true,
      description: "Kem dưỡng ẩm chuyên sâu với công thức đột phá, phù hợp mọi loại da"
    },
    {
      id: 2,
      name: "Serum Vitamin C Sáng Da",
      brand: "The Ordinary",
      price: 750000,
      originalPrice: 850000,
      rating: 5,
      image: "https://source.unsplash.com/random/400x400/?serum",
      discount: 12,
      stock: true,
      description: "Serum vitamin C giúp làm sáng da, mờ thâm nám hiệu quả"
    },
    {
      id: 3,
      name: "Son Dưỡng Môi Collagen",
      brand: "Laneige",
      price: 450000,
      originalPrice: 500000,
      rating: 4,
      image: "https://source.unsplash.com/random/400x400/?lipbalm",
      discount: 10,
      stock: false,
      description: "Son dưỡng môi chứa collagen, giúp môi căng mọng, hồng hào"
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveFromWishlist = (id) => {
    notification.success({
      message: "Đã xóa khỏi danh sách yêu thích",
      placement: "bottomRight",
    });
  };

  const handleAddToCart = (item) => {
    if (!item.stock) return;
    notification.success({
      message: "Đã thêm vào giỏ hàng",
      description: `${item.name} đã được thêm vào giỏ hàng của bạn.`,
      placement: "bottomRight",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <HeartFilled className="text-pink-500 mr-4" />
              Danh Sách Yêu Thích
            </h1>
            <p className="text-gray-600 text-lg">
              {wishlistItems.length} sản phẩm trong danh sách yêu thích của bạn
            </p>
          </motion.div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  {/* Image Section */}
                  <div className="relative">
                    <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                        preview={false}
                      />
                    </div>
                    {item.discount > 0 && (
                      <div className="absolute top-4 left-4">
                        <Tag color="red" className="px-3 py-1 text-sm font-semibold rounded-full">
                          -{item.discount}% GIẢM
                        </Tag>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full 
                                hover:bg-red-50 transition-colors duration-300"
                    >
                      <DeleteOutlined className="text-red-500 text-lg" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm mb-2">{item.brand}</p>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>

                    <div className="mb-4">
                      <Rate disabled defaultValue={item.rating} className="text-sm" />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-2xl font-bold text-pink-600">
                          {formatPrice(item.price)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.stock}
                      className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 
                                font-semibold transition-all duration-300
                                ${
                                  item.stock
                                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                    >
                      <ShoppingCartOutlined className="text-xl" />
                      <span>{item.stock ? "Thêm vào giỏ hàng" : "Hết hàng"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg">
                    Danh sách yêu thích của bạn đang trống
                  </p>
                  <Link to="/product">
                    <button className="bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold
                                     hover:bg-pink-700 transition-colors duration-300">
                      Khám phá sản phẩm
                    </button>
                  </Link>
                </div>
              }
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
