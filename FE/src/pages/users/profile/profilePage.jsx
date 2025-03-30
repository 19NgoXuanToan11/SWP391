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
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "../../../hook/user/useUser";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, fullName, updateUser } = useUser();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    avatar: localStorage.getItem("userAvatar") || null,
    phoneNumber: "",
    address: "",
    fullName: "",
  });

  useEffect(() => {
    const authUserStr = localStorage.getItem("auth_user");
    const avatarKey = "userAvatar";
    setLoading(true);

    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        const username = authUser.username || "";
        const userId = authUser.id || "";
        const fullName = authUser.fullName || username;

        // Cập nhật userInfo từ dữ liệu trong localStorage
        setUserInfo({
          username: username,
          fullName: fullName,
          email: authUser.email || "",
          avatar: authUser.photoURL || localStorage.getItem(avatarKey) || null,
          phoneNumber: authUser.phoneNumber || "",
          address: authUser.address || "",
        });

        // Lấy thông tin từ API nếu có userId
        if (userId) {
          fetchUserInfoFromAPI(userId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing auth_user:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
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
            phoneNumber: authUser.phoneNumber || "",
            address: authUser.address || "",
            fullName:
              authUser.fullName || authUser.name || authUser.username || "",
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

    // Thêm handler cho sự kiện avatar được cập nhật
    const handleAvatarUpdated = (event) => {
      if (event.detail && event.detail.avatarUrl) {
        setUserInfo((prev) => ({
          ...prev,
          avatar: event.detail.avatarUrl,
        }));
      }
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    window.addEventListener("tempAvatarUpdated", handleAvatarUpdated);

    // Xử lý sự kiện fullName được cập nhật
    const handleFullNameUpdated = (event) => {
      if (event.detail && event.detail.fullName) {
        setUserInfo((prev) => ({
          ...prev,
          fullName: event.detail.fullName,
        }));
      }
    };

    window.addEventListener("fullNameUpdated", handleFullNameUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
      window.removeEventListener("tempAvatarUpdated", handleAvatarUpdated);
      window.removeEventListener("fullNameUpdated", handleFullNameUpdated);
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

  // Thêm hàm để lấy thông tin người dùng từ API
  const fetchUserInfoFromAPI = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7285/api/User/${userId}`
      );
      if (response.data) {
        // Cập nhật state với dữ liệu từ API
        setUserInfo({
          username: response.data.username || "",
          fullName: response.data.fullName || response.data.username || "",
          email: response.data.email || "",
          avatar: userInfo.avatar, // Giữ nguyên avatar hiện tại
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
        });

        // Cập nhật localStorage
        const authUserStr = localStorage.getItem("auth_user");
        if (authUserStr) {
          const authUser = JSON.parse(authUserStr);
          const updatedUser = {
            ...authUser,
            fullName: response.data.fullName || authUser.fullName,
            email: response.data.email || authUser.email,
            phoneNumber: response.data.phoneNumber || authUser.phoneNumber,
            address: response.data.address || authUser.address,
          };
          localStorage.setItem("auth_user", JSON.stringify(updatedUser));

          // Kích hoạt sự kiện để components khác cập nhật
          window.dispatchEvent(
            new CustomEvent("fullNameUpdated", {
              detail: { fullName: response.data.fullName || authUser.fullName },
            })
          );
        }
      }
    } catch (error) {
      console.error("Không thể lấy thông tin người dùng từ API:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            bordered={false}
            className="shadow-lg rounded-3xl overflow-hidden"
            style={{
              background: token.colorBgContainer,
            }}
          >
            {loading ? (
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            ) : (
              <>
                <div className="text-center py-6 px-4">
                  <div className="mb-4 relative inline-block">
                    <Avatar
                      size={150}
                      src={userInfo.avatar}
                      icon={!userInfo.avatar && <UserOutlined />}
                    />
                  </div>

                  <Title level={2} style={{ marginBottom: 4 }}>
                    {userInfo.fullName || userInfo.username}
                  </Title>

                  <Text type="secondary" style={{ fontSize: 16 }}>
                    @{userInfo.username}
                  </Text>

                  <div className="mt-3">
                    <Tag color="pink">Khách hàng</Tag>
                  </div>
                </div>

                <Divider style={{ margin: "0" }} />

                <div className="p-6">
                  <Title level={4} className="mb-4 text-center">
                    Thông tin cá nhân
                  </Title>

                  <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} md={8}>
                      <div className="flex flex-col items-center mb-4">
                        <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                          <MailOutlined className="text-xl text-pink-500" />
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 text-sm mb-1">
                            Email
                          </div>
                          <div className="font-medium text-gray-800 break-all">
                            {userInfo.email || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="flex flex-col items-center mb-4">
                        <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                          <PhoneOutlined className="text-xl text-pink-500" />
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 text-sm mb-1">
                            Số điện thoại
                          </div>
                          <div className="font-medium text-gray-800">
                            {userInfo.phoneNumber || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="flex flex-col items-center mb-4">
                        <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                          <HomeOutlined className="text-xl text-pink-500" />
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 text-sm mb-1">
                            Địa chỉ
                          </div>
                          <div className="font-medium text-gray-800">
                            {userInfo.address || "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-8 flex justify-center">
                    <Button
                      type="primary"
                      size="large"
                      icon={<EditOutlined />}
                      onClick={() => navigate("/edit-profile")}
                      className="rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%)",
                        border: "none",
                        boxShadow: "0 12px 24px rgba(255, 77, 109, 0.3)",
                        minWidth: "200px",
                        height: "50px",
                        fontWeight: "bold",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
