import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Tag,
  Empty,
  Image,
  Space,
  Divider,
  theme,
} from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const WishlistPage = () => {
  const { token } = theme.useToken();

  const colors = {
    primary: "#ff4d6d", // Hồng đậm
    secondary: "#ff8fa3", // Hồng nhạt
    accent: "#ff9a76", // Da cam
    dark: "#1a1a1a", // Đen
    light: "#ffffff", // Trắng
    red: "#ff0a54", // Đỏ
  };

  const customStyles = {
    pageContainer: {
      padding: "32px",
      maxWidth: 1200,
      margin: "0 auto",
      backgroundColor: "#fafafa",
      minHeight: "100vh",
    },
    headerSection: {
      marginBottom: 32,
      position: "relative",
      padding: "24px",
      background: colors.light,
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      marginBottom: 8,
      color: colors.dark,
      fontSize: 28,
    },
    heartIcon: {
      color: colors.primary,
      marginRight: 12,
      fontSize: 28,
    },
    productCard: {
      height: "100%",
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      border: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      },
    },
    imageContainer: {
      position: "relative",
      paddingTop: "100%",
      overflow: "hidden",
    },
    productImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    discountTag: {
      position: "absolute",
      top: 12,
      left: 12,
      padding: "6px 12px",
      borderRadius: 8,
      fontSize: "14px",
      fontWeight: 600,
      background: colors.red,
      border: "none",
    },
    brandText: {
      fontSize: 13,
      color: colors.dark,
      opacity: 0.6,
      fontWeight: 500,
    },
    productName: {
      fontSize: 16,
      fontWeight: 600,
      margin: "8px 0",
      color: colors.dark,
      lineHeight: 1.4,
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
    },
    currentPrice: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.primary,
    },
    originalPrice: {
      fontSize: 14,
      color: colors.dark,
      opacity: 0.5,
      textDecoration: "line-through",
    },
    actionButton: {
      borderRadius: 8,
      height: 40,
      padding: "0 16px",
      fontWeight: 500,
      transition: "all 0.3s ease",
    },
    cartButton: {
      background: colors.primary,
      borderColor: colors.primary,
      "&:hover": {
        background: colors.red,
        borderColor: colors.red,
      },
      "&:disabled": {
        background: "#f5f5f5",
        borderColor: "#d9d9d9",
      },
    },
    deleteButton: {
      color: colors.primary,
      "&:hover": {
        color: colors.red,
        background: "rgba(255,77,109,0.1)",
      },
    },
  };

  // Mock data - thay thế bằng data thật từ API sau
  const wishlistItems = [
    {
      id: 1,
      name: "Perfect Glow Foundation",
      brand: "Beauty Essentials",
      price: 890000,
      originalPrice: 1200000,
      rating: 4.5,
      image: "https://source.unsplash.com/random/400x400/?cosmetics",
      discount: 25,
      stock: true,
    },
    {
      id: 2,
      name: "Hydrating Serum",
      brand: "Skin Care Pro",
      price: 750000,
      originalPrice: 850000,
      rating: 5,
      image: "https://source.unsplash.com/random/400x400/?serum",
      discount: 12,
      stock: true,
    },
    {
      id: 3,
      name: "Matte Lipstick Collection",
      brand: "Glamour",
      price: 450000,
      originalPrice: 500000,
      rating: 4,
      image: "https://source.unsplash.com/random/400x400/?lipstick",
      discount: 10,
      stock: false,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div style={customStyles.pageContainer}>
      <div style={customStyles.headerSection}>
        <Title level={2} style={customStyles.headerTitle}>
          <HeartFilled style={customStyles.heartIcon} />
          Danh sách yêu thích
        </Title>
        <Text type="secondary">
          {wishlistItems.length} sản phẩm trong danh sách yêu thích của bạn
        </Text>
      </div>

      {wishlistItems.length > 0 ? (
        <Row gutter={[24, 24]}>
          {wishlistItems.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                style={customStyles.productCard}
                bodyStyle={{ padding: 20 }}
                cover={
                  <div style={customStyles.imageContainer}>
                    <Image
                      alt={item.name}
                      src={item.image}
                      style={customStyles.productImage}
                      preview={false}
                    />
                    {item.discount > 0 && (
                      <Tag color={colors.red} style={customStyles.discountTag}>
                        <TagOutlined /> -{item.discount}%
                      </Tag>
                    )}
                  </div>
                }
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text style={customStyles.brandText}>{item.brand}</Text>
                  <Text style={customStyles.productName}>{item.name}</Text>
                  <Rate
                    disabled
                    defaultValue={item.rating}
                    style={{ fontSize: 12 }}
                  />
                  <div style={customStyles.priceContainer}>
                    <Text style={customStyles.currentPrice}>
                      {formatPrice(item.price)}
                    </Text>
                    {item.originalPrice > item.price && (
                      <Text style={customStyles.originalPrice}>
                        {formatPrice(item.originalPrice)}
                      </Text>
                    )}
                  </div>

                  <Divider style={{ margin: "16px 0" }} />

                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      disabled={!item.stock}
                      style={{
                        ...customStyles.actionButton,
                        ...customStyles.cartButton,
                      }}
                    >
                      {item.stock ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      style={{
                        ...customStyles.actionButton,
                        ...customStyles.deleteButton,
                      }}
                    />
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size="large" align="center">
                <Text style={{ fontSize: 16, color: colors.dark }}>
                  Danh sách yêu thích của bạn đang trống
                </Text>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    ...customStyles.actionButton,
                    ...customStyles.cartButton,
                  }}
                >
                  Khám phá sản phẩm
                </Button>
              </Space>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default WishlistPage;
