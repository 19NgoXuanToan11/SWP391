import React, { useState, useEffect } from "react";
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
  Skeleton,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  CameraOutlined,
  SaveOutlined,
  RollbackOutlined,
  LoadingOutlined,
  PhoneOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import uploadFile from "../../../../utils/upload/upload";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../../../store/slices/profile/profileSlice";

const { Title, Text } = Typography;
const { TextArea } = Input;

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    avatar: null,
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    // Lấy thông tin từ auth_user trong localStorage
    const authUserStr = localStorage.getItem("auth_user");
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        setInitialValues({
          username: authUser.username || "",
          email: authUser.email || "",
          phoneNumber: authUser.phoneNumber || "",
          address: authUser.address || "",
        });
        setUserInfo({
          username: authUser.username || "",
          email: authUser.email || "",
          avatar: authUser.photoURL || null,
          phoneNumber: authUser.phoneNumber || "",
          address: authUser.address || "",
        });
        form.setFieldsValue({
          username: authUser.username || "",
          email: authUser.email || "",
          phoneNumber: authUser.phoneNumber || "",
          address: authUser.address || "",
        });

        // Nếu có ID người dùng, lấy thông tin từ API để đảm bảo dữ liệu mới nhất
        if (authUser.id) {
          fetchUserInfoFromAPI(authUser.id);
        }
      } catch (error) {
        console.error("Error parsing auth_user:", error);
      }
    }
  }, [form]);

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
      width: 128,
      height: 128,
      borderRadius: "50%",
      border: "2px dashed #ff758c",
      background: "rgba(255,117,140,0.05)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        background: "rgba(255,117,140,0.1)",
        borderColor: "#ff4d6d",
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
    setLoading(true);
    try {
      // Lấy thông tin người dùng từ localStorage
      const authUserStr = localStorage.getItem("auth_user");
      if (!authUserStr) {
        message.error("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      const authUser = JSON.parse(authUserStr);
      const userId = authUser.id;

      if (!userId) {
        message.error("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      // Nếu đã tải ảnh lên, upload file và lấy URL
      let avatarUrl = userInfo.avatar;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        avatarUrl = await uploadFile(fileList[0].originFileObj);
      }

      // Tạo object data để gửi lên API - sử dụng các trường phù hợp với response
      const updatedUserData = {
        fullName: values.username, // Gán giá trị từ trường username form vào fullName API
        email: values.email,
        phoneNumber: values.phoneNumber || "",
        address: values.address || "",
        isVerification: true,
        isBanned: false,
      };

      console.log("Sending data to API:", updatedUserData);
      console.log("User ID:", userId);

      // Gọi API để cập nhật thông tin
      await axios.put(
        `https://localhost:7285/api/User/${userId}`,
        updatedUserData
      );

      // Cập nhật avatar vào storage riêng của user, không lưu key chung
      const avatarKey = `userAvatar_${values.username}`;

      if (avatarUrl) {
        localStorage.setItem(avatarKey, avatarUrl);
        // Không lưu vào key chung nữa
        // localStorage.setItem(globalAvatarKey, avatarUrl);
      }

      localStorage.removeItem("tempUserAvatar"); // Xóa avatar tạm thời

      // Lưu avatar vào IndexedDB
      saveAvatarToIndexedDB(values.username, avatarUrl);

      // Cập nhật auth_user trong localStorage
      const updatedUser = {
        ...authUser,
        username: authUser.username,
        fullName: values.username,
        email: values.email,
        photoURL: avatarUrl, // Cập nhật URL ảnh mới
        phoneNumber: values.phoneNumber || "",
        address: values.address || "",
      };

      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      // Kích hoạt sự kiện avatar được cập nhật
      window.dispatchEvent(
        new CustomEvent("avatarUpdated", { detail: { avatarUrl } })
      );

      message.success("Cập nhật thông tin thành công");
      navigate("/profile");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lưu avatar vào IndexedDB
  const saveAvatarToIndexedDB = (username, avatarUrl) => {
    // Kiểm tra hỗ trợ IndexedDB
    if (!window.indexedDB) {
      console.log("Trình duyệt không hỗ trợ IndexedDB");
      return;
    }

    const request = window.indexedDB.open("UserAvatarDB", 1);

    request.onerror = (event) => {
      console.error("Lỗi khi mở IndexedDB:", event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("avatars")) {
        db.createObjectStore("avatars", { keyPath: "username" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["avatars"], "readwrite");
      const store = transaction.objectStore("avatars");

      store.put({ username, avatarUrl, timestamp: Date.now() });

      transaction.oncomplete = () => {
        console.log("Avatar đã được lưu vào IndexedDB");
      };

      transaction.onerror = (event) => {
        console.error("Lỗi khi lưu avatar vào IndexedDB:", event.target.error);
      };
    };
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Giới hạn chỉ lấy file mới nhất
    const latestFile =
      newFileList.length > 0 ? [newFileList[newFileList.length - 1]] : [];
    setFileList(latestFile);

    // Nếu có file mới, hiển thị xem trước ngay lập tức
    if (latestFile.length > 0 && latestFile[0].originFileObj) {
      getBase64(latestFile[0].originFileObj).then((url) => {
        setPreviewImage(url);

        // Cập nhật userInfo state để hiển thị hình mới
        setUserInfo((prev) => ({
          ...prev,
          avatar: url,
        }));

        // Đồng bộ ngay vào localStorage để các component khác có thể thấy
        // Lưu ý: Đây chỉ là xem trước, chưa phải lưu chính thức
        const tempAvatarKey = "tempUserAvatar";
        localStorage.setItem(tempAvatarKey, url);

        // Thông báo cho các component khác biết có avatar tạm thời
        window.dispatchEvent(
          new CustomEvent("tempAvatarUpdated", { detail: { avatarUrl: url } })
        );
      });
    }
  };

  const handleGoBack = () => {
    navigate("/profile");
  };

  // Hàm lấy thông tin người dùng từ API
  const fetchUserInfoFromAPI = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7285/api/User/${userId}`
      );
      if (response.data) {
        // Cập nhật form với dữ liệu từ API
        form.setFieldsValue({
          username: response.data.fullName || "", // Hiển thị fullName trong trường username
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
        });

        // Cập nhật state
        setUserInfo((prev) => ({
          ...prev,
          username: response.data.username || "",
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
        }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng từ API:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            bordered={false}
            className="shadow-md rounded-2xl overflow-hidden"
            title={
              <div className="flex items-center">
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="text"
                  onClick={() => navigate("/profile")}
                  style={{ marginRight: 16 }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  Chỉnh sửa hồ sơ
                </Title>
              </div>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleSubmit}
              >
                <div className="text-center mb-8">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={handleChange}
                    onPreview={handlePreview}
                  >
                    {previewImage || userInfo.avatar ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          src={previewImage || userInfo.avatar}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            background: "#ff758c",
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          <CameraOutlined />
                        </div>
                      </div>
                    ) : (
                      <div style={styles.uploadButton}>
                        <PlusOutlined
                          style={{ fontSize: 24, color: "#ff758c" }}
                        />
                        <div style={{ marginTop: 8, color: "#ff758c" }}>
                          Tải ảnh lên
                        </div>
                      </div>
                    )}
                  </Upload>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 8 }}
                  >
                    Nhấn vào ảnh để thay đổi ảnh đại diện
                  </Text>
                </div>

                <Divider />

                <Form.Item
                  label="Họ và tên"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên đầy đủ của bạn"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Nhập email của bạn"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phoneNumber">
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="Nhập số điện thoại của bạn"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                  <Input
                    prefix={<HomeOutlined className="text-gray-400" />}
                    placeholder="Nhập địa chỉ của bạn"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <div className="flex justify-end mt-8 space-x-4">
                  <Button
                    onClick={() => navigate("/profile")}
                    size="large"
                    className="rounded-lg px-8 transition-transform transform hover:scale-105"
                    style={{
                      background: "#f0f0f0",
                      border: "1px solid #d9d9d9",
                      color: "#333",
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="rounded-lg px-8 transition-transform transform hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(255, 117, 140, 0.3)",
                      color: "#fff",
                    }}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
        src={previewImage}
      />
    </div>
  );
};

export default EditProfilePage;
