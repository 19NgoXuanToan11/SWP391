import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Divider, Timeline, Typography, Row, Col } from "antd";
import {
  SwapOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

export default function ReturnPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const returnSteps = [
    {
      title: "Liên hệ với chúng tôi",
      description:
        "Khách hàng cần liên hệ qua hotline: 0786485999 hoặc email: toannxse171297@fpt.edu.vn trong vòng 48 giờ sau khi nhận hàng để thông báo về việc trả/đổi sản phẩm.",
      icon: <PhoneOutlined style={{ color: "#ff4d6d" }} />,
    },
    {
      title: "Cung cấp thông tin",
      description:
        "Cung cấp mã đơn hàng, lý do trả/đổi, và hình ảnh sản phẩm (nếu bị lỗi).",
      icon: <FileProtectOutlined style={{ color: "#ff4d6d" }} />,
    },
    {
      title: "Chờ xét duyệt",
      description:
        "Yêu cầu của bạn sẽ được xem xét và phản hồi trong vòng 24 giờ làm việc.",
      icon: <ClockCircleOutlined style={{ color: "#ff4d6d" }} />,
    },
    {
      title: "Gửi trả sản phẩm",
      description:
        "Đóng gói sản phẩm theo hướng dẫn và gửi về địa chỉ được cung cấp.",
      icon: <SwapOutlined style={{ color: "#ff4d6d" }} />,
    },
    {
      title: "Nhận sản phẩm mới/hoàn tiền",
      description:
        "Sau khi kiểm tra hàng trả về, bạn sẽ nhận sản phẩm mới hoặc được hoàn tiền theo phương thức thanh toán ban đầu.",
      icon: <CheckCircleOutlined style={{ color: "#ff4d6d" }} />,
    },
  ];

  const faqItems = [
    {
      question: "Mất bao lâu để nhận lại tiền?",
      answer:
        "Thời gian hoàn tiền từ 3-7 ngày làm việc tùy phương thức thanh toán.",
    },
    {
      question: "Ai chịu phí vận chuyển khi đổi trả?",
      answer:
        "Nếu lỗi thuộc về sản phẩm, chúng tôi sẽ chịu phí vận chuyển hai chiều.",
    },
    {
      question: "Có thể đổi sang sản phẩm khác không?",
      answer:
        "Có, bạn có thể đổi sang sản phẩm khác có giá trị tương đương hoặc cao hơn (thanh toán thêm phần chênh lệch).",
    },
    {
      question: "Làm thế nào để theo dõi tình trạng đổi trả?",
      answer:
        "Bạn có thể theo dõi bằng cách liên hệ trực tiếp với bộ phận CSKH qua hotline hoặc email đã đăng ký.",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Title
            level={1}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              background: "linear-gradient(to right, #ff4d6d, #a64dff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chính Sách Trả Đổi Hàng
          </Title>
          <Paragraph className="text-gray-600 text-lg max-w-3xl mx-auto">
            Beauty & Care cam kết đảm bảo sự hài lòng của khách hàng với những
            sản phẩm chất lượng cao. Chúng tôi hiểu rằng đôi khi sản phẩm có thể
            không phù hợp hoặc gặp vấn đề, vì vậy chúng tôi đã thiết lập chính
            sách trả đổi hàng rõ ràng và thuận tiện.
          </Paragraph>
        </motion.div>

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card
            className="bg-gradient-to-r from-pink-50 to-purple-50 border-none shadow-md rounded-2xl overflow-hidden"
            bordered={false}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 p-4">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
                  <InfoCircleOutlined
                    style={{ fontSize: 36, color: "#ff4d6d" }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <Title level={4} className="text-center md:text-left">
                  Cam Kết Của Chúng Tôi
                </Title>
                <Paragraph className="text-gray-600">
                  Beauty & Care luôn đặt sự hài lòng của khách hàng lên hàng
                  đầu. Chính sách đổi trả của chúng tôi được thiết kế để đảm bảo
                  bạn hoàn toàn hài lòng với mọi sản phẩm mua từ chúng tôi. Nếu
                  có bất kỳ vấn đề gì, đội ngũ chăm sóc khách hàng của chúng tôi
                  luôn sẵn sàng hỗ trợ bạn.
                </Paragraph>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Eligibility Cards */}
        <Row gutter={[24, 24]} className="mb-16">
          {/* Điều kiện đổi trả */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                className="h-full shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                title={
                  <div className="flex items-center space-x-3">
                    <CheckCircleOutlined className="text-green-500 text-xl" />
                    <span className="text-lg font-semibold">
                      Điều Kiện Đổi Trả
                    </span>
                  </div>
                }
                headStyle={{ borderBottom: "2px solid #fef6f7" }}
                bodyStyle={{ padding: "24px" }}
              >
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircleOutlined className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Sản phẩm còn nguyên tem, nhãn mác, bao bì</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleOutlined className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      Sản phẩm chưa qua sử dụng hoặc chỉ sử dụng thử nhẹ
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleOutlined className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      Yêu cầu đổi trả được gửi trong vòng 48 giờ sau khi nhận
                      hàng
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleOutlined className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Có hóa đơn mua hàng hoặc mã đơn hàng</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </Col>

          {/* Trường hợp không áp dụng */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className="h-full shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                title={
                  <div className="flex items-center space-x-3">
                    <ExclamationCircleOutlined className="text-red-500 text-xl" />
                    <span className="text-lg font-semibold">
                      Không Áp Dụng Đổi Trả
                    </span>
                  </div>
                }
                headStyle={{ borderBottom: "2px solid #fef6f7" }}
                bodyStyle={{ padding: "24px" }}
              >
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <ExclamationCircleOutlined className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Sản phẩm đã qua sử dụng nhiều lần</span>
                  </li>
                  <li className="flex items-start">
                    <ExclamationCircleOutlined className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      Sản phẩm không còn nguyên vẹn bao bì, tem, nhãn mác
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ExclamationCircleOutlined className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      Sản phẩm đã hết hạn bảo hành hoặc thời gian đổi trả
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ExclamationCircleOutlined className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span>
                      Các sản phẩm khuyến mãi, giảm giá đặc biệt (có ghi chú
                      không áp dụng đổi trả)
                    </span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Return Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-lg mb-16"
        >
          <Title level={2} className="text-center mb-10">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Quy Trình Đổi Trả Sản Phẩm
            </span>
          </Title>
          <Timeline
            mode="alternate"
            items={returnSteps.map((step, index) => ({
              color: "#ff4d6d",
              children: (
                <div
                  className={`p-4 rounded-xl ${
                    index % 2 === 0 ? "bg-pink-50" : "bg-purple-50"
                  }`}
                >
                  <h3 className="font-medium text-lg">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                </div>
              ),
              dot: step.icon,
            }))}
          />
        </motion.div>
      </div>
    </div>
  );
}
