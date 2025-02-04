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

  const colors = {
    primary: "#ff4d6d", // Hồng đậm
    secondary: "#ff8fa3", // Hồng nhạt
    accent: "#ff9a76", // Da cam
    dark: "#1a1a1a", // Đen
    light: "#ffffff", // Trắng
    red: "#ff0a54", // Đỏ
  };

  const customStyles = {
    mainCard: {
      overflow: "hidden",
      borderRadius: 16,
      border: "none",
      background: colors.light,
    },
    coverPhoto: {
      height: 300,
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(26,26,26,0.8) 100%), url(${userInfo.coverPhoto})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    avatarSection: {
      marginTop: -85,
      position: "relative",
      zIndex: 1,
    },
    avatar: {
      border: `4px solid ${colors.light}`,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      backgroundColor: colors.secondary,
    },
    roleTag: {
      color: colors.light,
      backgroundColor: colors.primary,
      border: "none",
      padding: "6px 16px",
      fontSize: "14px",
      marginBottom: 16,
    },
    editButton: {
      height: 44,
      padding: "0 24px",
      borderRadius: 8,
      backgroundColor: colors.accent,
      border: "none",
      color: colors.light,
      boxShadow: "0 4px 12px rgba(255,77,109,0.2)",
      "&:hover": {
        backgroundColor: `${colors.red} !important`,
      },
    },
    infoCard: {
      borderRadius: 16,
      border: "none",
      backgroundColor: colors.light,
    },
    bioSection: {
      padding: 20,
      background: "rgba(255,77,109,0.05)",
      borderRadius: 12,
      marginTop: 8,
    },
    statCard: {
      textAlign: "center",
      borderRadius: 12,
      backgroundColor: colors.light,
      border: `1px solid rgba(255,77,109,0.1)`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(255,77,109,0.12)",
        borderColor: colors.primary,
      },
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: colors.dark,
    },
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 1200,
        margin: "0 auto",
        backgroundColor: "#fafafa",
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
                  style={{
                    marginTop: 24,
                    marginBottom: 12,
                    color: colors.dark,
                  }}
                >
                  {userInfo.name}
                </Title>
                <Tag style={customStyles.roleTag}>{userInfo.role}</Tag>
                <div>
                  <Space align="center">
                    <EnvironmentOutlined style={{ color: colors.primary }} />
                    <Text style={{ color: colors.primary }}>
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
                <Divider style={{ borderColor: "rgba(255,77,109,0.1)" }} />

                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text strong style={{ color: colors.primary }}>
                      <Space>
                        <MailOutlined />
                        Email
                      </Space>
                    </Text>
                    <Paragraph style={{ marginTop: 8, color: colors.dark }}>
                      {userInfo.email}
                    </Paragraph>
                  </div>

                  <div>
                    <Text strong style={{ color: colors.primary }}>
                      <Space>
                        <UserOutlined />
                        Giới thiệu
                      </Space>
                    </Text>
                    <div style={customStyles.bioSection}>
                      <Paragraph
                        style={{
                          color: colors.dark,
                          margin: 0,
                          lineHeight: 1.8,
                        }}
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
                  <Divider style={{ borderColor: "rgba(255,77,109,0.1)" }} />
                  <Row gutter={[16, 16]}>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: colors.primary }}>
                              Khách hàng
                            </span>
                          }
                          value={248}
                          valueStyle={{ color: colors.dark }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: colors.primary }}>
                              Đánh giá
                            </span>
                          }
                          value={1893}
                          valueStyle={{ color: colors.dark }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card style={customStyles.statCard}>
                        <Statistic
                          title={
                            <span style={{ color: colors.primary }}>
                              Sản phẩm
                            </span>
                          }
                          value={156}
                          valueStyle={{ color: colors.dark }}
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
