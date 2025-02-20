import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Space,
  message,
  Image,
  Avatar,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  CameraOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import uploadFile from "../../utils/upload";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "avatar.png",
      status: "done",
      url:
        localStorage.getItem("userAvatar") ||
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const colors = {
    primary: "#ff4d6d",
    secondary: "#ff8fa3",
    accent: "#ff9a76",
    dark: "#1a1a1a",
    light: "#ffffff",
    gradient: "linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%)",
    bgLight: "#fef6f7",
  };

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, #ffffff 100%)`,
      padding: "40px 24px",
    },
    mainCard: {
      maxWidth: 800,
      margin: "0 auto",
      borderRadius: 30,
      overflow: "hidden",
      border: "none",
      boxShadow: "0 20px 40px rgba(255, 77, 109, 0.08)",
    },
    header: {
      textAlign: "center",
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
      background: colors.gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: 16,
    },
    subtitle: {
      color: "rgba(0,0,0,0.45)",
      fontSize: 16,
    },
    uploadSection: {
      textAlign: "center",
      marginBottom: 40,
    },
    uploadText: {
      marginTop: 16,
      color: colors.primary,
      fontSize: 14,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: 500,
      color: colors.dark,
      marginBottom: 8,
    },
    input: {
      height: 50,
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.1)",
      "&:hover": {
        borderColor: colors.primary,
      },
      "&:focus": {
        borderColor: colors.primary,
        boxShadow: "0 0 0 2px rgba(255,77,109,0.1)",
      },
    },
    textarea: {
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.1)",
      "&:hover": {
        borderColor: colors.primary,
      },
      "&:focus": {
        borderColor: colors.primary,
        boxShadow: "0 0 0 2px rgba(255,77,109,0.1)",
      },
    },
    uploadButton: {
      width: 150,
      height: 150,
      borderRadius: "50%",
      border: `2px dashed ${colors.primary}`,
      background: "rgba(255,77,109,0.05)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        background: "rgba(255,77,109,0.1)",
        transform: "scale(1.02)",
      },
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 16,
      marginTop: 40,
    },
    cancelButton: {
      height: 45,
      padding: "0 30px",
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    },
    saveButton: {
      height: 45,
      padding: "0 30px",
      borderRadius: 12,
      background: colors.gradient,
      border: "none",
      boxShadow: "0 8px 20px rgba(255,77,109,0.3)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 25px rgba(255,77,109,0.4)",
      },
    },
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (fileList[0]?.originFileObj) {
        message.loading({ content: "Đang tải ảnh lên...", key: "upload" });
        const url = await uploadFile(fileList[0].originFileObj);
        localStorage.setItem("userAvatar", url);
        message.success({
          content: "Cập nhật ảnh đại diện thành công!",
          key: "upload",
        });
      }

      // Lưu thông tin vào localStorage
      localStorage.setItem("userName", values.name);
      localStorage.setItem("userEmail", values.email);
      localStorage.setItem("userLocation", values.location);
      localStorage.setItem("userBio", values.bio);

      message.success("Cập nhật thông tin thành công!");
      navigate("/profile");
    } catch (error) {
      console.error("Save error:", error);
      message.error("Có lỗi xảy ra khi lưu thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.pageContainer}
    >
      <Card style={styles.mainCard}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={styles.header}
        >
          <Title level={2} style={styles.title}>
            Chỉnh sửa hồ sơ
          </Title>
          <Text style={styles.subtitle}>
            Cập nhật thông tin cá nhân của bạn
          </Text>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.uploadSection}
        >
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
            beforeUpload={() => false}
            showUploadList={false}
          >
            {fileList.length >= 1 ? (
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={fileList[0].url}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            ) : (
              <div style={styles.uploadButton}>
                <div style={{ textAlign: "center" }}>
                  <CameraOutlined
                    style={{ fontSize: 24, color: colors.primary }}
                  />
                  <p style={styles.uploadText}>Thay đổi ảnh đại diện</p>
                </div>
              </div>
            )}
          </Upload>
        </motion.div>

        <Divider style={{ borderColor: "rgba(0,0,0,0.06)" }} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: localStorage.getItem("userName") || "",
              email: localStorage.getItem("userEmail") || "",
              location: localStorage.getItem("userLocation") || "",
              bio: localStorage.getItem("userBio") || "",
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label={<Text style={styles.formLabel}>Họ và tên</Text>}
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: colors.primary }} />}
                placeholder="Nhập họ và tên của bạn"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text style={styles.formLabel}>Email</Text>}
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: colors.primary }} />}
                placeholder="Nhập địa chỉ email"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="location"
              label={<Text style={styles.formLabel}>Địa chỉ</Text>}
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input
                prefix={
                  <EnvironmentOutlined style={{ color: colors.primary }} />
                }
                placeholder="Nhập địa chỉ của bạn"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="bio"
              label={<Text style={styles.formLabel}>Giới thiệu</Text>}
              rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
            >
              <TextArea
                placeholder="Viết một vài dòng giới thiệu về bản thân"
                rows={4}
                style={styles.textarea}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <div style={styles.buttonGroup}>
              <Button
                icon={<RollbackOutlined />}
                style={styles.cancelButton}
                onClick={() => navigate("/profile")}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                style={styles.saveButton}
                onClick={() => form.submit()}
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </motion.div>
      </Card>

      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={previewImage}
      />
    </motion.div>
  );
}
