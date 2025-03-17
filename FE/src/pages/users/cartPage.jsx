import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Image,
  InputNumber,
  Divider,
  Empty,
  Tag,
  message,
  Tooltip,
  Steps,
  Skeleton,
  notification,
  Spin,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../store/slices/cartSlice";
import { PaymentSteps } from "../../components/PaymentStep";
import { selectAuth } from "../../store/slices/authSlice";
import {
  toggleWishlist,
  selectWishlistItems,
} from "../../store/slices/wishlistSlice";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [loading, setLoading] = React.useState(false);

  // Lấy danh sách wishlist từ Redux store
  const wishlistItems = useSelector(selectWishlistItems);

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const handleQuantityChange = (id, value) => {
    dispatch(updateQuantity({ id, quantity: value }));
    message.success("Số lượng đã được cập nhật");
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const handleWishlistToggle = (item) => {
    const productData = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      description: item.description,
      stock: item.stock,
      discount: item.discount,
      originalPrice: item.originalPrice,
      rating: item.rating,
    };

    dispatch(toggleWishlist(productData));

    notification.success({
      message: "Danh sách yêu thích",
      description: `${item.name} đã được ${
        isInWishlist(item.id) ? "xóa khỏi" : "thêm vào"
      } danh sách yêu thích`,
      placement: "bottomRight",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.originalPrice - item.price) * item.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng của bạn đang trống");
      return;
    }

    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login", { state: { from: "/payment" } });
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra và xử lý ID người dùng
      let userId = user.id;

      // Tạo đối tượng đơn hàng
      const order = {
        userId: userId,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending order:", order);

      const res = await axios.post("https://localhost:7285/api/Order", order, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate(`/payment/${res.data.orderId}`);
    } catch (e) {
      console.log("Error creating order:", e);
      message.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    message.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  if (!cartItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps - Cập nhật current={0} vì đang ở bước giỏ hàng */}
        <div className="mb-8">
          <PaymentSteps current={0} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Link to="/product">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-pink-50 
                  text-gray-600 hover:text-pink-500 font-medium transition-all duration-300
                  shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
              >
                <ArrowLeftOutlined className="text-lg" />
                <span>Tiếp Tục Mua Sắm</span>
              </button>
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-red-50 
                  text-gray-600 hover:text-red-500 font-medium transition-all duration-300
                  shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
              >
                <DeleteOutlined className="text-lg" />
                <span>Xóa Tất Cả</span>
              </button>
            )}
          </div>
          <Title level={2} className="!mb-0 flex items-center gap-3">
            <ShoppingCartOutlined className="text-pink-500" />
            Giỏ Hàng Của Bạn
            <Tag color="pink" className="ml-2">
              {cartItems.length} sản phẩm
            </Tag>
          </Title>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 rounded-3xl shadow-md">
            <Empty
              imageStyle={{ height: 200 }}
              description={
                <Space direction="vertical" size="large">
                  <Title level={3} className="!mb-0">
                    Giỏ hàng của bạn đang trống
                  </Title>
                  <Paragraph type="secondary">
                    Hãy thêm một số sản phẩm vào giỏ hàng để tiến hành thanh
                    toán
                  </Paragraph>
                  <Link to="/product" className="flex justify-center">
                    <button
                      type="button"
                      className="flex items-center gap-3 px-6 py-3 text-white font-medium rounded-full
                        bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600
                        transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                        active:scale-95"
                    >
                      <ShoppingOutlined className="text-xl" />
                      <span>Khám Phá Sản Phẩm</span>
                    </button>
                  </Link>
                </Space>
              }
            />
          </Card>
        ) : (
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Card className="rounded-3xl shadow-md mb-6">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-6 py-6">
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={140}
                          className="rounded-2xl object-cover"
                          preview={false}
                        />
                        {item.discount > 0 && (
                          <div className="absolute top-2 left-2">
                            <Tag color="red" className="px-2 py-1">
                              -{item.discount}%
                            </Tag>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <Title level={4} className="!mb-1">
                              {item.name}
                            </Title>
                            <Space size="small" className="mb-2">
                              {item.isNew && (
                                <Tag color="blue">Sản phẩm mới</Tag>
                              )}
                            </Space>
                            {item.color && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Màu sắc: {item.color}
                                </Text>
                              </div>
                            )}
                            {item.size && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Kích thước: {item.size}
                                </Text>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <Title level={4} className="!mb-1 text-pink-500">
                              {formatPrice(item.price)}
                            </Title>
                            {item.originalPrice > item.price && (
                              <Text delete type="secondary" className="text-sm">
                                {formatPrice(item.originalPrice)}
                              </Text>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <Space size="large">
                            <div className="flex flex-col">
                              <Text className="text-sm font-medium text-gray-600 mb-2">
                                Số lượng:
                              </Text>
                              <div className="flex items-center space-x-2">
                                <Button
                                  icon={<MinusOutlined />}
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="border-gray-300 hover:border-pink-400 hover:text-pink-500 transition-colors"
                                  disabled={item.quantity <= 1}
                                />
                                <InputNumber
                                  min={1}
                                  max={item.stock}
                                  value={item.quantity}
                                  onChange={(value) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(value) || 1
                                    )
                                  }
                                  className="w-20 text-center focus:border-pink-400 hover:border-pink-400"
                                  controls={false}
                                />
                                <Button
                                  icon={<PlusOutlined />}
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      Math.min(item.stock, item.quantity + 1)
                                    )
                                  }
                                  className="border-gray-300 hover:border-pink-400 hover:text-pink-500 transition-colors"
                                  disabled={item.quantity >= item.stock}
                                />
                              </div>
                            </div>
                          </Space>
                          <Space>
                            <Tooltip title="Xóa sản phẩm">
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveItem(item.id)}
                                className="border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300"
                              />
                            </Tooltip>
                          </Space>
                        </div>
                      </div>
                    </div>
                    <Divider className="my-0" />
                  </div>
                ))}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <div className="sticky top-6">
                <Card className="rounded-3xl shadow-md mb-6">
                  <Title level={4} className="flex items-center gap-2 mb-6">
                    <SafetyCertificateOutlined className="text-green-500" />
                    Tóm Tắt Đơn Hàng
                  </Title>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Text>Tạm tính</Text>
                      <Text>{formatPrice(calculateTotal())}</Text>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex justify-between">
                      <Text strong>Tổng cộng:</Text>
                      <Title level={3} className="text-pink-500">
                        {formatPrice(calculateTotal())}
                      </Title>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loading || cartItems.length === 0}
                    onClick={handleCheckout}
                    className="w-full py-2 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 
                      text-white font-medium text-lg hover:from-pink-600 hover:to-purple-600 
                      transform hover:scale-105 transition-all duration-300 
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">
                          <SyncOutlined />
                        </span>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <SafetyCertificateOutlined className="text-xl" />
                        <span>Tiến Hành Thanh Toán</span>
                      </>
                    )}
                  </button>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default CartPage;
