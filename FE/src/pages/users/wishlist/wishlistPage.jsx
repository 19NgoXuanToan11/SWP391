import React from "react";
import { Card, Typography, Button, message } from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromWishlist,
  selectWishlistItems,
} from "../../../store/slices/wishlist/wishlistSlice";
import { addToCart } from "../../../store/slices/cart/cartSlice";

const { Title, Text } = Typography;

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveFromWishlist = (item) => {
    dispatch(removeFromWishlist(item.id));
    message.error({
      content: `Đã xóa "${item.name}" khỏi danh sách yêu thích`,
      duration: 3,
      style: {
        marginTop: "20px",
        borderRadius: "10px",
      },
    });
  };

  const handleAddToCart = (item) => {
    const productToAdd = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      description: item.description,
      stock: item.stock,
      quantity: 1,
      discount: item.discount,
      originalPrice: item.originalPrice,
    };

    dispatch(addToCart(productToAdd));
    message.success({
      content: `Đã thêm "${item.name}" vào giỏ hàng`,
      duration: 3,
      style: {
        marginTop: "20px",
        borderRadius: "10px",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Danh Sách Yêu Thích
          </Title>
          <Text className="text-gray-600">
            {wishlistItems.length} sản phẩm trong danh sách yêu thích của bạn
          </Text>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    alt={item.name}
                    src={item.image}
                    className="h-72 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors group-hover:scale-110"
                  >
                    <DeleteOutlined className="text-red-500 text-lg" />
                  </button>
                  {item.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{item.discount}%
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-600 font-medium">
                      {item.brand}
                    </Text>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-600">{item.rating}</span>
                      </div>
                    )}
                  </div>

                  <Title
                    level={5}
                    className="!m-0 !text-xl font-bold line-clamp-1 group-hover:text-pink-600 transition-colors"
                  >
                    {item.name}
                  </Title>

                  <Text className="text-gray-600 line-clamp-2 text-sm">
                    {item.description}
                  </Text>

                  <div className="flex justify-between items-end pt-2">
                    <div className="space-y-1">
                      <Text className="text-2xl font-bold text-pink-600">
                        {formatPrice(item.price)}
                      </Text>
                      {item.originalPrice && (
                        <Text className="block text-sm text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </Text>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 px-6 py-2.5 text-white font-medium bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 hover:bg-gradient-to-br hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 border-0 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 active:scale-95"
                      disabled={!item.stock}
                    >
                      <ShoppingCartOutlined className="text-lg" />
                      <span>{item.stock ? "Thêm vào giỏ" : "Hết hàng"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <Title level={4} className="!text-2xl font-bold text-gray-800 mb-3">
              Danh sách yêu thích của bạn đang trống
            </Title>
            <Text className="text-gray-500 text-center max-w-md mb-8">
              Khám phá và thêm những sản phẩm bạn yêu thích để xem chúng ở đây
            </Text>
            <Link to="/product">
              <button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 border-0 rounded-full px-8 py-4 h-auto flex items-center gap-2 shadow-lg hover:shadow-2xl transform hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 text-white font-medium backdrop-blur-sm"
              >
                <ShoppingCartOutlined className="text-lg animate-bounce" />
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full">
                  Khám phá sản phẩm
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
