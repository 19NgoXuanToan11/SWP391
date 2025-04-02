import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Tag, Divider, Typography, Card, Row, Col, Spin } from "antd";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import confetti from "canvas-confetti";

const { Title, Paragraph, Text } = Typography;

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Hiệu ứng confetti khi trang load
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 500);

    // Lấy kết quả từ state hoặc localStorage
    const fetchResults = () => {
      let quizData;

      if (location.state?.results) {
        quizData = location.state.results;
      } else {
        const savedResults = localStorage.getItem("quizResults");
        if (savedResults) {
          quizData = JSON.parse(savedResults);
        }
      }

      if (quizData) {
        setResults(quizData);
        // Giả lập thời gian tải
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } else {
        navigate("/quiz");
      }
    };

    fetchResults();
  }, [location, navigate]);

  // Hàm chuyển đổi từ mã vấn đề da sang tên hiển thị
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

  // Thông tin về các loại da
  const skinTypeInfo = {
    "Da khô": {
      description:
        "Da khô thường thiếu độ ẩm, dễ bong tróc và cảm thấy căng sau khi rửa mặt. Loại da này cần được cung cấp đủ độ ẩm và dưỡng chất.",
      tips: [
        "Sử dụng sữa rửa mặt dịu nhẹ, không chứa sulfate",
        "Thêm serum cấp ẩm chứa hyaluronic acid vào quy trình",
        "Sử dụng kem dưỡng ẩm đậm đặc vào ban đêm",
        "Tránh tẩy tế bào chết quá thường xuyên",
      ],
      color: "#f9a8d4",
      recommendedIngredients: [
        "Hyaluronic Acid",
        "Ceramides",
        "Glycerin",
        "Squalane",
        "Vitamin E",
        "Aloe Vera",
      ],
    },
    "Da dầu": {
      description:
        "Da dầu thường tiết nhiều dầu, đặc biệt ở vùng chữ T. Loại da này cần kiểm soát lượng dầu thừa nhưng vẫn duy trì độ ẩm cần thiết.",
      tips: [
        "Sử dụng sữa rửa mặt có chứa salicylic acid",
        "Dùng toner không cồn để cân bằng độ pH",
        "Chọn kem dưỡng ẩm dạng gel hoặc lotion nhẹ",
        "Đắp mặt nạ đất sét 1-2 lần/tuần",
      ],
      color: "#93c5fd",
      recommendedIngredients: [
        "Salicylic Acid",
        "Niacinamide",
        "Tea Tree Oil",
        "Zinc",
        "Witch Hazel",
        "Clay",
      ],
    },
    "Da hỗn hợp": {
      description:
        "Da hỗn hợp có vùng chữ T (trán, mũi, cằm) tiết dầu nhiều, trong khi má và các vùng khác có thể khô. Loại da này cần cân bằng giữa kiểm soát dầu và cung cấp độ ẩm.",
      tips: [
        "Sử dụng sản phẩm làm sạch nhẹ nhàng",
        "Áp dụng các sản phẩm khác nhau cho các vùng da khác nhau",
        "Dùng toner cân bằng không chứa cồn",
        "Sử dụng kem dưỡng ẩm nhẹ cho toàn mặt",
      ],
      color: "#a5b4fc",
      recommendedIngredients: [
        "Niacinamide",
        "Hyaluronic Acid",
        "AHAs",
        "Antioxidants",
        "Aloe Vera",
        "Panthenol",
      ],
    },
    "Da thường": {
      description:
        "Da thường có độ ẩm và dầu cân bằng, ít gặp vấn đề về da. Loại da này cần duy trì sự cân bằng và bảo vệ khỏi các tác nhân môi trường.",
      tips: [
        "Duy trì quy trình chăm sóc da đơn giản",
        "Sử dụng kem chống nắng hàng ngày",
        "Làm sạch da nhẹ nhàng, tránh sản phẩm quá mạnh",
        "Thêm các sản phẩm chống oxy hóa để bảo vệ da",
      ],
      color: "#c4b5fd",
      recommendedIngredients: [
        "Vitamin C",
        "Peptides",
        "Coenzyme Q10",
        "Green Tea Extract",
        "Resveratrol",
        "Allantoin",
      ],
    },
    "Da nhạy cảm": {
      description:
        "Da nhạy cảm dễ bị kích ứng, đỏ và ngứa khi tiếp xúc với các sản phẩm mạnh hoặc thay đổi môi trường. Loại da này cần được chăm sóc nhẹ nhàng với các sản phẩm ít thành phần.",
      tips: [
        "Chọn sản phẩm không chứa hương liệu và cồn",
        "Thử nghiệm sản phẩm mới trên một vùng da nhỏ",
        "Tránh các thành phần gây kích ứng như retinol nồng độ cao",
        "Sử dụng sản phẩm có thành phần làm dịu như lô hội, yến mạch",
      ],
      color: "#fbcfe8",
      recommendedIngredients: [
        "Cica (Centella Asiatica)",
        "Allantoin",
        "Aloe Vera",
        "Oat Extract",
        "Panthenol",
        "Bisabolol",
      ],
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-xl border border-white/50 max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-ping opacity-20"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          </div>

          <Title
            level={3}
            className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            Đang phân tích kết quả...
          </Title>

          <Paragraph className="text-gray-600">
            Chúng tôi đang xác định loại da và đề xuất phù hợp nhất cho bạn
          </Paragraph>

          <div className="mt-6 flex justify-center space-x-2">
            <div
              className="w-3 h-3 rounded-full bg-pink-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-pink-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-pink-300 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl max-h-5xl bg-gradient-to-br from-pink-200/10 to-purple-200/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Kết Quả Phân Tích Da
          </span>

          <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dựa trên câu trả lời của bạn, chúng tôi đã xác định được loại da và
            các vấn đề cần quan tâm
          </Paragraph>
        </motion.div>

        {/* Kết quả chính */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8 border border-white/50 overflow-hidden relative"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-pink-500"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500"></div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Thông tin loại da */}
            <div className="flex-1">
              <Title
                level={2}
                className="mb-2 flex items-center flex-wrap gap-2"
              >
                Loại da của bạn:
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
                  {results?.skinType}
                </span>
              </Title>

              <Paragraph className="text-gray-700 text-lg mb-4">
                {skinTypeInfo?.description ||
                  "Loại da của bạn có những đặc điểm riêng biệt cần được chăm sóc phù hợp."}
              </Paragraph>

              {/* Các vấn đề về da */}
              <div className="mb-4">
                <Text strong className="text-gray-700 block mb-2 text-lg">
                  Vấn đề về da cần quan tâm:
                </Text>
                <div className="flex flex-wrap gap-2">
                  {results?.concerns && results.concerns.length > 0 ? (
                    results.concerns.map((concern, index) => (
                      <Tag
                        key={index}
                        color="pink"
                        className="px-4 py-2 text-base rounded-full"
                      >
                        {translateSkinConcern(concern)}
                      </Tag>
                    ))
                  ) : (
                    <Tag
                      color="green"
                      className="px-4 py-2 text-base rounded-full"
                    >
                      Không có vấn đề đặc biệt
                    </Tag>
                  )}
                </div>
              </div>

              {/* Thông tin khác */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600">
                {results?.age && (
                  <div className="bg-gray-50 px-4 py-2 rounded-full">
                    <Text strong>Độ tuổi:</Text> {results.age}
                  </div>
                )}
                {results?.gender && (
                  <div className="bg-gray-50 px-4 py-2 rounded-full">
                    <Text strong>Giới tính:</Text> {results.gender}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lời khuyên */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8 border border-white/50"
        >
          <Title level={3} className="text-purple-700 mb-6 flex items-center">
            <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-700">💡</span>
            </span>
            Lời khuyên
          </Title>

          <ul className="space-y-4">
            {results?.skinType &&
              skinTypeInfo[results.skinType]?.tips &&
              skinTypeInfo[results.skinType].tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-start bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl"
                >
                  <div className="text-pink-500 mr-3 mt-1 text-lg">✦</div>
                  <Text className="text-gray-700 mt-2">{tip}</Text>
                </motion.li>
              ))}
          </ul>
        </motion.div>

        {/* Nút hành động */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
        >
          <button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/product-recommendations")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 border-none h-auto py-4 px-8 rounded-full text-base text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
          >
            Xem Sản Phẩm Phù Hợp
          </button>

          <button
            type="default"
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/skincare-routine")}
            className="border-pink-400 text-pink-600 h-auto py-4 px-8 rounded-full text-base font-medium hover:border-pink-500 hover:text-pink-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            Tạo Quy Trình Chăm Sóc Da
          </button>

          <button
            type="button"
            onClick={() => navigate("/quiz")}
            className="flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-300 transform hover:scale-105"
          >
            <ArrowLeftOutlined className="mr-2" />
            <span className="font-semibold">Làm Lại Bài Kiểm Tra</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
