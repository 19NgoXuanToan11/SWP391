import React from "react";
<<<<<<< Updated upstream
import { Card, Image, Typography, Button, Space, Spin } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import qrImage from "../../assets/pictures/qr.png";
import { PaymentSteps } from "../../components/PaymentStep";

const { Title, Text, Paragraph } = Typography;

function QRPaymentPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePaymentComplete = () => {
    setIsLoading(true);
    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setIsLoading(false);
      navigate("/order-success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <PaymentSteps current={1} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            type="button"
            className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white hover:bg-pink-50 
              text-gray-600 hover:text-pink-500 font-medium transition-all duration-300
              shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
            onClick={() => navigate("/payment")}
          >
            <ArrowLeftOutlined className="text-lg" />
            <span>Quay lại</span>
          </button>

          <Card className="shadow-xl rounded-3xl overflow-hidden border-0">
            <div className="text-left">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Title
                  level={3}
                  className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  Quét Mã QR Để Thanh Toán
                </Title>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={qrImage}
                      alt="QR Code"
                      width={420}
                      preview={false}
                      className="rounded-2xl shadow-lg border-8 border-white"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 rounded-2xl" />
                  </motion.div>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl">
                    <Text type="secondary" className="block text-sm">
                      Số tiền cần thanh toán
                    </Text>
                    <Text strong className="text-2xl text-pink-500">
                      395,000 VNĐ
                    </Text>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 rounded-2xl">
                    <Title level={4} className="flex items-center gap-2 mb-4">
                      <BankOutlined className="text-pink-500" />
                      Hướng dẫn thanh toán
                    </Title>
                    <ol className="list-decimal pl-4 space-y-3 text-gray-600">
                      <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                      <li>Chọn tính năng quét mã QR</li>
                      <li>Quét mã và kiểm tra thông tin</li>
                      <li>Xác nhận thanh toán</li>
                    </ol>
                  </Card>

                  <button
                    type="button"
                    onClick={() => navigate("/order-success")}
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 
                      text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                      hover:from-pink-600 hover:to-purple-600 disabled:opacity-70 disabled:cursor-not-allowed
                      transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                      backdrop-blur-sm"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin">
                          <LoadingOutlined />
                        </span>
                        Đang xác nhận thanh toán...
                      </>
                    ) : (
                      <>
                        <CheckCircleOutlined className="text-xl" />
                        Xác nhận đã thanh toán
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <Paragraph type="secondary" className="text-sm">
              Thanh toán an toàn và bảo mật bởi BeautyCare
            </Paragraph>
          </div>
        </motion.div>
=======
import { Card, Image } from "antd";
import qrImage from "../../assets/pictures/qr.png";

function QRPaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <div className="text-center">
            <Image
              src={qrImage}
              alt="QR Code"
              width={300}
              preview={false}
              className="rounded-lg"
            />
          </div>
        </Card>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}

export default QRPaymentPage;
