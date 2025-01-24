import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Da của bạn thường trông ra sao vào buổi chiều?",
    options: [
      "Vùng chữ T (trán, mũi, cằm) bị bóng dầu, nhưng các khu vực khác bình thường hoặc khô",
      "Da không bóng, khá khô, và có cảm giác căng ở một số khu vực",
      "Toàn bộ khuôn mặt bóng nhờn, dễ bị mụn đầu đen và mụn trứng cá",
      "Da mềm mại và dễ chịu khi chạm vào",
      "Da khô và có các nếp nhăn rõ ràng",
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
    question: "Vùng trán của bạn trông như thế nào?",
    options: [
      "Da mịn, phẳng, chỉ có vài nếp nhăn nhẹ",
      "Có vết bong tróc dọc đường chân tóc và lông mày",
      "Bóng nhờn, không mịn, có mụn đầu đen hoặc nốt mụn nhỏ",
      "Mịn màng, láng mượt, không có dấu hiệu bong tróc",
      "Nhiều nếp nhăn dễ nhận thấy",
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
    question: "Hãy mô tả phần má và vùng dưới mắt của bạn?",
    options: [
      "Không có vết nhăn dễ thấy, chỉ có vài vùng da khô",
      "Da khô, kích ứng, cảm giác căng",
      "Lỗ chân lông to, nhiều mụn đầu đen hoặc đốm trắng",
      "Mịn màng, lỗ chân lông nhỏ",
      "Nếp nhăn rõ rệt, da khô",
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
    question: "Da của bạn có dễ gặp phải các vấn đề về thâm, hay đỏ rát không?",
    options: [
      "Chỉ ở vùng chữ T (trán, mũi, cằm)",
      "Hơi đỏ, không đều về độ ẩm",
      "Thường xuyên gặp các vấn đề này",
      "Đôi khi",
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
    question:
      "Điều gì là quan trọng nhất với bạn khi lựa chọn một sản phẩm chăm sóc da?",
    options: [
      "Giảm bóng dầu nhưng vẫn dưỡng ẩm tốt",
      "Nuôi dưỡng sâu và làm dịu da",
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
    question: "Da của bạn có dễ hình thành các vết hằn và nếp nhăn không?",
    options: [
      "Một vài vết hằn do khô da",
      "Có nếp nhăn quanh mắt hoặc khóe miệng",
      "Hầu như không có nếp nhăn",
      "Lão hóa chậm, ít nếp nhăn",
    ],
    skinType: ["Da khô", "Da khô và lão hóa", "Da dầu", "Da hỗn hợp"],
  },
  {
    id: 7,
    question: "Da mặt bạn đã thay đổi như thế nào trong 5 năm qua?",
    options: [
      "Bóng dầu hơn ở vùng chữ T",
      "Dễ bong tróc, cảm giác căng",
      "Nhiều khuyết điểm hơn",
      "Vẫn dễ chăm sóc, tình trạng tốt",
      "Mỏng hơn, kém đàn hồi, thêm nếp nhăn",
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
    question: "Giới tính của bạn là?",
    options: ["Nam", "Nữ"],
    skinType: [],
  },
  {
    id: 9,
    question: "Độ tuổi của bạn là?",
    options: ["Dưới 25", "Từ 25 đến 40", "Từ 40 đến 50", "Trên 50"],
    skinType: [],
  },
];

export function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [skinTypeCount, setSkinTypeCount] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const selectedIndex =
      questions[currentQuestion].options.indexOf(selectedAnswer);
    const selectedSkinType = questions[currentQuestion].skinType[selectedIndex];

    setSkinTypeCount((prev) => ({
      ...prev,
      [selectedSkinType]: (prev[selectedSkinType] || 0) + 1,
    }));

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSkinTypeCount({});
    setShowResults(false);
  };

  const mostCommonSkinType = showResults
    ? Object.keys(skinTypeCount).reduce((a, b) =>
        skinTypeCount[a] > skinTypeCount[b] ? a : b
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-[80%] max-w-4xl shadow-xl">
        {showResults ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-6">
              Kết quả kiểm tra da
            </h2>
            <p className="text-xl text-center mb-6">
              Loại da của bạn là: <strong>{mostCommonSkinType}</strong>
            </p>
            <button
              onClick={handleRestartQuiz}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Làm lại
            </button>
          </>
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
                ? "Hoàn thành"
                : "Câu tiếp theo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
