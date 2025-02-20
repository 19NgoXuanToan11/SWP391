import React, { useState, useEffect } from "react";
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
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem("userName") || "Nguyễn Văn A",
    email: localStorage.getItem("userEmail") || "nguyenvana@example.com",
    avatar:
      localStorage.getItem("userAvatar") ||
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    location: localStorage.getItem("userLocation") || "Hà Nội, Việt Nam",
    bio:
      localStorage.getItem("userBio") ||
      "Tôi là chuyên gia tư vấn làm đẹp với hơn 3 năm kinh nghiệm trong ngành mỹ phẩm cao cấp.",
    coverPhoto: "https://source.unsplash.com/random/1600x400",
  });

  useEffect(() => {
    const updateUserInfo = () => {
      setUserInfo({
        name: localStorage.getItem("userName") || userInfo.name,
        email: localStorage.getItem("userEmail") || userInfo.email,
        avatar: localStorage.getItem("userAvatar") || userInfo.avatar,
        location: localStorage.getItem("userLocation") || userInfo.location,
        bio: localStorage.getItem("userBio") || userInfo.bio,
        coverPhoto: userInfo.coverPhoto,
      });
    };

    window.addEventListener("storage", updateUserInfo);

    return () => {
      window.removeEventListener("storage", updateUserInfo);
    };
  }, []);

  const colors = {
    primary: "#ff4d6d",
    secondary: "#ff8fa3",
    accent: "#ff9a76",
    dark: "#1a1a1a",
    light: "#ffffff",
    red: "#ff0a54",
    gradient: "linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%)",
    bgLight: "#fef6f7",
  };

  const customStyles = {
    pageContainer: {
      padding: "40px 24px",
      maxWidth: 1200,
      margin: "0 auto",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, #ffffff 100%)`,
      minHeight: "100vh",
    },
    mainCard: {
      overflow: "hidden",
      borderRadius: 30,
      border: "none",
      background: colors.light,
      boxShadow: "0 20px 40px rgba(255, 77, 109, 0.08)",
      transition: "all 0.3s ease",
    },
    coverPhoto: {
      height: 400,
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url(${userInfo.coverPhoto})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      transition: "all 0.5s ease",
      "&:before": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "150px",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
      },
    },
    avatarSection: {
      marginTop: -120,
      position: "relative",
      zIndex: 1,
      textAlign: "center",
      padding: "0 20px",
    },
    avatar: {
      border: `8px solid ${colors.light}`,
      boxShadow: "0 12px 28px rgba(255, 77, 109, 0.15)",
      backgroundColor: colors.secondary,
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.05) translateY(-5px)",
        boxShadow: "0 20px 40px rgba(255, 77, 109, 0.2)",
      },
    },
    nameTitle: {
      fontSize: 32,
      fontWeight: 700,
      background: colors.gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginTop: 24,
      marginBottom: 12,
    },
    locationBadge: {
      background: "rgba(255,77,109,0.1)",
      padding: "10px 20px",
      borderRadius: 25,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginTop: 16,
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255,77,109,0.2)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(255,77,109,0.1)",
      },
    },
    editButton: {
      height: 48,
      padding: "0 35px",
      borderRadius: 24,
      background: colors.gradient,
      border: "none",
      color: colors.light,
      fontSize: 16,
      fontWeight: 600,
      boxShadow: "0 8px 20px rgba(255,77,109,0.3)",
      marginTop: 25,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 12px 25px rgba(255,77,109,0.4)",
      },
    },
    infoCard: {
      borderRadius: 25,
      border: "none",
      backgroundColor: colors.light,
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
      },
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 600,
      color: colors.dark,
      position: "relative",
      paddingBottom: 12,
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 40,
        height: 3,
        background: colors.gradient,
        borderRadius: 2,
      },
    },
    infoLabel: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    bioSection: {
      padding: 30,
      background: "rgba(255,77,109,0.03)",
      borderRadius: 20,
      marginTop: 15,
      border: "1px solid rgba(255,77,109,0.1)",
      transition: "all 0.3s ease",
      position: "relative",
      "&:hover": {
        background: "rgba(255,77,109,0.05)",
        borderColor: colors.primary,
        transform: "translateY(-3px)",
      },
      "&:before": {
        content: '""',
        position: "absolute",
        top: 15,
        left: 15,
        width: 30,
        height: 30,
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ff4d6d' viewBox='0 0 24 24'%3E%3Cpath d='M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z'/%3E%3C/svg%3E") no-repeat center center`,
        opacity: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={customStyles.pageContainer}
    >
      <Card bordered={false} style={customStyles.mainCard}>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={customStyles.coverPhoto}
        />

        <div style={{ padding: "0 40px 40px" }}>
          <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={customStyles.avatarSection}
              >
                <Avatar
                  src={userInfo.avatar}
                  size={220}
                  style={customStyles.avatar}
                />
                <Title style={customStyles.nameTitle}>{userInfo.name}</Title>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={customStyles.locationBadge}
                >
                  <EnvironmentOutlined
                    style={{ color: colors.primary, fontSize: 18 }}
                  />
                  <Text style={{ color: colors.primary, fontSize: 16 }}>
                    {userInfo.location}
                  </Text>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="large"
                    style={customStyles.editButton}
                    onClick={() => navigate("/edit-profile")}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </motion.div>
              </motion.div>
            </Col>

            <Col xs={24} md={16}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
                    <motion.div whileHover={{ x: 5 }}>
                      <Text style={customStyles.infoLabel}>
                        <MailOutlined style={{ fontSize: 18 }} />
                        Email
                      </Text>
                      <Paragraph
                        style={{
                          marginTop: 8,
                          fontSize: 16,
                          color: colors.dark,
                        }}
                      >
                        {userInfo.email}
                      </Paragraph>
                    </motion.div>

                    <motion.div whileHover={{ x: 5 }}>
                      <Text style={customStyles.infoLabel}>
                        <UserOutlined style={{ fontSize: 18 }} />
                        Giới thiệu
                      </Text>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        style={customStyles.bioSection}
                      >
                        <Paragraph
                          style={{
                            color: colors.dark,
                            margin: 0,
                            lineHeight: 1.8,
                            fontSize: 16,
                          }}
                        >
                          {userInfo.bio}
                        </Paragraph>
                      </motion.div>
                    </motion.div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
