import React from "react";
import { Card, Image, Typography, Button, Space } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import qrImage from "../../assets/pictures/qr.png";
import { PaymentSteps } from "../../components/PaymentStep";

const { Title, Text } = Typography;

function QRPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <PaymentSteps current={1} />

        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/payment")}
          className="mb-4"
        >
          Quay lại
        </Button>

        <Card className="shadow-lg rounded-2xl">
          <div className="text-center">
            <Title level={3} className="mb-6">
              Quét Mã QR Để Thanh Toán
            </Title>

            <div className="flex justify-center mb-6">
              <Image
                src={qrImage}
                alt="QR Code"
                width={300}
                preview={false}
                className="rounded-lg"
              />
            </div>

            <Space direction="vertical" size="large" className="w-full">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text type="secondary">
                  Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã
                </Text>
              </div>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                onClick={() => navigate("/order-success")}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                Tôi Đã Thanh Toán
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default QRPaymentPage;
