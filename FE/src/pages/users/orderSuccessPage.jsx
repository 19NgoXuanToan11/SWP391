import React from "react";
import { Card, Typography, Button, Result } from "antd";
import { ShoppingOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PaymentSteps } from "../../components/common/PaymentSteps";

const { Title, Text } = Typography;

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <PaymentSteps current={2} />

        <Card className="shadow-lg rounded-3xl">
          <Result
            status="success"
            title="Thanh Toán Thành Công!"
            subTitle="Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý ngay lập tức."
            extra={[
              <Button
                type="primary"
                key="orders"
                icon={<FileTextOutlined />}
                onClick={() => navigate("/orders")}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                Xem Đơn Hàng
              </Button>,
              <Button
                key="shop"
                icon={<ShoppingOutlined />}
                onClick={() => navigate("/products")}
              >
                Tiếp Tục Mua Sắm
              </Button>,
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
