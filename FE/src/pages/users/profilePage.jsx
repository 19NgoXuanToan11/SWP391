import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Divider,
  Space,
  Tag,
  theme,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  MailOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    avatar: localStorage.getItem("userAvatar") || null, // Lấy từ localStorage
  });

  useEffect(() => {
    // Giả lập thời gian tải
    setTimeout(() => {
      setLoading(false);
    }, 800);

    // Lấy thông tin từ auth_user trong localStorage
    const authUserStr = localStorage.getItem("auth_user");
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        const username = authUser.username || "";

        // Tạo key riêng cho mỗi user
        const avatarKey = `userAvatar_${username}`;

        // Thử lấy avatar từ nhiều nguồn
        let avatarUrl =
          authUser.photoURL ||
          localStorage.getItem(avatarKey) ||
          sessionStorage.getItem(avatarKey);

        // Nếu không tìm thấy, thử lấy từ IndexedDB
        if (!avatarUrl) {
          getAvatarFromIndexedDB(username).then((url) => {
            if (url) {
              setUserInfo((prev) => ({ ...prev, avatar: url }));
              // Khôi phục vào localStorage với key riêng
              localStorage.setItem(avatarKey, url);

              // Cập nhật auth_user
              const updatedUser = { ...authUser, photoURL: url };
              localStorage.setItem("auth_user", JSON.stringify(updatedUser));
            }
          });
        }

        setUserInfo({
          username: username,
          email: authUser.email || "",
          avatar: avatarUrl,
        });

        // Đảm bảo lưu avatar URL vào localStorage với key riêng
        if (avatarUrl) {
          localStorage.setItem(avatarKey, avatarUrl);
          sessionStorage.setItem(avatarKey, avatarUrl);
        }
      } catch (error) {
        console.error("Error parsing auth_user:", error);
      }
    }

    // Lắng nghe sự thay đổi của localStorage
    const handleStorageChange = () => {
      const authUserStr = localStorage.getItem("auth_user");
      if (authUserStr) {
        try {
          const authUser = JSON.parse(authUserStr);
          const avatarUrl =
            authUser.photoURL || localStorage.getItem("userAvatar");

          setUserInfo({
            username: authUser.username || "",
            email: authUser.email || "",
            avatar: avatarUrl,
          });

          // Đảm bảo lưu avatar URL vào localStorage
          if (avatarUrl) {
            localStorage.setItem("userAvatar", avatarUrl);
          }
        } catch (error) {
          console.error("Error parsing auth_user:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hàm lấy avatar từ IndexedDB
  const getAvatarFromIndexedDB = (username) => {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.log("Trình duyệt không hỗ trợ IndexedDB");
        resolve(null);
        return;
      }

      const request = window.indexedDB.open("UserAvatarDB", 1);

      request.onerror = () => {
        console.error("Lỗi khi mở IndexedDB");
        resolve(null);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("avatars")) {
          db.createObjectStore("avatars", { keyPath: "username" });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(["avatars"], "readonly");
          const store = transaction.objectStore("avatars");
          const getRequest = store.get(username);

          getRequest.onsuccess = () => {
            if (getRequest.result) {
              resolve(getRequest.result.avatarUrl);
            } else {
              resolve(null);
            }
          };

          getRequest.onerror = () => {
            console.error("Lỗi khi lấy avatar từ IndexedDB");
            resolve(null);
          };
        } catch (error) {
          console.error("Lỗi khi truy cập IndexedDB:", error);
          resolve(null);
        }
      };
    });
  };

  const colors = {
    primary: "#ff4d6d",
    secondary: "#ff8fa3",
    accent: "#ff9a76",
    dark: "#1a1a1a",
    light: "#ffffff",
    red: "#ff0a54",
    gradient: "linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%)",
    bgLight: "#fef6f7",
    glassBg: "rgba(255, 255, 255, 0.8)",
    glassBorder: "rgba(255, 255, 255, 0.18)",
  };

  const customStyles = {
    pageContainer: {
      padding: "40px 24px",
      maxWidth: 1200,
      margin: "0 auto",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(${colors.secondary}22 2px, transparent 2px)`,
      backgroundSize: "30px 30px",
      zIndex: 0,
    },
    mainCard: {
      position: "relative",
      zIndex: 1,
      overflow: "visible",
      borderRadius: 30,
      border: "none",
      background: "transparent",
      boxShadow: "none",
    },
    glassCard: {
      background: colors.glassBg,
      backdropFilter: "blur(10px)",
      borderRadius: 30,
      border: `1px solid ${colors.glassBorder}`,
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      padding: 40,
      overflow: "hidden",
      position: "relative",
    },
    profileHeader: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 40,
      position: "relative",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 24,
      display: "inline-block",
    },
    avatarGlow: {
      position: "absolute",
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: "50%",
      background: colors.gradient,
      opacity: 0.5,
      filter: "blur(15px)",
      zIndex: -1,
    },
    avatar: {
      border: "4px solid white",
      boxShadow: "0 8px 24px rgba(255,77,109,0.2)",
      backgroundColor: colors.secondary,
      transition: "all 0.3s ease",
      objectFit: "cover",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 12px 28px rgba(255,77,109,0.3)",
      },
    },
    nameTitle: {
      fontSize: 36,
      fontWeight: 800,
      background: colors.gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: 8,
      textAlign: "center",
    },
    emailText: {
      fontSize: 16,
      color: "rgba(0,0,0,0.6)",
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
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
      boxShadow: "0 8px 20px rgba(255, 77, 109, 0.3)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 12px 25px rgba(255, 77, 109, 0.4)",
      },
    },
    infoCard: {
      borderRadius: 25,
      border: "none",
      backgroundColor: colors.light,
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      height: "100%",
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
      marginBottom: 24,
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
    infoValue: {
      marginTop: 8,
      fontSize: 16,
      color: colors.dark,
      fontWeight: 500,
    },
    statCard: {
      padding: 24,
      borderRadius: 20,
      background: "white",
      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      height: "100%",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255,77,109,0.1)",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      },
    },
    statIcon: {
      fontSize: 24,
      color: colors.primary,
      marginBottom: 16,
      padding: 12,
      borderRadius: "50%",
      background: "rgba(255,77,109,0.1)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statTitle: {
      fontSize: 14,
      color: "rgba(0,0,0,0.5)",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 700,
      color: colors.dark,
    },
    decorCircle1: {
      position: "absolute",
      top: "10%",
      right: "5%",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: `linear-gradient(45deg, ${colors.primary}11, ${colors.secondary}22)`,
      filter: "blur(60px)",
      zIndex: 0,
    },
    decorCircle2: {
      position: "absolute",
      bottom: "15%",
      left: "10%",
      width: 200,
      height: 200,
      borderRadius: "50%",
      background: `linear-gradient(45deg, ${colors.secondary}22, ${colors.accent}33)`,
      filter: "blur(50px)",
      zIndex: 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={customStyles.pageContainer}
    >
      <div style={customStyles.backgroundPattern} />
      <div style={customStyles.decorCircle1} />
      <div style={customStyles.decorCircle2} />

      <Card bordered={false} style={customStyles.mainCard}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={customStyles.glassCard}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Skeleton.Avatar active size={120} style={{ marginBottom: 24 }} />
              <Skeleton active paragraph={{ rows: 2 }} />
              <Skeleton.Button active style={{ marginTop: 24, width: 150 }} />
            </div>
          ) : (
            <>
              <div style={customStyles.profileHeader}>
                <motion.div style={customStyles.avatarContainer}>
                  <div style={customStyles.avatarGlow} />
                  <Avatar
                    size={120}
                    src={userInfo.avatar}
                    icon={!userInfo.avatar && <UserOutlined />}
                    style={customStyles.avatar}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Title level={2} style={customStyles.nameTitle}>
                    {userInfo.username || "Username"}
                  </Title>
                  <Text style={customStyles.emailText}>
                    <MailOutlined style={{ color: colors.primary }} />
                    {userInfo.email || "email@example.com"}
                  </Text>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
              </div>

              <Divider style={{ borderColor: "rgba(255,77,109,0.1)" }} />

              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    style={customStyles.statCard}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={customStyles.statIcon}>
                        <SafetyCertificateOutlined />
                      </div>
                      <div style={customStyles.statTitle}>Vai trò</div>
                      <div style={customStyles.statValue}>Khách hàng</div>
                    </div>
                  </motion.div>
                </Col>
                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    style={customStyles.statCard}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={customStyles.statIcon}>
                        <LineChartOutlined />
                      </div>
                      <div style={customStyles.statTitle}>Đơn hàng</div>
                      <div style={customStyles.statValue}>0</div>
                    </div>
                  </motion.div>
                </Col>
                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    style={customStyles.statCard}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={customStyles.statIcon}>
                        <UserOutlined />
                      </div>
                      <div style={customStyles.statTitle}>Thành viên từ</div>
                      <div style={customStyles.statValue}>
                        {new Date().toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                        })}
                      </div>
                    </div>
                  </motion.div>
                </Col>
              </Row>
            </>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
