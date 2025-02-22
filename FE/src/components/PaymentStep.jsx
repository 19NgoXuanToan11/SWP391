import React from "react";
import { Steps } from "antd";
import {
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export function PaymentSteps({ current }) {
  return (
    <div className="mb-8">
      <Steps
        current={current}
        items={[
          {
            title: "Giỏ Hàng",
            icon: <ShoppingCartOutlined />,
          },
          {
            title: "Thanh Toán",
            icon: <SafetyCertificateOutlined />,
          },
          {
            title: "Hoàn Tất",
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
    </div>
  );
}
