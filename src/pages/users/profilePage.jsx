import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Divider,
  Statistic,
  Space,
  Tag,
  theme,
} from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { token } = theme.useToken();

  const [userInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "https://source.unsplash.com/random/150x150",
    role: "Beauty Consultant",
    location: "Hà Nội, Việt Nam",
    bio: "Tôi là chuyên gia tư vấn làm đẹp với hơn 3 năm kinh nghiệm trong ngành mỹ phẩm cao cấp.",
    coverPhoto: "https://source.unsplash.com/random/1600x400",
  });

  const customStyles = {
    mainCard: {
      overflow: "hidden",
      borderRadius: 16,
      border: "none",
      background: "#faf9f8",
    },
    coverPhoto: {
      height: 300,
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(250,249,248,0.8) 100%), url(${userInfo.coverPhoto})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    avatarSection: {
      marginTop: -85,
      position: "relative",
      zIndex: 1,
    },
    avatar: {
      border: "4px solid #fff",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      backgroundColor: "#f5f0eb",
    },
    roleTag: {
      color: "#9c8576",
      backgroundColor: "#f5f0eb",
      border: "none",
      padding: "6px 16px",
      fontSize: "14px",
      marginBottom: 16,
    },
    editButton: {
      height: 44,
      padding: "0 24px",
      borderRadius: 8,
      backgroundColor: "#9c8576",
      border: "none",
      boxShadow: "0 4px 12px rgba(156,133,118,0.2)",
      "&:hover": {
        backgroundColor: "#86725f !important",
      },
    },
    infoCard: {
      borderRadius: 16,
      border: "none",
      backgroundColor: "#fff",
    },
    bioSection: {
      padding: 20,
      background: "#f5f0eb",
      borderRadius: 12,
      marginTop: 8,
    },
    statCard: {
      textAlign: "center",
      borderRadius: 12,
      backgroundColor: "#fff",
      border: "none",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: "#4a4a4a",
    },
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto",
        backgroundColor: "#faf9f8",
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={customStyles.mainCard}
        bodyStyle={{ padding: 0 }}
      >
        <div style={customStyles.coverPhoto} />

        <div style={{ padding: 32 }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <div style={customStyles.avatarSection}>
                <Avatar
                  src={userInfo.avatar}
                  size={180}
                  style={customStyles.avatar}
                />
                <Title
                  level={3}
                  style={{ marginTop: 24, marginBottom: 12, color: "#4a4a4a" }}
                >
                  {userInfo.name}
                </Title>
                <Tag style={customStyles.roleTag}>{userInfo.role}</Tag>
                <div>
                  <Space align="center">
                    <EnvironmentOutlined style={{ color: "#9c8576" }} />
                    <Text style={{ color: "#9c8576" }}>
                      {userInfo.location}
                    </Text>
                  </Space>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  style={customStyles.editButton}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Card style={customStyles.infoCard}>
                <Title level={4} style={customStyles.sectionTitle}>
                  Thông tin cá nhân
                </Title>
                <Divider style={{ borderColor: "#f0f0f0" }} />

                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text strong style={{ color: "#9c8576" }}>
                      <Space>
                        <MailOutlined />
                        Email
                      </Space>
                    </Text>
                    <Paragraph style={{ marginTop: 8, color: "#666" }}>
                      {userInfo.email}
                    </Paragraph>
                  </div>

                  <div>
                    <Text strong style={{ color: "#9c8576" }}>
                      <Space>
                        <UserOutlined />
                        Giới thiệu
                      </Space>
                    </Text>
                    <div style={customStyles.bioSection}>
                      <Paragraph
                        style={{ color: "#666", margin: 0, lineHeight: 1.8 }}
                      >
                        {userInfo.bio}
                      </Paragraph>
                    </div>
                  </div>
                </Space>

                <div style={{ marginTop: 32 }}>
                  <Title level={4} style={customStyles.sectionTitle}>
                    Thống kê
                  </Title>
                  <Divider style={{ borderColor: "#f0f0f0" }} />
                  <Row gutter={[16, 16]}>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: "#9c8576" }}>Khách hàng</span>
                          }
                          value={248}
                          valueStyle={{ color: "#4a4a4a" }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: "#9c8576" }}>Đánh giá</span>
                          }
                          value={1893}
                          valueStyle={{ color: "#4a4a4a" }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: "#9c8576" }}>Sản phẩm</span>
                          }
                          value={156}
                          valueStyle={{ color: "#4a4a4a" }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
