import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { motion } from "framer-motion";
import {
  SkinOutlined,
  AlertOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const questions = [
  {
    id: 1,
    question: "Da của bạn thường như thế nào vào buổi chiều?",
    options: [
      "Vùng chữ T (trán, mũi, cằm) dầu, các vùng khác bình thường hoặc khô",
      "Da không dầu, khá khô và căng ở một số vùng",
      "Toàn bộ khuôn mặt đều dầu, dễ bị mụn đầu đen và mụn",
      "Da mềm mại và dễ chịu khi chạm vào",
      "Da khô với nếp nhăn rõ ràng",
    ],
    skinType: [
      "Da hỗn hợp",
      "Da khô",
      "Da dầu",
      "Da thường",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 2,
    question: "Vùng trán của bạn như thế nào?",
    options: [
      "Mịn màng, phẳng, chỉ có một vài nếp nhăn nhỏ",
      "Có vảy khô dọc chân tóc và lông mày",
      "Dầu, không đều màu, có mụn đầu đen hoặc mụn nhỏ",
      "Mịn màng, đều màu, không có vảy",
      "Nhiều nếp nhăn rõ ràng",
    ],
    skinType: [
      "Da thường",
      "Da khô",
      "Da dầu",
      "Da hỗn hợp",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 3,
    question: "Mô tả vùng má và quầng mắt của bạn?",
    options: [
      "Không có nếp nhăn rõ ràng, chỉ có một số vùng khô",
      "Khô, dễ bị kích ứng, cảm giác căng",
      "Lỗ chân lông to, nhiều mụn đầu đen hoặc đốm trắng",
      "Mịn màng, lỗ chân lông nhỏ",
      "Nếp nhăn rõ ràng, da khô",
    ],
    skinType: [
      "Da thường",
      "Da khô",
      "Da dầu",
      "Da hỗn hợp",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 4,
    question: "Da của bạn có dễ bị thâm nám hoặc đỏ không?",
    options: [
      "Chỉ ở vùng chữ T (trán, mũi, cằm)",
      "Hơi đỏ, độ ẩm không đều",
      "Thường xuyên gặp các vấn đề này",
      "Thỉnh thoảng",
      "Hầu như không bao giờ",
    ],
    skinType: [
      "Da hỗn hợp",
      "Da khô",
      "Da dầu",
      "Da thường",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 5,
    question: "Điều gì quan trọng nhất với bạn khi chọn sản phẩm chăm sóc da?",
    options: [
      "Giảm dầu nhưng vẫn duy trì độ ẩm tốt",
      "Dưỡng ẩm sâu và làm dịu",
      "Thẩm thấu nhanh, cải thiện da nhanh chóng",
      "Giữ da mềm mại và mịn màng như hiện tại",
      "Ngăn ngừa dấu hiệu lão hóa sớm",
    ],
    skinType: [
      "Da dầu",
      "Da khô",
      "Da hỗn hợp",
      "Da thường",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 6,
    question: "Da của bạn có dễ hình thành nếp nhăn không?",
    options: [
      "Một số nếp nhăn do khô",
      "Nếp nhăn quanh mắt hoặc khóe miệng",
      "Hầu như không có nếp nhăn",
      "Lão hóa chậm, ít nếp nhăn",
    ],
    skinType: ["Da khô", "Da khô và lão hóa", "Da dầu", "Da hỗn hợp"],
  },
  {
    id: 7,
    question: "Da mặt của bạn đã thay đổi như thế nào trong 5 năm qua?",
    options: [
      "Vùng chữ T dầu hơn",
      "Dễ bong tróc, cảm giác căng",
      "Nhiều khuyết điểm hơn",
      "Vẫn dễ chăm sóc, tình trạng tốt",
      "Mỏng hơn, kém đàn hồi, nhiều nếp nhăn hơn",
    ],
    skinType: [
      "Da hỗn hợp",
      "Da khô",
      "Da dầu",
      "Da thường",
      "Da khô và lão hóa",
    ],
  },
  {
    id: 8,
    question: "Giới tính của bạn là gì?",
    options: ["Nam", "Nữ"],
    skinType: [],
  },
  {
    id: 9,
    question: "Độ tuổi của bạn?",
    options: ["Dưới 25", "25 đến 40", "40 đến 50", "Trên 50"],
    skinType: [],
  },
];

export function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [skinTypeCount, setSkinTypeCount] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [quizResults, setQuizResults] = useState({
    skinType: "",
    concerns: [],
    age: "",
    gender: "",
  });

  useEffect(() => {
    const savedResults = localStorage.getItem("quizResults");
    const savedAnswers = localStorage.getItem("selectedAnswers");
    const savedSkinTypeCount = localStorage.getItem("skinTypeCount");

    if (savedResults && savedAnswers && savedSkinTypeCount) {
      setQuizResults(JSON.parse(savedResults));
      setSelectedAnswers(JSON.parse(savedAnswers));
      setSkinTypeCount(JSON.parse(savedSkinTypeCount));
      setShowResults(true);
    }
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    const selectedIndex =
      questions[currentQuestion].options.indexOf(selectedAnswer);
    const selectedSkinType = questions[currentQuestion].skinType[selectedIndex];

    if (selectedSkinType) {
      setSkinTypeCount((prev) => ({
        ...prev,
        [selectedSkinType]: (prev[selectedSkinType] || 0) + 1,
      }));
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      determineResults();
    }
  };

  const handleRestartQuiz = () => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("skinTypeCount");

    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSkinTypeCount({});
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResults(false);
  };

  const determineResults = () => {
    const mostCommonSkinType = Object.entries(skinTypeCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    const concerns = [];
    if (skinTypeCount["Da dầu"] > 0) concerns.push("Mụn");
    if (skinTypeCount["Da khô và lão hóa"] > 0) concerns.push("Lão hóa");

    const results = {
      skinType: mostCommonSkinType,
      concerns: concerns,
      age: selectedAnswers[8],
      gender: selectedAnswers[7],
    };

    setQuizResults(results);

    localStorage.setItem("quizResults", JSON.stringify(results));
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    localStorage.setItem("skinTypeCount", JSON.stringify(skinTypeCount));

    setShowResults(true);
  };

  const handleViewRoutine = () => {
    navigate("/skin-care-routine", { state: { quizResults } });
  };

  const handleViewProducts = () => {
    navigate("/product-recommendations", { state: { quizResults } });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      const currentSelectedIndex = questions[currentQuestion].options.indexOf(
        selectedAnswers[currentQuestion]
      );
      const currentSelectedSkinType =
        questions[currentQuestion].skinType[currentSelectedIndex];

      if (currentSelectedSkinType) {
        setSkinTypeCount((prev) => ({
          ...prev,
          [currentSelectedSkinType]: Math.max(
            0,
            (prev[currentSelectedSkinType] || 0) - 1
          ),
        }));
      }

      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(selectedAnswers[currentQuestion - 1]);
    }
  };

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl"
    >
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Kết Quả Phân Tích Da Của Bạn
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <SkinOutlined className="text-2xl text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-purple-600 font-medium">Loại Da</p>
              <p className="text-xl text-gray-800 font-semibold">
                {quizResults.skinType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <AlertOutlined className="text-2xl text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-purple-600 font-medium">
                Vấn Đề Về Da
              </p>
              <p className="text-xl text-gray-800 font-semibold">
                {quizResults.concerns.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewRoutine}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 
            text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
            transform hover:-translate-y-1 font-medium flex items-center justify-center gap-2"
        >
          <CalendarOutlined />
          Xem Quy Trình Chăm Sóc Da
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewProducts}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 
            text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
            transform hover:-translate-y-1 font-medium flex items-center justify-center gap-2"
        >
          <ShoppingOutlined />
          Xem Sản Phẩm Phù Hợp
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRestartQuiz}
          className="w-full md:w-auto px-8 py-4 border-2 border-purple-500 text-purple-600 
            rounded-xl hover:bg-purple-50 transition-colors duration-300 font-medium 
            flex items-center justify-center gap-2"
        >
          <ReloadOutlined />
          Làm Lại Bài Kiểm Tra
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 
      flex items-center justify-center px-4 py-10"
    >
      <div className="relative w-full max-w-4xl">
        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10"
        >
          {showResults ? (
            renderResults()
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Câu hỏi {currentQuestion + 1} / {questions.length}
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.round((currentQuestion / questions.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                </div>
              </div>

              {/* Question */}
              <motion.h2
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-8 text-gray-800"
              >
                {questions[currentQuestion].question}
              </motion.h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-300 
                      transform hover:-translate-y-1 hover:shadow-lg ${
                        selectedAnswer === option
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2
                        ${
                          selectedAnswer === option
                            ? "border-white"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswer === option && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-white rounded-full"
                          />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentQuestion > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePreviousQuestion}
                    className="w-1/2 py-4 border-2 border-purple-600 text-purple-600 
                      rounded-xl font-semibold hover:bg-purple-50 
                      transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeftOutlined />
                    Quay Lại
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  className={`py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                    text-white rounded-xl font-semibold disabled:opacity-50 
                    enabled:hover:shadow-lg transition-all duration-300
                    ${currentQuestion > 0 ? "w-1/2" : "w-full"}`}
                >
                  {currentQuestion === questions.length - 1
                    ? "Hoàn Thành"
                    : "Câu Tiếp Theo"}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
