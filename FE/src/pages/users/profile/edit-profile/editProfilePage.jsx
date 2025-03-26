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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import uploadFile from "../../../../utils/upload/upload";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../../../store/slices/profile/profileSlice";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
  });
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    avatar: null,
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
        });
        setUserInfo({
          username: authUser.username || "",
          email: authUser.email || "",
          avatar: authUser.photoURL || null,
        });
        form.setFieldsValue({
          username: authUser.username || "",
          email: authUser.email || "",
        });
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
      let avatarUrl = userInfo.avatar;

      // Upload avatar mới nếu có
      if (fileList.length > 0 && fileList[0].originFileObj) {
        avatarUrl = await uploadFile(fileList[0].originFileObj);
      }

      // Lấy thông tin hiện tại từ auth_user
      const authUserStr = localStorage.getItem("auth_user");
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);

        // So sánh dữ liệu mới với dữ liệu cũ
        const isDataChanged =
          values.username !== authUser.username ||
          values.email !== authUser.email ||
          avatarUrl !== authUser.photoURL;

        // Chỉ cập nhật nếu có thay đổi
        if (isDataChanged) {
          // Cập nhật thông tin mới bao gồm avatar
          const updatedUser = {
            ...authUser,
            username: values.username,
            email: values.email,
            photoURL: avatarUrl,
          };

          // Lưu vào localStorage
          localStorage.setItem("auth_user", JSON.stringify(updatedUser));

          // Lưu riêng avatar URL với key theo username để phân biệt giữa các user
          if (avatarUrl) {
            const avatarKey = `userAvatar_${values.username}`;
            localStorage.setItem(avatarKey, avatarUrl);
            sessionStorage.setItem(avatarKey, avatarUrl);

            // Lưu vào IndexedDB để duy trì lâu dài
            saveAvatarToIndexedDB(values.username, avatarUrl);
          }

          // Kích hoạt sự kiện storage để các components khác cập nhật
          window.dispatchEvent(new Event("storage"));

          message.success("Cập nhật thông tin thành công!");
        }

        navigate("/profile");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.error(error);
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
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    // Giới hạn chỉ 1 file
    if (newFileList.length > 1) {
      newFileList = [newFileList[newFileList.length - 1]];
    }
    setFileList(newFileList);

    // Preview image
    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-8 bg-white border-b border-gray-100 shadow-sm">
              <h1 className="text-2xl font-semibold text-center text-gray-800">
                Chỉnh sửa hồ sơ
              </h1>
              <p className="text-gray-500 text-center mt-2 text-sm">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>

            {/* Avatar Upload Section */}
            <div className="relative mt-20 text-center">
              <div className="inline-block">
                <Upload
                  listType="picture-circle"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  className="avatar-uploader"
                >
                  {fileList.length >= 1 ? null : (
                    <div
                      className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg 
                      flex items-center justify-center overflow-hidden hover:opacity-90 transition-all
                      cursor-pointer group relative"
                    >
                      {userInfo.avatar ? (
                        <>
                          <img
                            src={userInfo.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center 
                            justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CameraOutlined className="text-white text-2xl" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <CameraOutlined className="text-3xl text-pink-500 mb-2" />
                        </div>
                      )}
                    </div>
                  )}
                </Upload>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleSubmit}
                className="space-y-6"
              >
                <Form.Item
                  name="username"
                  label={
                    <span className="text-gray-700 font-medium">Username</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập username" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-pink-500" />}
                    placeholder="Nhập username của bạn"
                    className="h-12 rounded-xl border-gray-200 hover:border-pink-500 
                      focus:border-pink-500 transition-colors"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={
                    <span className="text-gray-700 font-medium">Email</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-pink-500" />}
                    placeholder="Nhập địa chỉ email"
                    className="h-12 rounded-xl border-gray-200 hover:border-pink-500 
                      focus:border-pink-500 transition-colors"
                  />
                </Form.Item>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGoBack}
                    className="h-12 px-8 rounded-xl border border-gray-200 hover:border-pink-500 
                      hover:text-pink-500 transition-all flex items-center justify-center gap-2
                      backdrop-blur-sm bg-white/70 shadow-sm"
                  >
                    <RollbackOutlined />
                    Quay lại
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="primary"
                    disabled={loading}
                    onClick={() => form.submit()}
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
                      border-0 hover:opacity-90 transition-all text-white font-medium
                      hover:shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">
                          <LoadingOutlined />
                        </span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <SaveOutlined />
                        Lưu thay đổi
                      </>
                    )}
                  </motion.button>
                </div>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={previewImage}
      />
    </div>
  );
}
