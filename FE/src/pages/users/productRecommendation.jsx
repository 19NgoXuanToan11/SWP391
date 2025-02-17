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
} from "@ant-design/icons";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const productDatabase = [
  {
    id: 1,
    name: "Cerave Gentle Cleanser",
    brand: "Cerave",
    price: 250000,
    rating: 4.5,
    image: "/src/assets/pictures/5.jpg",
    suitableFor: ["Dry Skin", "Sensitive Skin"],
    step: "Cleansing",
    description: "Soap-free cleanser with ceramides and HA",
    ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
    volume: "250ml",
    compareFeatures: {
      texture: "Cream",
      cleansing: "Gentle",
      moisture: "High",
      suitability: "Dry, sensitive skin",
    },
  },
  {
    id: 2,
    name: "La Roche-Posay Effaclar Cleanser",
    brand: "La Roche-Posay",
    price: 350000,
    rating: 4.3,
    image: "/src/assets/pictures/6.jpg",
    suitableFor: ["Oily Skin", "Combination Skin"],
    step: "Cleansing",
    description: "Oil-control cleanser with Zinc PCA",
    ingredients: ["Zinc PCA", "Niacinamide"],
    volume: "200ml",
    compareFeatures: {
      texture: "Gel",
      cleansing: "Strong",
      moisture: "Moderate",
      suitability: "Oily, acne-prone skin",
    },
  },
  // Thêm nhiều sản phẩm khác
];

export function ProductRecommendationPage() {
  const location = useLocation();
  const quizResults =
    location.state?.quizResults ||
    JSON.parse(localStorage.getItem("quizResults"));
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Giả lập API call
    const fetchRecommendations = async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Kem Dưỡng Ẩm Cerave",
          brand: "Cerave",
          price: 450000,
          rating: 4.8,
          reviews: 128,
          image: "/src/assets/pictures/5.jpg",
          suitableFor: ["Da khô", "Da nhạy cảm"],
          step: "Dưỡng ẩm",
          description:
            "Kem dưỡng ẩm không gây kích ứng, phù hợp cho da nhạy cảm",
          ingredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
          benefits: [
            "Dưỡng ẩm 24h",
            "Phục hồi hàng rào da",
            "Không gây bít tắc lỗ chân lông",
          ],
          volume: "50ml",
          matchScore: 95,
          isNew: true,
          stockStatus: "Còn hàng",
        },
        // Thêm các sản phẩm khác tương tự
      ];

      setRecommendations(mockProducts);
    };

    fetchRecommendations();
  }, [quizResults]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (product) => {
    // Thêm logic xử lý thêm vào giỏ hàng ở đây
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Title level={1} className="text-4xl md:text-5xl font-bold mb-6">
            Sản Phẩm Được Đề Xuất Cho Bạn
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dựa trên kết quả phân tích làn da của bạn, chúng tôi đã chọn ra
            những sản phẩm phù hợp nhất để giúp bạn đạt được làn da khỏe mạnh và
            rạng rỡ.
          </Paragraph>
        </motion.div>

        {/* Quiz Results Summary */}
        {quizResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Title level={4} className="mb-2">
                  Kết Quả Phân Tích Da Của Bạn
                </Title>
                <div className="flex flex-wrap gap-3">
                  <Tag
                    color="blue"
                    className="px-3 py-1.5 text-sm rounded-full"
                  >
                    Loại da: {quizResults?.skinType}
                  </Tag>
                  <Tag
                    color="cyan"
                    className="px-3 py-1.5 text-sm rounded-full"
                  >
                    Vấn đề chính: {getConcernText(quizResults?.mainConcern)}
                  </Tag>
                </div>
              </div>
              <Link to="/quiz">
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 
                                 text-white rounded-xl hover:opacity-90 transition-opacity 
                                 duration-300 font-medium shadow-md hover:shadow-lg
                                 flex items-center space-x-2"
                >
                  <span>Làm lại bài kiểm tra</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge.Ribbon
                text={`Phù hợp ${product.matchScore}%`}
                color="green"
                className="rounded-lg"
              >
                <Card
                  hoverable
                  className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  cover={
                    <div className="relative aspect-w-1 aspect-h-1">
                      <Image
                        alt={product.name}
                        src={product.image}
                        className="object-cover"
                        preview={false}
                      />
                      {product.isNew && (
                        <div className="absolute top-4 left-4">
                          <Tag color="blue" className="px-3 py-1 rounded-full">
                            Mới
                          </Tag>
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <Text type="secondary" className="text-sm">
                        {product.brand}
                      </Text>
                      <Title level={4} className="mb-1 mt-1">
                        {product.name}
                      </Title>
                      <div className="flex items-center space-x-2">
                        <Rate
                          disabled
                          defaultValue={product.rating}
                          className="text-sm"
                        />
                        <Text type="secondary">({product.reviews})</Text>
                      </div>
                    </div>

                    <Paragraph className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </Paragraph>

                    <div className="flex flex-wrap gap-2">
                      {product.suitableFor.map((type) => (
                        <Tag key={type} color="pink" className="rounded-full">
                          {type}
                        </Tag>
                      ))}
                    </div>

                    <Divider className="my-3" />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Title level={3} className="mb-0 text-pink-600">
                          {formatPrice(product.price)}
                        </Title>
                        <Tag
                          color={
                            product.stockStatus === "Còn hàng"
                              ? "success"
                              : "error"
                          }
                          className="rounded-full px-3 py-1"
                        >
                          {product.stockStatus}
                        </Tag>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 
                                   text-white rounded-xl hover:opacity-90 transition-opacity duration-300 
                                   font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                        >
                          <ShoppingOutlined className="text-lg" />
                          <span>Thêm vào giỏ</span>
                        </button>
                        <button
                          className="p-2.5 border-2 border-pink-500 text-pink-500 rounded-xl
                                   hover:bg-pink-50 transition-colors duration-300 flex items-center justify-center"
                        >
                          <HeartOutlined className="text-lg" />
                        </button>
                      </div>
                    </div>

                    {/* Product Benefits */}
                    <div className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircleFilled className="text-green-500" />
                          <Text className="text-sm">{benefit}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Badge.Ribbon>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
