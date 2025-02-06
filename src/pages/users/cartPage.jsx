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
      name: "Perfect Glow Foundation",
      brand: "Luxe Beauty",
      price: 890000,
      originalPrice: 1200000,
      quantity: 2,
      image: "https://source.unsplash.com/random/400x400/?foundation",
      color: "Natural Beige",
      discount: 25,
      stock: 10,
    },
    {
      id: 2,
      name: "Hydrating Serum",
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
      name: "Matte Lipstick Collection",
      brand: "Color Pop",
      price: 450000,
      originalPrice: 500000,
      quantity: 2,
      image: "https://source.unsplash.com/random/400x400/?lipstick",
      color: "Ruby Red",
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
    message.success("Item removed from cart");
  };

  const handleMoveToWishlist = (id) => {
    message.success("Item added to wishlist");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 23000); // Converting VND to USD for example
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/products">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              className="text-gray-600 hover:text-pink-500 flex items-center"
            >
              Continue Shopping
            </Button>
          </Link>
          <Title level={2} className="!mb-0 flex items-center gap-3">
            <ShoppingCartOutlined className="text-pink-500" />
            Your Shopping Cart
            <Tag color="pink" className="ml-2">
              {cartItems.length} items
            </Tag>
          </Title>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 rounded-3xl shadow-md">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size="large">
                  <Text className="text-lg">Your cart is empty</Text>
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingOutlined />}
                      className="bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                      Explore Products
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
                              Brand: {item.brand}
                            </Text>
                            {item.color && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Color: {item.color}
                                </Text>
                              </div>
                            )}
                            {item.size && (
                              <div className="mt-1">
                                <Text type="secondary" className="text-sm">
                                  Size: {item.size}
                                </Text>
                              </div>
                            )}
                            {item.discount > 0 && (
                              <Tag color="red" className="mt-2">
                                {item.discount}% OFF
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
                                Quantity:
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
                              {item.stock} items available
                            </Text>
                          </Space>
                          <Space>
                            <Tooltip title="Add to Wishlist">
                              <Button
                                icon={<HeartOutlined />}
                                onClick={() => handleMoveToWishlist(item.id)}
                                className="border-pink-200 text-pink-500 hover:text-pink-600 hover:border-pink-300"
                              />
                            </Tooltip>
                            <Tooltip title="Remove Item">
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
                    Order Summary
                  </Title>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Text>Subtotal</Text>
                      <Text>{formatPrice(calculateTotal())}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Shipping</Text>
                      <Text className="text-green-500">Free</Text>
                    </div>
                    <Divider className="my-4" />
                    <div className="flex justify-between">
                      <Text strong>Total</Text>
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
                    Proceed to Checkout
                  </Button>
                </Card>

                <Card className="rounded-3xl bg-pink-50 border-pink-100">
                  <Space direction="vertical" className="w-full">
                    <Space>
                      <CarOutlined className="text-pink-500" />
                      <Text>Free shipping on orders over $20</Text>
                    </Space>
                    <Space>
                      <GiftOutlined className="text-pink-500" />
                      <Text>Free samples with every order</Text>
                    </Space>
                    <Space>
                      <SafetyCertificateOutlined className="text-pink-500" />
                      <Text>100% Authentic Products</Text>
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
