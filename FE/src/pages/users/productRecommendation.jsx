import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Image,
  Button,
  Tag,
  Typography,
  Rate,
  Badge,
  Tooltip,
  Divider,
} from "antd";
import {
  ShoppingOutlined,
  HeartOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../config/axios";
import endpoints from "../../constants/endpoint";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";

const { Title, Text, Paragraph } = Typography;

export function ProductRecommendationPage() {
  const location = useLocation();
  const quizResults =
    location.state?.quizResults ||
    JSON.parse(localStorage.getItem("quizResults"));
  const [recommendations, setRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  // Mapping loại da từ quiz sang key trong recommendations
  const skinTypeMapping = {
    "Da dầu": "oily",
    "Da khô": "dry",
    "Da hỗn hợp": "combination",
    "Da nhạy cảm": "sensitive",
  };

  // Định nghĩa các vấn đề da
  const skinConcerns = {
    acne: "Mụn",
    darkSpots: "Đốm thâm nám",
    wrinkles: "Nếp nhăn",
    dryness: "Khô da",
    sensitivity: "Da nhạy cảm",
    oiliness: "Da dầu",
    largePores: "Lỗ chân lông to",
    dullness: "Da xỉn màu",
    redness: "Da đỏ",
    unevenTexture: "Da không đều màu",
  };

  // Hàm chuyển đổi key thành text hiển thị
  const getConcernText = (concernKey) => {
    return skinConcerns[concernKey] || concernKey;
  };

  // Fetch tất cả sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(endpoints.GET_PRODUCTS);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo loại da
  useEffect(() => {
    const loadRecommendations = () => {
      const userSkinType = quizResults?.skinType;
      console.log("User skin type:", userSkinType);

      // Lọc sản phẩm phù hợp với loại da
      const matchingProducts = allProducts
        .filter((product) => {
          // Kiểm tra nếu sản phẩm phù hợp với da dầu
          if (userSkinType === "Da dầu") {
            return product.skinTypeName === "Da dầu";
          }
          // Thêm các điều kiện cho các loại da khác
          return false;
        })
        .map((product) => ({
          id: product.productId,
          name: product.productName,
          brand: product.brandName,
          price: product.price,
          rating: 4.8, // Có thể thay đổi thành dữ liệu thực từ API
          reviews: 128, // Có thể thay đổi thành dữ liệu thực từ API
          image: product.imageUrls,
          matchScore: 95, // Có thể tính toán dựa trên mức độ phù hợp
          description: product.description,
          benefits: [product.mainIngredients], // Chuyển thành array nếu cần
          stockStatus: product.stock > 0 ? "Còn hàng" : "Hết hàng",
          isNew: true, // Có thể xác định dựa trên ngày tạo sản phẩm
        }));

      console.log("Matching products:", matchingProducts);
      setRecommendations(matchingProducts);
    };

    if (allProducts.length > 0) {
      loadRecommendations();
    }
  }, [quizResults, allProducts]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (product) => {
    try {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          quantity: 1,
        })
      );
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      message.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleToggleWishlist = (product) => {
    try {
      dispatch(
        toggleWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
        })
      );
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      message.success(
        isInWishlist
          ? "Đã xóa sản phẩm khỏi danh sách yêu thích!"
          : "Đã thêm sản phẩm vào danh sách yêu thích!"
      );
    } catch (error) {
      message.error("Không thể cập nhật danh sách yêu thích!");
    }
  };

  // Thêm hàm xử lý click vào sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section với animation và gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Title level={1} className="text-4xl md:text-5xl font-bold mb-6">
            Sản Phẩm Được Đề Xuất Cho{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              {quizResults?.skinType || "Bạn"}
            </span>
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dựa trên kết quả phân tích làn da của bạn, chúng tôi đã chọn ra
            những sản phẩm phù hợp nhất để giúp bạn đạt được làn da khỏe mạnh và
            rạng rỡ.
          </Paragraph>
        </motion.div>

        {/* Kết quả phân tích với thiết kế mới */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 mb-12 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Title
                level={3}
                className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
              >
                Kết Quả Phân Tích Da Của Bạn
              </Title>
              <div className="flex flex-wrap gap-3">
                <Tag color="blue" className="px-4 py-2 rounded-full text-base">
                  Loại da: {quizResults?.skinType || "Chưa xác định"}
                </Tag>
                {quizResults?.concerns?.length > 0 ? (
                  <Tag
                    color="pink"
                    className="px-4 py-2 rounded-full text-base"
                  >
                    Vấn đề về da: {quizResults?.concerns?.join(", ")}
                  </Tag>
                ) : (
                  <Tag
                    color="pink"
                    className="px-4 py-2 rounded-full text-base"
                  >
                    Vấn đề về da: Chưa xác định
                  </Tag>
                )}
              </div>
            </div>
            <Button
              onClick={() => navigate("/quiz")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 border-none text-white px-8 py-5 h-auto rounded-full text-base font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Làm lại bài kiểm tra
            </Button>
          </div>
        </motion.div>

        {/* Danh sách sản phẩm với thiết kế mới */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
              >
                <Card
                  hoverable
                  className="h-full rounded-2xl overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                  cover={
                    <div
                      className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        alt={product.name}
                        src={product.image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Brand Tag */}
                      <div className="absolute bottom-4 left-4">
                        <Tag className="m-0 bg-white/90 backdrop-blur-sm text-gray-800 border-none px-3 py-1.5 rounded-full font-medium">
                          {product.brand}
                        </Tag>
                      </div>
                    </div>
                  }
                >
                  <div className="flex flex-col flex-grow p-6 space-y-4">
                    {/* Product Name - Thêm cursor-pointer và onClick */}
                    <Text
                      className="text-lg font-bold line-clamp-2 min-h-[3rem] cursor-pointer hover:text-pink-600 transition-colors duration-300"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </Text>

                    {/* Price and Rating Row */}
                    <div className="flex justify-between items-center">
                      <Text className="text-xl font-semibold text-pink-600">
                        {formatPrice(product.price)}
                      </Text>
                    </div>

                    {/* Description */}
                    <Text className="text-gray-600 text-sm line-clamp-2 flex-grow">
                      {product.description}
                    </Text>

                    {/* Benefits/Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {product.benefits.map((benefit, index) => (
                        <Tag
                          key={index}
                          className="bg-pink-50 text-pink-600 border-pink-200 rounded-full text-xs py-1"
                        >
                          {benefit}
                        </Tag>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 mt-auto">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-none rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2 py-2.5 text-white font-medium"
                      >
                        <ShoppingOutlined className="text-lg" />
                        <span>Thêm vào giỏ</span>
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(product)}
                        className={`aspect-square rounded-full border ${
                          wishlist.some((item) => item.id === product.id)
                            ? "border-pink-500 text-pink-500 bg-pink-50"
                            : "border-pink-200 text-gray-400 hover:border-pink-500 hover:text-pink-500"
                        } p-2.5 hover:bg-pink-50 transition-all duration-300 flex items-center justify-center`}
                      >
                        {wishlist.some((item) => item.id === product.id) ? (
                          <HeartFilled className="text-lg hover:scale-110 transition-transform" />
                        ) : (
                          <HeartOutlined className="text-lg hover:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl"
          >
            <Text className="text-gray-500 text-lg">
              Chưa có sản phẩm được đề xuất. Vui lòng làm bài kiểm tra để nhận
              gợi ý sản phẩm phù hợp.
            </Text>
          </motion.div>
        )}
      </div>
    </div>
  );
}
