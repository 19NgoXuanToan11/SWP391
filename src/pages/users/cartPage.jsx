import React, { useState } from "react";
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
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Kem Nền Hoàn Hảo",
      brand: "Luxe Beauty",
      price: 890000,
      originalPrice: 1200000,
      quantity: 2,
      image: "https://source.unsplash.com/random/400x400/?foundation",
      color: "Beige Tự Nhiên",
      discount: 25,
      stock: 10,
    },
    {
      id: 2,
      name: "Serum Dưỡng Ẩm",
      brand: "Pure Skin",
      price: 750000,
      originalPrice: 850000,
      quantity: 1,
      image: "https://source.unsplash.com/random/400x400/?serum",
      size: "30ml",
      discount: 12,
      stock: 5,
    },
    {
      id: 3,
      name: "Bộ Son Môi Matte",
      brand: "Color Pop",
      price: 450000,
      originalPrice: 500000,
      quantity: 2,
      image: "https://source.unsplash.com/random/400x400/?lipstick",
      color: "Đỏ Ruby",
      discount: 10,
      stock: 8,
    },
  ]);

  const handleQuantityChange = (id, value) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const handleMoveToWishlist = (id) => {
    message.success("Sản phẩm đã được thêm vào danh sách yêu thích");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price); // Chuyển đổi USD sang VND
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/product">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              className="text-gray-600 hover:text-pink-500 flex items-center"
            >
              Tiếp Tục Mua Sắm
            </Button>
          </Link>
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
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size="large">
                  <Text className="text-lg">Giỏ hàng của bạn đang trống</Text>
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingOutlined />}
                      className="bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                      Khám Phá Sản Phẩm
                    </Button>
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
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={140}
                        height={140}
                        className="rounded-2xl object-cover"
                        preview={false}
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <Title level={4} className="!mb-1">
                              {item.name}
                            </Title>
                            <Text type="secondary" className="text-sm">
                              Thương hiệu: {item.brand}
                            </Text>
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
                            {item.discount > 0 && (
                              <Tag color="red" className="mt-2">
                                Giảm giá {item.discount}%
                              </Tag>
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
                            <div>
                              <Text className="text-sm mb-2 block">
                                Số lượng:
                              </Text>
                              <InputNumber
                                min={1}
                                max={item.stock}
                                value={item.quantity}
                                onChange={(value) =>
                                  handleQuantityChange(item.id, value)
                                }
                                className="w-32"
                              />
                            </div>
                            <Text type="secondary" className="text-sm">
                              {item.stock} sản phẩm có sẵn
                            </Text>
                          </Space>
                          <Space>
                            <Tooltip title="Thêm vào danh sách yêu thích">
                              <Button
                                icon={<HeartOutlined />}
                                onClick={() => handleMoveToWishlist(item.id)}
                                className="border-pink-200 text-pink-500 hover:text-pink-600 hover:border-pink-300"
                              />
                            </Tooltip>
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
                      <Text>Tổng phụ</Text>
                      <Text>{formatPrice(calculateTotal())}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Vận chuyển</Text>
                      <Text className="text-green-500">Miễn phí</Text>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex justify-between">
                      <Text strong>Tổng cộng</Text>
                      <Title level={3} className="!mb-0 text-pink-500">
                        {formatPrice(calculateTotal())}
                      </Title>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="mt-6 h-12 text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:!text-white hover:opacity-90 transition-all duration-300"
                    onClick={() => navigate("/payment")}
                    style={{
                      background: "linear-gradient(to right, #ec4899, #a855f7)",
                      borderColor: "transparent",
                    }}
                  >
                    Tiến Hành Thanh Toán
                  </Button>
                </Card>

                <Card className="rounded-3xl bg-pink-50 border-pink-100">
                  <Space direction="vertical" className="w-full">
                    <Space>
                      <CarOutlined className="text-pink-500" />
                      <Text>
                        Miễn phí vận chuyển cho đơn hàng trên 460.000 VND
                      </Text>
                    </Space>
                    <Space>
                      <GiftOutlined className="text-pink-500" />
                      <Text>Miễn phí mẫu cho mỗi đơn hàng</Text>
                    </Space>
                    <Space>
                      <SafetyCertificateOutlined className="text-pink-500" />
                      <Text>Sản phẩm 100% chính hãng</Text>
                    </Space>
                  </Space>
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
