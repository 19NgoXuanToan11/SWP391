import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

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

  const renderResults = () => (
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Kết Quả Phân Tích Da Của Bạn
      </h2>

      <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <p className="text-xl mb-4">
          <span className="font-semibold text-purple-700">Loại Da: </span>
          <span className="text-gray-800">{quizResults.skinType}</span>
        </p>
        <p className="text-xl">
          <span className="font-semibold text-purple-700">Vấn Đề Về Da: </span>
          <span className="text-gray-800">
            {quizResults.concerns.join(", ")}
          </span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleViewRoutine}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
        >
          Xem Quy Trình Chăm Sóc Da
        </button>
        <button
          onClick={handleViewProducts}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
        >
          Xem Sản Phẩm Phù Hợp
        </button>
        <button
          onClick={handleRestartQuiz}
          className="w-full md:w-auto px-8 py-3 border-2 border-purple-500 text-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-300 font-medium"
        >
          Làm Lại Bài Kiểm Tra
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-[80%] max-w-4xl shadow-xl">
        {showResults ? (
          renderResults()
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Câu hỏi {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3 mb-8">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                    selectedAnswer === option
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold disabled:opacity-50 enabled:hover:opacity-90 transition-all"
            >
              {currentQuestion === questions.length - 1
                ? "Hoàn Thành"
                : "Câu Tiếp Theo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
