import React, { useState } from "react";
import model from "../../assets/pictures/model.jpg";

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Dublin"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 4,
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Dublin"],
    correctAnswer: "Paris",
  },
  {
    id: 5,
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Dublin"],
    correctAnswer: "Paris",
  },
]
export function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6">Quiz Results</h2>
          <p className="text-xl text-center mb-6">
            You scored {score} out of {questions.length}!
          </p>
          <button
            onClick={handleRestartQuiz}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-500">Score: {score}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{questions[currentQuestion].question}</h2>

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
          {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
}
