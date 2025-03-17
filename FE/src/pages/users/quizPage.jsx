import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Progress, Button, Radio, Checkbox, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const QuizPage = () => {
  // Định nghĩa mảng questions ở đầu component
  const questions = [
    {
      id: 1,
      question: "Làn da của bạn cảm thấy như thế nào vào cuối ngày?",
      options: [
        "Căng và khô, đôi khi có vảy",
        "Bóng dầu ở vùng chữ T (trán, mũi, cằm), các vùng khác bình thường",
        "Rất bóng dầu ở khắp mặt",
        "Dễ bị đỏ, ngứa hoặc kích ứng",
      ],
      skinType: ["Da khô", "Da hỗn hợp", "Da dầu", "Da nhạy cảm"],
    },
    {
      id: 2,
      question: "Khi rửa mặt xong, làn da của bạn cảm thấy như thế nào?",
      options: [
        "Căng, khô và thiếu độ ẩm",
        "Sạch và thoải mái, sau vài giờ vùng chữ T bắt đầu bóng dầu",
        "Sạch nhưng nhanh chóng trở nên bóng dầu trở lại",
        "Khô, đỏ hoặc kích ứng",
      ],
      skinType: ["Da khô", "Da hỗn hợp", "Da dầu", "Da nhạy cảm"],
    },
    {
      id: 3,
      question: "Lỗ chân lông của bạn như thế nào?",
      options: [
        "Hầu như không nhìn thấy",
        "To ở vùng chữ T, nhỏ ở má và các vùng khác",
        "To và dễ thấy trên khắp khuôn mặt",
        "Kích thước thay đổi, đôi khi đỏ xung quanh",
      ],
      skinType: ["Da khô", "Da hỗn hợp", "Da dầu", "Da nhạy cảm"],
    },
    {
      id: 4,
      question: "Bạn thường gặp vấn đề gì với làn da?",
      options: [
        "Da khô, bong tróc, thiếu độ ẩm",
        "Da dầu ở vùng chữ T, đôi khi có mụn",
        "Mụn, mụn đầu đen, da bóng dầu",
        "Da dễ bị đỏ, ngứa, kích ứng với sản phẩm mới",
      ],
      skinType: ["Da khô", "Da hỗn hợp", "Da dầu", "Da nhạy cảm"],
      concerns: [
        "dryness",
        "oiliness,largePores",
        "acne,oiliness",
        "sensitivity,redness",
      ],
    },
    {
      id: 5,
      question: "Làn da của bạn phản ứng thế nào với ánh nắng mặt trời?",
      options: [
        "Dễ bị cháy nắng, hiếm khi rám nắng",
        "Đôi khi cháy nắng, sau đó chuyển sang rám nắng",
        "Hiếm khi cháy nắng, dễ rám nắng",
        "Rất dễ bị cháy nắng và kích ứng",
      ],
      concerns: [
        "sensitivity",
        "unevenTexture",
        "darkSpots",
        "sensitivity,redness",
      ],
    },
    {
      id: 6,
      question: "Bạn có thấy nếp nhăn hoặc dấu hiệu lão hóa không?",
      options: [
        "Có, đặc biệt là khi da khô",
        "Chủ yếu ở vùng mắt và trán",
        "Không nhiều, da thường căng mọng",
        "Có nếp nhăn và da thường đỏ",
      ],
      concerns: ["wrinkles,dryness", "wrinkles", "", "wrinkles,sensitivity"],
    },
    {
      id: 7,
      question: "Bạn thuộc giới tính nào?",
      options: ["Nam", "Nữ", "Khác"],
      gender: ["Nam", "Nữ", "Khác"],
    },
    {
      id: 8,
      question: "Độ tuổi của bạn?",
      options: ["Dưới 18", "18-24", "25-34", "35-44", "45-54", "Trên 55"],
      age: ["Dưới 18", "18-24", "25-34", "35-44", "45-54", "Trên 55"],
    },
    {
      id: 9,
      question: "Bạn có gặp vấn đề nào sau đây không? (Có thể chọn nhiều)",
      options: [
        "Mụn và mụn đầu đen",
        "Đốm thâm và nám",
        "Nếp nhăn và dấu hiệu lão hóa",
        "Da xỉn màu, thiếu sức sống",
        "Lỗ chân lông to",
        "Da đỏ và kích ứng",
      ],
      multiSelect: true,
      concerns: [
        "acne",
        "darkSpots",
        "wrinkles",
        "dullness",
        "largePores",
        "redness",
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Tính toán tiến trình
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Xử lý khi người dùng chọn câu trả lời
  const handleAnswerSelect = (value) => {
    const newSelectedAnswers = { ...selectedAnswers };
    newSelectedAnswers[currentQuestion] = value;
    setSelectedAnswers(newSelectedAnswers);
  };

  // Xử lý khi người dùng chọn nhiều câu trả lời (checkbox)
  const handleMultipleAnswerSelect = (checkedValues) => {
    const newSelectedAnswers = { ...selectedAnswers };
    newSelectedAnswers[currentQuestion] = checkedValues;
    setSelectedAnswers(newSelectedAnswers);
  };

  // Xử lý khi người dùng nhấn nút "Tiếp theo"
  const handleNextQuestion = () => {
    // Kiểm tra xem người dùng đã chọn câu trả lời chưa
    if (selectedAnswers[currentQuestion] === undefined) {
      message.warning("Vui lòng chọn một câu trả lời trước khi tiếp tục");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Nếu đây là câu hỏi cuối cùng, tính toán kết quả
      calculateResults();
    }
  };

  // Xử lý khi người dùng nhấn nút "Quay lại"
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Tính toán kết quả dựa trên câu trả lời
  const calculateResults = () => {
    // Đếm số lần xuất hiện của mỗi loại da
    const skinTypeCount = {};
    const concernsSet = new Set();

    // Xử lý các câu hỏi về loại da
    for (let i = 0; i < 4; i++) {
      if (selectedAnswers[i] !== undefined && questions[i]) {
        const index = questions[i].options.indexOf(selectedAnswers[i]);
        if (index !== -1 && questions[i].skinType) {
          const skinType = questions[i].skinType[index];
          if (skinType) {
            skinTypeCount[skinType] = (skinTypeCount[skinType] || 0) + 1;
          }
        }
      }
    }

    // Xử lý các câu hỏi về vấn đề da
    for (let i = 4; i < 7; i++) {
      if (selectedAnswers[i] !== undefined && questions[i]) {
        const index = questions[i].options.indexOf(selectedAnswers[i]);
        if (index !== -1 && questions[i].concerns) {
          const concernsString = questions[i].concerns[index];
          if (concernsString) {
            concernsString.split(",").forEach((concern) => {
              if (concern) concernsSet.add(concern);
            });
          }
        }
      }
    }

    // Xử lý câu hỏi đa lựa chọn về vấn đề da
    if (Array.isArray(selectedAnswers[8]) && questions[8]) {
      selectedAnswers[8].forEach((answer) => {
        const index = questions[8].options.indexOf(answer);
        if (index !== -1 && questions[8].concerns) {
          const concern = questions[8].concerns[index];
          if (concern) concernsSet.add(concern);
        }
      });
    }

    // Xác định loại da phổ biến nhất
    let dominantSkinType = "Da hỗn hợp"; // Mặc định nếu không có loại da nào nổi bật
    let maxCount = 0;

    for (const [skinType, count] of Object.entries(skinTypeCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantSkinType = skinType;
      }
    }

    // Chuyển đổi Set thành Array
    const concernsArray = Array.from(concernsSet);

    // Tạo kết quả
    const results = {
      skinType: dominantSkinType,
      concerns: concernsArray,
      age: selectedAnswers[7] || "",
      gender: selectedAnswers[6] || "",
    };

    setQuizResults(results);

    localStorage.setItem("quizResults", JSON.stringify(results));
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));

    setShowResults(true);

    // Chuyển hướng đến trang kết quả
    navigate("/quiz-results", { state: { results } });
  };

  // Hiển thị câu hỏi hiện tại
  const renderQuestion = () => {
    const question = questions[currentQuestion];

    if (!question) {
      return <div>Không tìm thấy câu hỏi</div>;
    }

    return (
      <div className="quiz-question">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          {question.question}
        </h2>

        {question.multiSelect ? (
          // Hiển thị checkbox cho câu hỏi đa lựa chọn
          <div className="space-y-4">
            <Checkbox.Group
              className="flex flex-col gap-4 w-full"
              onChange={handleMultipleAnswerSelect}
              value={selectedAnswers[currentQuestion] || []}
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-all duration-300"
                >
                  <label
                    className={`flex items-center w-full p-5 rounded-2xl border border-gray-100 cursor-pointer transition-all duration-300 
                      ${
                        selectedAnswers[currentQuestion]?.includes(option)
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300 shadow-md"
                          : "bg-white hover:bg-pink-50/30 hover:border-pink-200 hover:shadow-sm"
                      }`}
                  >
                    <Checkbox value={option} className="quiz-option">
                      <span className="ml-2 text-base text-gray-700">
                        {option}
                      </span>
                    </Checkbox>
                  </label>
                </motion.div>
              ))}
            </Checkbox.Group>
          </div>
        ) : (
          // Hiển thị radio cho câu hỏi một lựa chọn
          <div className="space-y-4">
            <Radio.Group
              className="flex flex-col gap-4 w-full"
              onChange={(e) => handleAnswerSelect(e.target.value)}
              value={selectedAnswers[currentQuestion]}
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-all duration-300"
                >
                  <label
                    className={`flex items-center w-full p-5 rounded-2xl border cursor-pointer transition-all duration-300
                      ${
                        selectedAnswers[currentQuestion] === option
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300 shadow-md"
                          : "bg-white hover:bg-pink-50/30 border-gray-100 hover:border-pink-200 hover:shadow-sm"
                      }`}
                  >
                    <Radio value={option} className="quiz-option">
                      <span className="ml-2 text-base text-gray-700">
                        {option}
                      </span>
                    </Radio>
                  </label>
                </motion.div>
              ))}
            </Radio.Group>
          </div>
        )}
      </div>
    );
  };

  // Thêm CSS tùy chỉnh để làm mềm mại hơn
  const customStyles = `
    .ant-radio-wrapper,
    .ant-checkbox-wrapper {
      width: 100%;
    }
    
    .ant-radio-inner,
    .ant-checkbox-inner {
      border-color: #ec4899 !important;
      background-color: white !important;
    }
    
    .ant-radio-checked .ant-radio-inner,
    .ant-checkbox-checked .ant-checkbox-inner {
      border-color: #ec4899 !important;
      background-color: white !important;
    }
    
    .ant-radio-inner::after {
      background-color: #ec4899 !important;
    }
    
    .ant-checkbox-checked .ant-checkbox-inner::after {
      border-color: #ec4899 !important;
    }
    
    .ant-radio:hover .ant-radio-inner,
    .ant-checkbox:hover .ant-checkbox-inner {
      border-color: #ec4899 !important;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 py-12 px-4">
      <style>{customStyles}</style>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Phân Tích Làn Da Của Bạn
                </h1>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">
                    Câu hỏi {currentQuestion + 1} / {questions.length}
                  </span>
                  <span className="text-pink-600 font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor={{
                    "0%": "#ec4899",
                    "100%": "#a855f7",
                  }}
                  className="h-2 rounded-full overflow-hidden"
                  trailColor="#f3e8ff"
                />
              </motion.div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-10"
                >
                  {renderQuestion()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between mt-8"
              >
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    currentQuestion === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-pink-400 hover:text-pink-500 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm">←</span>
                  <span>Quay Lại</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  <span>
                    {currentQuestion === questions.length - 1
                      ? "Hoàn Thành"
                      : "Câu Tiếp Theo"}
                  </span>
                  {currentQuestion !== questions.length - 1 && (
                    <span className="text-sm">→</span>
                  )}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-white/50 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-ping opacity-20"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
              </div>

              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Đang Phân Tích Kết Quả...
              </h2>

              <p className="text-gray-600 max-w-md mx-auto">
                Chúng tôi đang xác định loại da và các vấn đề cần quan tâm dựa
                trên câu trả lời của bạn. Vui lòng đợi trong giây lát.
              </p>

              <div className="mt-8 flex justify-center space-x-2">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default QuizPage;
