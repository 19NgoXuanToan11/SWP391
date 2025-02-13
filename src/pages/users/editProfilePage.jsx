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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    console.log(values);

    if (values.avatar) {
      const url = await uploadFile(values.avatar.file.originFileObj);
      values.avatar = url;
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

  const handleSave = async () => {
    try {
      if (fileList[0]?.originFileObj) {
        message.loading({ content: "Đang tải ảnh lên...", key: "upload" });
        const url = await uploadFile(fileList[0].originFileObj);
        localStorage.setItem("userAvatar", url);
        message.success({
          content: "Cập nhật ảnh đại diện thành công!",
          key: "upload",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error({
        content: "Có lỗi xảy ra khi upload ảnh! " + error.message,
        key: "upload",
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl rounded-2xl">
          <Title level={2} className="text-center mb-8">
            Chỉnh sửa hồ sơ
          </Title>

          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
            beforeUpload={() => false}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: "Nguyễn Văn A",
              email: "nguyenvana@example.com",
              location: "Hà Nội, Việt Nam",
              bio: "Tôi là chuyên gia tư vấn làm đẹp với hơn 3 năm kinh nghiệm trong ngành mỹ phẩm cao cấp.",
            }}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập họ và tên"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Nhập email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="Nhập địa chỉ"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="bio"
              label="Giới thiệu"
              rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
            >
              <TextArea
                placeholder="Nhập giới thiệu về bản thân"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Space className="w-full justify-end">
              <Button onClick={() => navigate("/profile")}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Form>
        </Card>
      </div>
    </div>
  );
}
