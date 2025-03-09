import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Divider,
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
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { QRCode } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PaymentSteps } from "../../components/PaymentStep";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("qr");
  const [isProcessing, setIsProcessing] = useState(false);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Nếu không có orderId, điều hướng về trang cart
    if (!orderId) {
      navigate("/cart");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7285/api/order/${orderId}`
        );
        console.log("Order data:", res.data);

        // If order details don't have images, you might need to fetch them separately
        const orderData = res.data;

        // Check if we need to fetch product images separately
        if (
          orderData.orderDetails &&
          orderData.orderDetails.length > 0 &&
          !orderData.orderDetails[0].image
        ) {
          console.log("Fetching product images for order details");

          // Fetch product details for each item in the order to get images
          const updatedOrderDetails = await Promise.all(
            orderData.orderDetails.map(async (item) => {
              try {
                // Fetch product details to get the image
                const productRes = await axios.get(
                  `https://localhost:7285/api/product/${item.productId}`
                );

                // Add image URL and product name to the order detail item
                return {
                  ...item,
                  productName:
                    productRes.data.productName || "Sản phẩm không xác định",
                  image:
                    productRes.data.image ||
                    productRes.data.imageUrls ||
                    `https://localhost:7285/api/product/image/${item.productId}`,
                };
              } catch (error) {
                console.error(
                  `Error fetching product ${item.productId}:`,
                  error
                );
                // Return the original item if fetch fails
                return item;
              }
            })
          );

          // Update the order data with the product images
          orderData.orderDetails = updatedOrderDetails;
        }

        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        message.error("Không thể tải thông tin đơn hàng");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // const payOSConfig = {
  //   RETURN_URL: "", // required
  //   ELEMENT_ID: "", // required
  //   CHECKOUT_URL: "", // required
  //   embedded: true, // Nếu dùng giao diện nhúng
  //   onSuccess: (event) => {
  //     //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
  //   },
  //   onCancel: (event) => {
  //     //TODO: Hành động sau khi người dùng Hủy đơn hàng
  //   },
  //   onExit: (event) => {
  //     //TODO: Hành động sau khi người dùng tắt Pop up
  //   },
  // };
  const paymentMethods = [
    {
      value: "qr",
      label: "Thanh Toán Qua Mã QR",
      icon: <QrcodeOutlined />,
      description: "Thanh toán nhanh chóng qua ứng dụng ngân hàng",
      image: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
    },
  ];

  const paymentPartners = [
    {
      name: "VNPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png",
    },
    {
      name: "MoMo",
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    },
    {
      name: "ZaloPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay.png",
    },
    {
      name: "Banking",
      logo: "https://cdn-icons-png.flaticon.com/512/2168/2168742.png",
    },
  ];

  const handlePayment = async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login", { state: { from: "/payment" } });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        buyerName: "Tên Khách Hàng",
        buyerEmail: "email@example.com",
        buyerPhone: "0987654321",
        buyerAddress: "Địa chỉ khách hàng",
        orderId: orderId,
        UserId: Number(user.id),
        paymentMethod: selectedPayment,
      };

      const response = await axios.post(
        "https://localhost:7285/Payment/create",
        orderData
      );

      console.log(response.data);
      if (response.data && response.data.data) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        message.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
      }
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
        <PaymentSteps current={1} />

        <button
          type="button"
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white hover:bg-pink-50 
              text-gray-600 hover:text-pink-500 font-medium transition-all duration-300
              shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeftOutlined className="text-lg" />
          <span>Quay lại giỏ hàng</span>
        </button>

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
                  {order?.orderDetails.map((item) => (
                    <div
                      key={item.orderDetailId || item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.productName || "Sản phẩm"}
                          width={80}
                          height={80}
                          className="rounded-xl object-cover"
                          preview={false}
                          fallback="https://placehold.co/80x80/pink/white?text=BeautyCare"
                        />
                        <div>
                          <Text strong className="text-lg">
                            {item.productName || "Sản phẩm"}
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
                      {formatPrice(order?.totalAmount)}
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
                            <div className="font-medium">{method.label}</div>
                            <Text type="secondary" className="text-sm">
                              {method.description}
                            </Text>
                          </div>
                          <Image
                            src={method.image}
                            alt={method.label}
                            width={40}
                            preview={false}
                            className="ml-auto"
                          />
                        </Space>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>

                <div className="mt-4 mb-4 p-3 bg-gray-50 rounded-xl flex items-center">
                  <Image
                    src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png"
                    alt="Secure Payment"
                    width={30}
                    preview={false}
                  />
                  <Text className="ml-2 text-sm text-gray-600">
                    Thanh toán an toàn với mã hóa SSL 256-bit
                  </Text>
                </div>

                <div className="mt-6">
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={isProcessing}
                    onClick={handlePayment}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-12 text-lg"
                    style={{
                      background: "linear-gradient(to right, #ec4899, #a855f7)",
                      borderColor: "transparent",
                    }}
                  >
                    {isProcessing ? "Đang Xử Lý..." : "Thanh Toán Ngay"}
                  </Button>
                </div>
              </Card>

              <Card
                className="bg-gradient-to-r from-pink-50 to-purple-50"
                bordered={false}
              >
                <Space direction="vertical" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text>Mã Đơn Hàng:</Text>
                    <Tag color="pink">{order?.orderId}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text>Trạng Thái:</Text>
                    <Tag color="processing">{order?.status}</Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider>
            <Text type="secondary">Đối tác thanh toán</Text>
          </Divider>

          <div className="flex justify-center items-center flex-wrap gap-6 mt-4 mb-2">
            {paymentPartners.map((partner) => (
              <div key={partner.name} className="text-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={60}
                  preview={false}
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
                <Text className="block text-xs text-gray-500 mt-1">
                  {partner.name}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default React.memo(PaymentPage);
