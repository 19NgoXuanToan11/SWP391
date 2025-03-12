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
} from "../../store/slices/wishlistSlice";
import { addToCart } from "../../store/slices/cartSlice";

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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <HeartFilled className="text-4xl text-gray-300 mb-4" />
            <Title level={4}>Danh sách yêu thích trống</Title>
            <Text className="text-gray-500 block mb-6">
              Hãy thêm sản phẩm vào danh sách yêu thích của bạn
            </Text>
            <Link to="/product">
              <Button type="primary" className="bg-pink-600 hover:bg-pink-700">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
