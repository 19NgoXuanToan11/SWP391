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
  Form,
  Input,
  Modal,
  Select,
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
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  DownOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { QRCode } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../components/auth/useAuth";
import { PaymentSteps } from "../../../components/payment-step/PaymentStep";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("qr");
  const [isProcessing, setIsProcessing] = useState(false);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [form] = Form.useForm();

  // State để lưu trữ địa chỉ đã lưu của người dùng
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  // Hàm lấy địa chỉ đã lưu từ localStorage
  const loadSavedAddresses = () => {
    const userId = user?.id;
    if (!userId) return [];

    try {
      const savedAddressesStr = localStorage.getItem(
        `user_addresses_${userId}`
      );
      if (savedAddressesStr) {
        const addresses = JSON.parse(savedAddressesStr);
        setSavedAddresses(addresses);

        // Nếu có địa chỉ đã lưu, tự động chọn địa chỉ đầu tiên
        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
          // Cập nhật form với thông tin địa chỉ đã lưu
          form.setFieldsValue({
            name: addresses[0].name,
            address: addresses[0].address,
            phone: addresses[0].phone,
            email: addresses[0].email,
          });
        }

        return addresses;
      }
    } catch (error) {
      console.error("Error loading saved addresses:", error);
    }
    return [];
  };

  // Hàm lưu địa chỉ mới vào localStorage
  const saveAddress = (addressInfo) => {
    const userId = user?.id;
    if (!userId) return;

    // Kiểm tra xem có đủ thông tin địa chỉ không
    if (
      !addressInfo.name ||
      !addressInfo.phone ||
      !addressInfo.address ||
      !addressInfo.email
    ) {
      console.warn("Cannot save incomplete address information");
      return;
    }

    try {
      // Kiểm tra xem địa chỉ đã tồn tại chưa để tránh trùng lặp
      const existingAddresses = [...savedAddresses];
      const existingIndex = existingAddresses.findIndex(
        (addr) =>
          addr.phone === addressInfo.phone &&
          addr.address === addressInfo.address
      );

      if (existingIndex === -1) {
        // Nếu chưa có địa chỉ này, thêm vào danh sách
        const newAddresses = [...existingAddresses, addressInfo];
        localStorage.setItem(
          `user_addresses_${userId}`,
          JSON.stringify(newAddresses)
        );
        setSavedAddresses(newAddresses);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

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
        
        // Retrieve cart data from localStorage to get promotion information
        try {
          // Get order info from sessionStorage if available (set during checkout)
          const orderSessionData = sessionStorage.getItem(`order_info_${orderId}`);
          if (orderSessionData) {
            const parsedOrderData = JSON.parse(orderSessionData);
            console.log("Retrieved order info from sessionStorage:", parsedOrderData);
            // Update order data with promotion info from session storage
            if (parsedOrderData.promotionId && parsedOrderData.promotionDiscount) {
              orderData.promotionId = parsedOrderData.promotionId;
              orderData.promotionDiscount = parsedOrderData.promotionDiscount;
              orderData.subtotal = parsedOrderData.subtotal;
              // If the API subtotal doesn't match what we had in the cart,
              // ensure we use the correct one with the discount applied
              if (parsedOrderData.total && orderData.totalAmount !== parsedOrderData.total) {
                orderData.totalAmount = parsedOrderData.total;
              }
            }
          }
        } catch (sessionError) {
          console.error("Error retrieving order info from session:", sessionError);
        }

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

  // Load địa chỉ đã lưu khi component mount và khi user thay đổi
  useEffect(() => {
    if (isAuthenticated && user) {
      const addresses = loadSavedAddresses();

      // Nếu không có địa chỉ đã lưu, điền thông tin mặc định từ tài khoản người dùng
      if (!addresses || addresses.length === 0) {
        form.setFieldsValue({
          name: user.fullName || user.username || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          address: user.address || "",
        });
      }
    }
  }, [isAuthenticated, user, form]);

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

  const handlePayment = async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login", { state: { from: "/payment" } });
      return;
    }

    // Kiểm tra xem có thông tin địa chỉ không
    if (!selectedAddress && !form.getFieldValue("name")) {
      message.error("Vui lòng nhập thông tin địa chỉ giao hàng");
      return;
    }

    setIsProcessing(true);
    try {
      // Kiểm tra giỏ hàng xem có sản phẩm nào từ đơn hàng đã thanh toán không
      const hasItemsFromPaidOrders = cartItems.some(
        item => item.parentOrderStatus === "paid" || 
                item.parentOrderStatus === "Paid" || 
                item.parentOrderStatus === "delivered" ||
                item.parentOrderStatus === "completed"
      );
      
      if (hasItemsFromPaidOrders) {
        console.log("Giỏ hàng có chứa sản phẩm từ đơn hàng đã thanh toán");
        // Hiển thị thông báo cho người dùng
        Modal.confirm({
          title: "Xác nhận thanh toán",
          content: "Trong giỏ hàng của bạn có sản phẩm từ đơn hàng đã thanh toán trước đó. Bạn có muốn tiếp tục đặt hàng?",
          okText: "Tiếp tục thanh toán",
          cancelText: "Hủy",
          onOk: () => {
            // Tiếp tục xử lý thanh toán
            processPayment();
          },
          onCancel: () => {
            setIsProcessing(false);
            setLoading(false);
          }
        });
      } else {
        // Nếu không có sản phẩm từ đơn hàng đã thanh toán, tiếp tục bình thường
        processPayment();
      }
    } catch (error) {
      console.error("Payment check error:", error);
      message.error("Đã xảy ra lỗi khi kiểm tra đơn hàng. Vui lòng thử lại!");
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Tách xử lý thanh toán ra thành một hàm riêng để có thể gọi lại
  const processPayment = async () => {
    try {
      let buyerInfo = {
        name: "",
        email: "",
        phone: "",
        address: "",
      };

      // Nếu đang dùng địa chỉ đã lưu, sử dụng thông tin từ địa chỉ đó
      if (selectedAddress) {
        buyerInfo = {
          name: selectedAddress.name || "",
          email: selectedAddress.email || "",
          phone: selectedAddress.phone || "",
          address: selectedAddress.address || "",
        };
      } else {
        // Nếu không, validate form và lấy thông tin từ form
        try {
          await form.validateFields();
          const formValues = form.getFieldsValue();
          buyerInfo = {
            name: formValues.name || "",
            email: formValues.email || "",
            phone: formValues.phone || "",
            address: formValues.address || "",
          };

          // Lưu thông tin địa chỉ mới nếu đã điền đầy đủ
          if (
            buyerInfo.name &&
            buyerInfo.phone &&
            buyerInfo.address &&
            buyerInfo.email
          ) {
            saveAddress(buyerInfo);
          }
        } catch (validationError) {
          setIsProcessing(false);
          return; // Form validation will show the errors
        }
      }

      // Kiểm tra các trường bắt buộc
      if (
        !buyerInfo.name ||
        !buyerInfo.phone ||
        !buyerInfo.address ||
        !buyerInfo.email
      ) {
        message.error("Vui lòng điền đầy đủ thông tin giao hàng");
        setIsProcessing(false);
        return;
      }

      setLoading(true);

      // Cấu trúc dữ liệu chính xác cho API
      const orderData = {
        buyerName: buyerInfo.name,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        buyerAddress: buyerInfo.address,
        orderId: orderId,
        UserId: Number(user.id),
        paymentMethod: paymentMethod,
      };

      console.log("Final order data to be sent:", {
        orderId: orderData.orderId,
        UserId: orderData.UserId,
        buyerName: orderData.buyerName,
        buyerEmail: orderData.buyerEmail,
        buyerPhone: orderData.buyerPhone,
        buyerAddress: orderData.buyerAddress,
        paymentMethod: orderData.paymentMethod,
      });

      const response = await axios.post(
        "https://localhost:7285/Payment/create",
        orderData
      );

      console.log("API Response:", response.data);
      if (response.data && response.data.data) {
        message.success("Đơn hàng đã được xác nhận");
        window.location.href = response.data.data.paymentUrl;
      } else {
        message.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Payment error:", error);

      // Log the complete error response for debugging
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);

        if (error.response.data && error.response.data.errors) {
          // Display validation errors from the API
          const errors = error.response.data.errors;
          Object.entries(errors).forEach(([field, messages]) => {
            console.error(`Field ${field} errors:`, messages);
            messages.forEach((msg) => message.error(`${field}: ${msg}`));
          });
        } else if (error.response.data && error.response.data.message) {
          message.error(error.response.data.message);
        } else {
          message.error(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        message.error("Không nhận được phản hồi từ máy chủ");
      } else {
        console.error("Error message:", error.message);
        message.error(error.message || "Đã xảy ra lỗi khi xử lý đơn hàng");
      }
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Xử lý khi chọn địa chỉ đã lưu
  const handleAddressChange = (addressIndex) => {
    if (addressIndex === "new") {
      // Nếu chọn "Địa chỉ mới", reset form và xóa địa chỉ đã chọn
      form.resetFields();
      if (user) {
        form.setFieldsValue({
          name: user.fullName || user.username || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
        });
      }
      setSelectedAddress(null);
    } else {
      // Điền thông tin địa chỉ đã lưu vào form
      const selectedAddr = savedAddresses[addressIndex];
      setSelectedAddress(selectedAddr);

      form.setFieldsValue({
        name: selectedAddr.name,
        address: selectedAddr.address,
        phone: selectedAddr.phone,
        email: selectedAddr.email,
      });
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
    <div className="min-h-screen py-12 px-4">
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
                  <div className="flex items-center gap-2 text-pink-500">
                    <ShoppingOutlined />
                    <span>Chi Tiết Đơn Hàng</span>
                  </div>
                }
                bordered={false}
                className="mb-6"
              >
                <div className="space-y-4">
                  {order?.orderDetails?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={
                            item.image ||
                            "https://via.placeholder.com/300?text=Beauty+%26+Care"
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          fallback="https://via.placeholder.com/300?text=No+Image"
                        />
                      </div>
                      <div className="flex-grow">
                        <Text
                          strong
                          className="text-gray-800 hover:text-pink-500 transition-colors"
                        >
                          {item.productName || "Sản phẩm"}
                        </Text>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Số lượng: {item.quantity}</span>
                        </div>
                      </div>
                      <Text
                        strong
                        className="text-lg text-pink-500 whitespace-nowrap min-w-[100px] text-right"
                      >
                        {formatPrice(item.price)}
                      </Text>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                  {/* Hiển thị tạm tính trước khi áp dụng mã giảm giá */}
                  <div className="flex justify-between items-center mb-2">
                    <Text className="text-gray-600">Tạm tính</Text>
                    <Text className="text-gray-600">
                      {formatPrice(order?.subtotal || order?.totalAmount)}
                    </Text>
                  </div>

                  {/* Hiển thị mã khuyến mãi nếu có */}
                  {order?.promotionId && order?.promotionDiscount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <PercentageOutlined className="text-pink-500 mr-2" />
                        <Text className="text-green-500">Mã khuyến mãi</Text>
                      </div>
                      <Text className="text-green-500">
                        -{formatPrice(order?.promotionDiscount)}
                      </Text>
                    </div>
                  )}

                  {/* Tổng thanh toán cuối cùng */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
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
                className="mb-6"
                bordered={false}
                bodyStyle={{ padding: "1.5rem" }}
                title={
                  <div className="flex items-center gap-2 text-pink-500">
                    <EnvironmentOutlined />
                    <span>Địa Chỉ Nhận Hàng</span>
                  </div>
                }
              >
                {/* Hiển thị địa chỉ đã lưu nếu có */}
                {savedAddresses.length > 0 && (
                  <div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {selectedAddress && (
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 text-base">
                                <span className="font-medium">
                                  {selectedAddress.name}
                                </span>
                                <span className="text-gray-400 px-1">|</span>
                                <span>{selectedAddress.phone}</span>
                              </div>
                              <div className="text-gray-600 mt-2">
                                {selectedAddress.address}
                              </div>
                            </div>
                            <div>
                              <Tag color="pink" className="ml-2">
                                Mặc Định
                              </Tag>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-3 flex justify-between items-center">
                        <Button
                          type="primary"
                          ghost
                          className="text-pink-500 border-pink-500 hover:text-pink-600 hover:border-pink-600"
                          onClick={() => setIsAddressModalVisible(true)}
                        >
                          Thay Đổi
                        </Button>
                        <Button
                          type="link"
                          className="text-blue-500"
                          onClick={() => handleAddressChange("new")}
                        >
                          <span className="text-lg mr-1">+</span>
                          Thêm địa chỉ mới
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {(!savedAddresses.length || selectedAddress === null) && (
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                    }}
                  >
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên" },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Nhập họ và tên người nhận"
                      />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ" },
                      ]}
                    >
                      <Input.TextArea
                        prefix={
                          <HomeOutlined className="site-form-item-icon" />
                        }
                        placeholder="Nhập địa chỉ giao hàng chi tiết"
                        rows={3}
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <PhoneOutlined className="site-form-item-icon" />
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input
                        prefix={
                          <MailOutlined className="site-form-item-icon" />
                        }
                        placeholder="Nhập email"
                      />
                    </Form.Item>
                  </Form>
                )}
              </Card>

              <Card
                className="mb-6"
                bordered={false}
                bodyStyle={{ padding: "1.5rem" }}
                // title={
                //   <div className="flex items-center gap-2 text-pink-500">
                //     <CreditCardOutlined />
                //     <span>Phương Thức Thanh Toán</span>
                //   </div>
                // }
              >
                {/* <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Space direction="vertical" className="w-full">
                      <Radio value="cod" className="py-2">
                        <Space>
                          <WalletOutlined className="text-lg text-orange-500" />
                          <span className="font-medium">
                            Thanh toán khi nhận hàng (COD)
                          </span>
                        </Space>
                      </Radio>
                      <Radio value="qr" className="py-2">
                        <Space>
                          <QrcodeOutlined className="text-lg text-blue-500" />
                          <span className="font-medium">
                            Thanh toán qua QR Code
                          </span>
                        </Space>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div> */}

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
        </Card>
      </div>

      <Modal
        title="Chuyển đến trang thanh toán"
        open={isModalOpen}
        onOk={handlePayNow}
        onCancel={() => setIsModalOpen(false)}
        okText="Thanh toán ngay"
        cancelText="Hủy"
      >
        <p>
          Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch.
        </p>
      </Modal>

      {/* Modal hiển thị danh sách địa chỉ đã lưu */}
      <Modal
        title="Địa Chỉ Nhận Hàng"
        open={isAddressModalVisible}
        onCancel={() => setIsAddressModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddressModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="new"
            type="primary"
            className="bg-blue-500"
            onClick={() => {
              handleAddressChange("new");
              setIsAddressModalVisible(false);
            }}
          >
            + Thêm Địa Chỉ Mới
          </Button>,
        ]}
        width={600}
      >
        <div className="address-list-container">
          {savedAddresses.map((addr, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg mb-3 cursor-pointer hover:border-pink-300 ${
                selectedAddress &&
                selectedAddress.phone === addr.phone &&
                selectedAddress.address === addr.address
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200"
              }`}
              onClick={() => {
                handleAddressChange(index);
                setIsAddressModalVisible(false);
              }}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{addr.name}</span>
                    <span className="text-gray-400">|</span>
                    <span>{addr.phone}</span>
                    {index === 0 && (
                      <Tag color="pink" className="ml-2">
                        Mặc Định
                      </Tag>
                    )}
                  </div>
                  <div className="text-gray-600 mt-2">{addr.address}</div>
                </div>
                {selectedAddress &&
                  selectedAddress.phone === addr.phone &&
                  selectedAddress.address === addr.address && (
                    <div className="text-pink-500">
                      <CheckCircleOutlined />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(PaymentPage);
