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

  // Mock data
  const orderDetails = {
    orderId: "ORD-2024-001",
    totalAmount: 52,
    items: [
      {
        id: 1,
        name: "Perfect Glow Foundation",
        price: 37,
        quantity: 1,
        image: "https://source.unsplash.com/random/100x100/?cosmetics",
      },
      {
        id: 2,
        name: "Hydrating Serum",
        price: 15,
        quantity: 1,
        image: "https://source.unsplash.com/random/100x100/?serum",
      },
    ],
  };

  const paymentMethods = [
    {
      value: "qr",
      label: "QR Code Payment",
      icon: <QrcodeOutlined />,
      description: "Quick payment via banking app",
    },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPaymentSuccess(true);
      message.success("Payment successful!");
    } catch (error) {
      message.error("An error occurred. Please try again!");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
              Order Payment
            </Title>
            <Space align="center">
              <SafetyOutlined className="text-green-500" />
              <Text type="secondary">Safe & Secure Payment</Text>
            </Space>
          </div>

          <Row gutter={48}>
            <Col xs={24} lg={14}>
              <Card
                title={
                  <Space>
                    <ShoppingOutlined className="text-pink-500" />
                    <span>Order Details</span>
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
                              Quantity: {item.quantity}
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
                      Total Payment
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
                    <span>Payment Method</span>
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
                      Payment Successful!
                    </Title>
                    <Paragraph type="secondary">
                      Thank you for your purchase. Your order will be processed
                      immediately.
                    </Paragraph>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}
                      size="large"
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500"
                      onClick={() => (window.location.href = "/orders")}
                    >
                      View Orders
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
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </Button>

                      <Button
                        type="link"
                        block
                        className="mt-2 text-gray-500 hover:text-pink-500"
                      >
                        Cancel Payment
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
                    <Text>Order ID:</Text>
                    <Tag color="pink">{orderDetails.orderId}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>Status:</Text>
                    <Tag color={paymentSuccess ? "success" : "processing"}>
                      {paymentSuccess ? "Paid" : "Pending"}
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
