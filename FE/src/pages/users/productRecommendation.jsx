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

  // Thêm hàm chuyển đổi từ tiếng Anh sang tiếng Việt
  const translateSkinConcern = (concern) => {
    const translations = {
      acne: "Mụn & Thâm mụn",
      wrinkles: "Nếp nhăn & Lão hóa",
      darkSpots: "Đốm nâu & Tăng sắc tố",
      dullness: "Da xỉn màu & Không đều",
      dryness: "Da khô & Thiếu ẩm",
      oiliness: "Da dầu",
      largePores: "Lỗ chân lông to",
      sensitivity: "Da nhạy cảm",
      redness: "Da đỏ & Kích ứng",
      unevenTexture: "Kết cấu da không đều",
    };
    return translations[concern] || concern;
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
      if (!quizResults || !allProducts.length) return;

      const userSkinType = quizResults?.skinType;
      const userConcerns = quizResults?.concerns || [];
      console.log("User skin type:", userSkinType);
      console.log("User concerns:", userConcerns);

      // Lọc sản phẩm phù hợp với loại da
      const matchingProducts = allProducts
        .filter((product) => {
          // Kiểm tra nếu sản phẩm phù hợp với loại da
          if (
            userSkinType === "Da dầu" &&
            (product.skinTypeName === "Da dầu" ||
              product.skinTypeName === "Mọi loại da")
          ) {
            return true;
          }
          if (
            userSkinType === "Da khô" &&
            (product.skinTypeName === "Da khô" ||
              product.skinTypeName === "Mọi loại da")
          ) {
            return true;
          }
          if (
            userSkinType === "Da hỗn hợp" &&
            (product.skinTypeName === "Da hỗn hợp" ||
              product.skinTypeName === "Mọi loại da")
          ) {
            return true;
          }
          if (
            userSkinType === "Da nhạy cảm" &&
            (product.skinTypeName === "Da nhạy cảm" ||
              product.skinTypeName === "Mọi loại da")
          ) {
            return true;
          }

          return false;
        })
        .map((product) => {
          // Tính điểm phù hợp dựa trên loại da và vấn đề da
          let matchScore = 70; // Điểm cơ bản

          // Nếu sản phẩm phù hợp chính xác với loại da
          if (product.skinTypeName === userSkinType) {
            matchScore += 20;
          } else if (product.skinTypeName === "Mọi loại da") {
            matchScore += 10;
          }

          // Nếu sản phẩm giải quyết các vấn đề da của người dùng
          const productConcerns = product.skinConcerns || [];
          const matchingConcerns = userConcerns.filter((concern) =>
            productConcerns.includes(concern)
          );

          if (matchingConcerns.length > 0) {
            matchScore += matchingConcerns.length * 5;
          }

          return {
            id: product.productId,
            name: product.productName,
            brand: product.brandName,
            price: product.price,
            rating: product.rating || 4.5,
            reviews: product.reviewCount || 0,
            image: product.imageUrls,
            matchScore: Math.min(matchScore, 100), // Giới hạn điểm tối đa là 100
            description: product.description,
            benefits: [product.mainIngredients], // Chuyển thành array nếu cần
            stockStatus: product.stock > 0 ? "Còn hàng" : "Hết hàng",
            isNew: product.isNew || false,
            skinType: product.skinTypeName,
            concerns: product.skinConcerns || [],
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore); // Sắp xếp theo điểm phù hợp

      setRecommendations(matchingProducts);
    };

    loadRecommendations();
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Sản Phẩm Phù Hợp Với Làn Da Của Bạn
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dựa trên kết quả phân tích làn da, chúng tôi đã chọn ra những sản
            phẩm phù hợp nhất để giúp bạn đạt được làn da khỏe mạnh và rạng rỡ.
          </p>
        </motion.div>

        {/* Kết quả phân tích da */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 mb-10 shadow-xl border border-white/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loại da */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-pink-100/50 transition-all hover:shadow-md h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">👤</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Loại da của bạn</p>
                  <p className="font-semibold text-lg text-blue-600">
                    {quizResults?.skinType || "Chưa xác định"}
                  </p>
                </div>
              </div>
            </div>

            {/* Vấn đề về da */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-pink-100/50 transition-all hover:shadow-md h-full">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-600 text-xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">
                    Vấn đề về da cần quan tâm
                  </p>

                  {quizResults?.concerns?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quizResults.concerns.map((concern, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-700 rounded-full text-sm font-medium border border-pink-200/50"
                        >
                          {translateSkinConcern(concern)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-semibold text-lg text-green-600 mt-1">
                      Không có vấn đề đặc biệt
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nút làm lại bài kiểm tra */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-xs">↺</span>
              Làm lại bài kiểm tra
            </button>
          </div>
        </motion.div>

        {/* Danh sách sản phẩm */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-pink-600">✓</span>
            </span>
            Sản phẩm được đề xuất cho {quizResults?.skinType}
          </h2>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-white/50"
                >
                  <div className="relative">
                    <img
                      src={
                        product.image[0] ||
                        "https://via.placeholder.com/300x300"
                      }
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-pink-600 border border-pink-100">
                      Phù hợp {product.matchScore}%
                    </div>
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                        Mới
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="text-pink-600 font-bold">
                        {product.price.toLocaleString()}₫
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      {product.brand}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-${
                              star <= Math.floor(product.rating)
                                ? "yellow"
                                : "gray"
                            }-400`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {product.skinType}
                      </span>
                      {product.concerns.slice(0, 2).map((concern, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                        >
                          {translateSkinConcern(concern)}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-md transition-all duration-300"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
              <p className="text-gray-600">
                Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại bài kiểm tra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
