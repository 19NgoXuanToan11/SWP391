import React, { useState } from "react";
import {
  Card,
  Steps,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Image,
  message,
  Radio,
  Tooltip,
  Spin,
} from "antd";
import {
  QrcodeOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { QRCode } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text, Paragraph } = Typography;

export function PaymentPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("qr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dữ liệu mẫu
  const orderDetails = {
    orderId: "ORD-2024-001",
    totalAmount: 1200000, // Changed to VND
    items: [
      {
        id: 1,
        name: "Kem Nền Hoàn Hảo",
        price: 850000, // Changed to VND
        quantity: 1,
        image: "https://source.unsplash.com/random/100x100/?cosmetics",
      },
      {
        id: 2,
        name: "Serum Dưỡng Ẩm",
        price: 350000, // Changed to VND
        quantity: 1,
        image: "https://source.unsplash.com/random/100x100/?serum",
      },
    ],
  };

  const paymentMethods = [
    {
      value: "qr",
      label: "Thanh Toán Qua Mã QR",
      icon: <QrcodeOutlined />,
      description: "Thanh toán nhanh chóng qua ứng dụng ngân hàng",
    },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPaymentSuccess(true);
      message.success("Thanh toán thành công!");
    } catch (error) {
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePayNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/qr-payment" } });
      return;
    }
    navigate("/qr-payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl rounded-3xl overflow-hidden">
          <div className="text-center mb-8">
            <Title
              level={2}
              className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            >
              Thanh Toán Đơn Hàng
            </Title>
            <Space align="center">
              <SafetyOutlined className="text-green-500" />
              <Text type="secondary">Thanh toán an toàn và bảo mật</Text>
            </Space>
          </div>

          <Row gutter={48}>
            <Col xs={24} lg={14}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined className="text-pink-500" />
                    <span>Chi Tiết Đơn Hàng</span>
                  </Space>
                }
                className="mb-6"
                bordered={false}
                bodyStyle={{ padding: "1.5rem" }}
              >
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-xl object-cover"
                          preview={false}
                        />
                        <div>
                          <Text strong className="text-lg">
                            {item.name}
                          </Text>
                          <div>
                            <Text type="secondary">
                              Số lượng: {item.quantity}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <Text strong className="text-lg text-pink-500">
                        {formatPrice(item.price)}
                      </Text>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg">
                      Tổng Thanh Toán
                    </Text>
                    <Title
                      level={3}
                      className="!mb-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                      {formatPrice(orderDetails.totalAmount)}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                title={
                  <Space>
                    <CreditCardOutlined className="text-pink-500" />
                    <span>Phương Thức Thanh Toán</span>
                  </Space>
                }
                className="mb-6"
                bordered={false}
                bodyStyle={{ padding: "1.5rem" }}
              >
                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircleOutlined className="text-4xl text-green-500" />
                    </div>
                    <Title level={4} className="!mb-2">
                      Thanh Toán Thành Công!
                    </Title>
                    <Paragraph type="secondary">
                      Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý
                      ngay lập tức.
                    </Paragraph>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}
                      size="large"
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500"
                      onClick={() => (window.location.href = "/orders")}
                    >
                      Xem Đơn Hàng
                    </Button>
                  </div>
                ) : (
                  <>
                    <Radio.Group
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      value={selectedPayment}
                      className="w-full"
                    >
                      <Space direction="vertical" className="w-full">
                        {paymentMethods.map((method) => (
                          <Radio
                            key={method.value}
                            value={method.value}
                            className="w-full p-4 border rounded-xl hover:border-pink-200 transition-all"
                          >
                            <Space>
                              <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500">
                                {method.icon}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {method.label}
                                </div>
                                <Text type="secondary" className="text-sm">
                                  {method.description}
                                </Text>
                              </div>
                            </Space>
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>

                    <div className="mt-6">
                      <Button
                        type="primary"
                        size="large"
                        block
                        loading={isProcessing}
                        onClick={handlePayNow}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-12 text-lg"
                        style={{
                          background:
                            "linear-gradient(to right, #ec4899, #a855f7)",
                          borderColor: "transparent",
                        }}
                      >
                        {isProcessing ? "Đang Xử Lý..." : "Thanh Toán Ngay"}
                      </Button>

                      <Button
                        type="link"
                        block
                        className="mt-2 text-gray-500 hover:text-pink-500"
                      >
                        Hủy Thanh Toán
                      </Button>
                    </div>
                  </>
                )}
              </Card>

              <Card
                className="bg-gradient-to-r from-pink-50 to-purple-50"
                bordered={false}
              >
                <Space direction="vertical" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text>Mã Đơn Hàng:</Text>
                    <Tag color="pink">{orderDetails.orderId}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>Trạng Thái:</Text>
                    <Tag color={paymentSuccess ? "success" : "processing"}>
                      {paymentSuccess ? "Đã Thanh Toán" : "Đang Chờ"}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default React.memo(PaymentPage);
