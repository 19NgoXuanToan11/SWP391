import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Empty,
  Modal,
  Card,
  Collapse,
  Avatar,
  Tooltip,
  Badge,
  Timeline,
  Skeleton,
} from "antd";
import {
  FileTextOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SkinOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TagsOutlined,
  FireOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const QuizHistoryPage = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQuizDetail, setCurrentQuizDetail] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Hàm chuyển đổi từ mã vấn đề da sang tên hiển thị tiếng Việt
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

  useEffect(() => {
    // Lấy lịch sử trắc nghiệm từ localStorage
    const fetchQuizHistory = () => {
      const savedHistory = localStorage.getItem("quizHistory");
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setQuizHistory(parsedHistory);
        } catch (error) {
          console.error("Error parsing quiz history:", error);
          setQuizHistory([]);
        }
      }

      // Lấy danh sách câu hỏi từ localStorage (nếu có)
      const savedQuestions = localStorage.getItem("quizQuestions");
      if (savedQuestions) {
        try {
          setQuizQuestions(JSON.parse(savedQuestions));
        } catch (error) {
          console.error("Error parsing quiz questions:", error);
        }
      }

      // Simulate loading for smooth experience
      setTimeout(() => setLoading(false), 600);
    };

    fetchQuizHistory();
  }, []);

  // Hàm hiển thị chi tiết bài trắc nghiệm
  const showQuizDetail = (record) => {
    setCurrentQuizDetail(record);
    setModalVisible(true);
  };

  // Hàm format câu trả lời để hiển thị
  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "Không có câu trả lời";
      return answer.join(", ");
    }
    return answer?.toString() || "Không có câu trả lời";
  };

  // Định nghĩa các loại da và màu sắc tương ứng
  const skinTypeColors = {
    "Da khô": "orange",
    "Da dầu": "cyan",
    "Da hỗn hợp": "purple",
    "Da nhạy cảm": "magenta",
  };

  const getSkinTypeColor = (skinType) => {
    return skinTypeColors[skinType] || "pink";
  };

  // Columns for the table
  const columns = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <CalendarOutlined />
          <span>Ngày làm</span>
        </div>
      ),
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => (
        <div className="flex items-center">
          <div className="flex flex-col justify-center">
            <span className="text-base font-medium">
              {moment(timestamp).format("DD/MM/YYYY")}
            </span>
            <span className="text-xs text-gray-500">
              {moment(timestamp).format("HH:mm")}
            </span>
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      defaultSortOrder: "descend",
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <SkinOutlined />
          <span>Loại da</span>
        </div>
      ),
      dataIndex: "skinType",
      key: "skinType",
      render: (skinType) => (
        <div className="flex justify-center">
          <Tag
            color={getSkinTypeColor(skinType)}
            className="px-3 py-1 rounded-md text-sm font-medium"
          >
            {skinType || "Chưa xác định"}
          </Tag>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TagsOutlined />
          <span>Vấn đề da</span>
        </div>
      ),
      dataIndex: "concerns",
      key: "concerns",
      render: (concerns) => (
        <div className="flex flex-wrap gap-1">
          {concerns && concerns.length > 0 ? (
            concerns.map((concern, index) => (
              <Tooltip title={translateSkinConcern(concern)} key={index}>
                <Tag color="purple" className="m-1 rounded-md text-xs">
                  {translateSkinConcern(concern)}
                </Tag>
              </Tooltip>
            ))
          ) : (
            <Text type="secondary" italic>
              Không có
            </Text>
          )}
        </div>
      ),
    },
    {
      render: (_, record) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => showQuizDetail(record)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <EyeOutlined />
            <span className="font-semibold">Chi tiết</span>
          </button>
        </div>
      ),
    },
  ];

  // Cập nhật hàm getQuestionText để lấy nội dung câu hỏi thực tế
  const getQuestionText = (questionIndex, quizItem) => {
    // Nếu bài trắc nghiệm có lưu trữ câu hỏi riêng, ưu tiên sử dụng
    if (
      quizItem?.questions &&
      quizItem.questions[questionIndex] &&
      quizItem.questions[questionIndex].text
    ) {
      return quizItem.questions[questionIndex].text;
    }

    // Mảng các câu hỏi cố định từ quizPage nếu không có dữ liệu lưu trữ
    const questionTexts = [
      "Làn da của bạn cảm thấy như thế nào vào cuối ngày?",
      "Khi rửa mặt xong, làn da của bạn cảm thấy như thế nào?",
      "Lỗ chân lông của bạn như thế nào?",
      "Bạn thường gặp vấn đề gì với làn da?",
      "Làn da của bạn phản ứng thế nào với ánh nắng mặt trời?",
      "Bạn có thấy nếp nhăn hoặc dấu hiệu lão hóa không?",
      "Bạn thuộc giới tính nào?",
      "Độ tuổi của bạn?",
      "Bạn có gặp vấn đề nào sau đây không? (Có thể chọn nhiều)",
    ];

    // Nếu có dữ liệu từ quizQuestions chung, sử dụng làm fallback
    if (
      quizQuestions &&
      quizQuestions[questionIndex] &&
      quizQuestions[questionIndex].text
    ) {
      return quizQuestions[questionIndex].text;
    }

    // Nếu có dữ liệu trong mảng cố định thì sử dụng
    if (questionIndex < questionTexts.length) {
      return questionTexts[questionIndex];
    }

    // Trường hợp không có dữ liệu, trả về tên chung
    return `Câu hỏi ${questionIndex + 1}`;
  };

  // Lấy options của câu hỏi nếu có
  const getQuestionOptions = (questionIndex, quizItem) => {
    // Nếu bài trắc nghiệm có lưu trữ options riêng, ưu tiên sử dụng
    if (
      quizItem?.questions &&
      quizItem.questions[questionIndex] &&
      quizItem.questions[questionIndex].options
    ) {
      return quizItem.questions[questionIndex].options;
    }

    // Mảng các tùy chọn cố định từ quizPage
    const allOptions = [
      [
        "Căng và khô, đôi khi có vảy",
        "Bóng dầu ở vùng chữ T (trán, mũi, cằm), các vùng khác bình thường",
        "Rất bóng dầu ở khắp mặt",
        "Dễ bị đỏ, ngứa hoặc kích ứng",
      ],
      [
        "Căng, khô và thiếu độ ẩm",
        "Sạch và thoải mái, sau vài giờ vùng chữ T bắt đầu bóng dầu",
        "Sạch nhưng nhanh chóng trở nên bóng dầu trở lại",
        "Khô, đỏ hoặc kích ứng",
      ],
      [
        "Hầu như không nhìn thấy",
        "To ở vùng chữ T, nhỏ ở má và các vùng khác",
        "To và dễ thấy trên khắp khuôn mặt",
        "Kích thước thay đổi, đôi khi đỏ xung quanh",
      ],
      [
        "Da khô, bong tróc, thiếu độ ẩm",
        "Da dầu ở vùng chữ T, đôi khi có mụn",
        "Mụn, mụn đầu đen, da bóng dầu",
        "Da dễ bị đỏ, ngứa, kích ứng với sản phẩm mới",
      ],
      [
        "Dễ bị cháy nắng, hiếm khi rám nắng",
        "Đôi khi cháy nắng, sau đó chuyển sang rám nắng",
        "Hiếm khi cháy nắng, dễ rám nắng",
        "Rất dễ bị cháy nắng và kích ứng",
      ],
      [
        "Có, đặc biệt là khi da khô",
        "Chủ yếu ở vùng mắt và trán",
        "Không nhiều, da thường căng mọng",
        "Có nếp nhăn và da thường đỏ",
      ],
      ["Nam", "Nữ", "Khác"],
      ["Dưới 18", "18-24", "25-34", "35-44", "45-54", "Trên 55"],
      [
        "Mụn và mụn đầu đen",
        "Đốm thâm và nám",
        "Nếp nhăn và dấu hiệu lão hóa",
        "Da xỉn màu, thiếu sức sống",
        "Lỗ chân lông to",
        "Da đỏ và kích ứng",
      ],
    ];

    // Fallback dùng quizQuestions chung
    if (quizQuestions && quizQuestions[questionIndex]) {
      return quizQuestions[questionIndex].options || [];
    }

    // Sử dụng dữ liệu cố định nếu có
    if (questionIndex < allOptions.length) {
      return allOptions[questionIndex];
    }

    return [];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with clean white background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-pink-500 mr-3">
              <HistoryOutlined className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lịch sử trắc nghiệm
              </h1>
              <p className="text-sm text-gray-500">
                Xem lại kết quả phân tích làn da của bạn
              </p>
            </div>
          </div>
          <Link to="/quiz">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-pink-500 rounded-lg shadow-sm hover:bg-pink-600 transition-colors"
            >
              <ArrowRightOutlined />
              <span className="font-semibold">Làm trắc nghiệm mới</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content with clean white background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : quizHistory.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={columns}
                dataSource={quizHistory}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  hideOnSinglePage: true,
                  position: ["bottomCenter"],
                }}
                className="custom-table"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-6">
              <ExclamationCircleOutlined className="text-3xl text-pink-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Chưa có bài trắc nghiệm nào
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thực hiện trắc nghiệm để nhận kết quả phân tích làn da chi
              tiết
            </p>
            <Link to="/quiz">
              <button
                type="button"
                className="px-5 py-2.5 text-white bg-pink-500 rounded-lg shadow-sm hover:bg-pink-600 transition-colors font-medium"
              >
                Bắt đầu trắc nghiệm ngay
              </button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Modal Chi tiết */}
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={720}
        className="rounded-lg overflow-hidden"
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        centered
      >
        {currentQuizDetail && (
          <div>
            {/* Modal Header - Clean white with simple pink accent */}
            <div className="bg-white border-b border-gray-100 text-gray-900 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-pink-100 p-2 rounded-lg mr-3">
                    <FileTextOutlined className="text-lg text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Chi tiết bài trắc nghiệm
                  </h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Thực hiện vào{" "}
                {moment(currentQuizDetail.timestamp).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>

            {/* Modal Content - Clean white design */}
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <UserOutlined className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Loại da của bạn</p>
                      <h4 className="text-lg font-bold">
                        {currentQuizDetail.skinType}
                      </h4>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-purple-50 p-3 rounded-lg mr-4">
                      <TagsOutlined className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        Số vấn đề da phát hiện
                      </p>
                      <h4 className="text-lg font-bold">
                        {currentQuizDetail.concerns?.length || 0} vấn đề
                      </h4>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Concerns */}
              {currentQuizDetail.concerns &&
                currentQuizDetail.concerns.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="w-1 h-4 bg-pink-500 rounded mr-2"></div>
                      <h4 className="text-base font-medium">
                        Vấn đề da cần quan tâm
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentQuizDetail.concerns.map((concern, index) => (
                        <Tag
                          key={index}
                          color="pink"
                          className="px-3 py-1.5 rounded-md text-sm"
                        >
                          {translateSkinConcern(concern)}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

              {/* Answers Timeline */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-4 bg-pink-500 rounded mr-2"></div>
                  <h4 className="text-base font-medium">
                    Chi tiết câu trả lời
                  </h4>
                </div>

                {(() => {
                  const answers =
                    currentQuizDetail.answers &&
                    typeof currentQuizDetail.answers === "object"
                      ? currentQuizDetail.answers
                      : {};

                  if (Object.keys(answers).length === 0) {
                    return (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Text type="secondary">
                          Không có dữ liệu câu trả lời
                        </Text>
                      </div>
                    );
                  }

                  return (
                    <Timeline className="px-2">
                      {Object.entries(answers).map(([index, answer], i) => {
                        const questionIndex = parseInt(index);
                        const questionText = getQuestionText(
                          questionIndex,
                          currentQuizDetail
                        );

                        // Format answer
                        let displayAnswer = answer;
                        const options = getQuestionOptions(
                          questionIndex,
                          currentQuizDetail
                        );

                        if (Array.isArray(answer)) {
                          displayAnswer = answer
                            .map((ans) => {
                              const optionIndex = parseInt(ans);
                              return isNaN(optionIndex)
                                ? ans
                                : options[optionIndex] || ans;
                            })
                            .join(", ");
                        } else if (
                          options.length > 0 &&
                          !isNaN(parseInt(answer))
                        ) {
                          const optionIndex = parseInt(answer);
                          displayAnswer = options[optionIndex] || answer;
                        }

                        return (
                          <Timeline.Item
                            key={i}
                            color="pink"
                            dot={
                              <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {questionIndex + 1}
                              </div>
                            }
                          >
                            <Card
                              className="rounded-lg shadow-sm mb-4 border border-gray-100"
                              bodyStyle={{ padding: "12px 16px" }}
                            >
                              <h5 className="font-medium mb-2">
                                {questionText}
                              </h5>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <Text className="text-gray-700">
                                  {displayAnswer}
                                </Text>
                              </div>
                            </Card>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer - Clean white */}
            <div className="bg-white p-4 flex justify-end space-x-3 border-t border-gray-100">
              <button
                onClick={() => setModalVisible(false)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-800 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                <span className="font-semibold">Đóng</span>
              </button>
              <Link
                to="/quiz-results"
                state={{
                  results: {
                    skinType: currentQuizDetail?.skinType,
                    concerns: currentQuizDetail?.concerns,
                  },
                }}
              >
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="font-semibold">Xem kết quả đầy đủ</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-table .ant-table {
          border-radius: 0;
        }

        .custom-table .ant-table-thead > tr > th {
          background-color: #fff;
          color: #374151;
          font-weight: 600;
          border-bottom: 1px solid #f3f4f6;
          padding: 12px 16px;
        }

        .custom-table .ant-table-tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .custom-table .ant-pagination {
          margin: 16px 0;
        }

        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(249, 168, 212, 0.1);
        }
      `}</style>
    </div>
  );
};

export default QuizHistoryPage;
