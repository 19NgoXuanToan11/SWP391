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
  InputNumber,
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
import { useGetProductByIdQuery } from "../../../../services/api/beautyShopApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../store/slices/cart/cartSlice";
import { message } from "antd";
import {
  toggleWishlist,
  selectWishlistItems,
} from "../../../../store/slices/wishlist/wishlistSlice";
import api from "../../../../config/axios/axios";

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
      id: product.productId,
      name: product.productName,
      price: product.price,
      quantity: quantity,
      image: product.imageUrls,
      stock: product.stock,
    };

    dispatch(addToCart(cartItem));

    // Hiển thị thông báo thành công với nút "Xem giỏ hàng"
    notification.success({
      message: "Thêm vào giỏ hàng thành công",
      description: (
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={product.imageUrls}
              alt={product.productName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{product.productName}</p>
              <p className="text-gray-500">Số lượng: {quantity}</p>
            </div>
          </div>
          <button
            type="link"
            onClick={() => navigate("/cart")}
            className="self-end p-0 text-pink-600 hover:text-pink-700"
          >
            Xem giỏ hàng
          </button>
        </div>
      ),
      placement: "bottomRight",
      duration: 3,
      className: "custom-notification-success",
      style: {
        borderRadius: "16px",
      },
    });

    // Chuyển về trang sản phẩm
    navigate("/product");
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50 px-6 py-5 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center space-x-3 text-sm font-medium">
              <Link
                to="/"
                className="text-gray-500 hover:text-pink-600 transition-colors duration-300 flex items-center"
              >
                <span>Trang chủ</span>
              </Link>
              <span className="text-gray-300 transform rotate-12">|</span>
              <Link
                to="/product"
                className="text-gray-500 hover:text-pink-600 transition-colors duration-300 flex items-center"
              >
                <span>Sản phẩm</span>
              </Link>
              <span className="text-gray-300 transform rotate-12">|</span>
              <span className="text-pink-600 truncate max-w-xs">
                {product?.productName}
              </span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Product Image */}
            <div className="relative aspect-square">
              <img
                src={product?.imageUrls}
                alt={product?.productName}
                className="w-full h-full object-cover"
              />
              {product?.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  -{product.discount}% giảm
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex-1 space-y-6">
                {/* Brand & Title */}
                <div>
                  <Tag className="mb-3 px-3 py-1 border-pink-200 text-pink-500 bg-pink-50 rounded-full">
                    {product?.brandName}
                  </Tag>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {product?.productName}
                  </h1>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-pink-600">
                    {formatPrice(product?.price)}
                  </span>
                  {product?.discount > 0 && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                  <div>
                    <Text className="text-gray-500 block mb-1">Thể tích</Text>
                    <Text className="text-lg font-medium">
                      {product?.volumeName}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-gray-500 block mb-1">
                      Loại da phù hợp
                    </Text>
                    <Text className="text-lg font-medium">
                      {product?.skinTypeName}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-gray-500 block mb-1">
                      Tình trạng kho
                    </Text>
                    {product.stock <= 0 ? (
                      <Text className="text-lg font-medium text-red-500">
                        Hết hàng
                      </Text>
                    ) : product.stock <= 5 ? (
                      <Text className="text-lg font-medium text-orange-500">
                        Sắp hết hàng ({product.stock} sản phẩm)
                      </Text>
                    ) : (
                      <Text className="text-lg font-medium text-green-500">
                        Còn hàng ({product.stock} sản phẩm)
                      </Text>
                    )}
                  </div>
                  <div>
                    <Text className="text-gray-500 block mb-1">
                      Thành phần chính
                    </Text>
                    <div className="flex flex-wrap gap-1">
                      {product?.mainIngredients
                        ?.split(",")
                        .slice(0, 2)
                        .map((ingredient, index) => (
                          <Tag
                            key={index}
                            className="m-0 px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-100 rounded-full"
                          >
                            {ingredient.trim()}
                          </Tag>
                        ))}
                      {product?.mainIngredients?.split(",").length > 2 && (
                        <Tag className="m-0 px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-100 rounded-full">
                          +{product?.mainIngredients?.split(",").length - 2}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Text className="text-black font-bold block mb-2">
                    Mô tả sản phẩm
                  </Text>
                  <Text className="text-gray-600 leading-relaxed">
                    {product?.description}
                  </Text>
                </div>

                {/* Bottom Actions */}
                <div className="pt-8 mt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Text className="text-gray-600">Số lượng:</Text>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-l-lg border border-r-0 border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        disabled={product.stock <= 0}
                      >
                        <MinusOutlined className="text-gray-500" />
                      </button>
                      <InputNumber
                        min={1}
                        max={product.stock || 1}
                        value={quantity}
                        onChange={(value) =>
                          setQuantity(
                            value
                              ? Math.min(
                                  Math.floor(Math.abs(value)),
                                  product.stock || 1
                                )
                              : 1
                          )
                        }
                        className="w-16 h-10 border-y border-gray-200 text-center focus:outline-none"
                        controls={false}
                        keyboard={false}
                        disabled={product.stock <= 0}
                      />
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(quantity + 1, product.stock || 1)
                          )
                        }
                        className="w-10 h-10 rounded-r-lg border border-l-0 border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        disabled={
                          quantity >= product.stock || product.stock <= 0
                        }
                      >
                        <PlusOutlined className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="col-span-4 h-14 w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200"
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCartOutlined className="text-xl" />
                      {product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3 border border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors"
                      onClick={handleWishlistToggle}
                    >
                      {isInWishlist ? (
                        <HeartFilled className="text-lg text-pink-500" />
                      ) : (
                        <HeartOutlined className="text-lg" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
