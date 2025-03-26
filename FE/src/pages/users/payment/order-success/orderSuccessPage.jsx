import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Result, Space, Tag } from "antd";
import {
  ShoppingOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PaymentSteps } from "../../../../components/payment-step/PaymentStep";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../../store/slices/cart/cartSlice";
const { Title, Text, Paragraph } = Typography;

function OrderSuccessPage() {
  const query = new URLSearchParams(useLocation().search);
  console.log(query);
  const navigate = useNavigate();
  const orderNumber = "ORD-" + Date.now();
  const orderCode = query.get("orderCode") || "ORD-DEFAULT";

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderCode) {
      axios
        .get(`https://localhost:7285/Payment/orderCode/${orderCode}`)
        .then((res) => {
          if (res.data.error === 0) {
            setPayment(res.data.data);
          }
        })
        .catch((err) => console.error("Lỗi khi gọi API:", err))
        .finally(() => setLoading(false));
    }
  }, [orderCode]);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  console.log(payment);
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <PaymentSteps current={2} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl rounded-3xl overflow-hidden border-0 mt-8">
            <Result
              icon={
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <CheckCircleFilled className="text-6xl text-green-500" />
                </motion.div>
              }
              title={
                <Title
                  level={2}
                  className="!mt-6 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent"
                >
                  Đặt Hàng Thành Công!
                </Title>
              }
              subTitle={
                <Paragraph className="text-gray-500 text-lg max-w-lg mx-auto">
                  Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý ngay
                  lập tức.
                </Paragraph>
              }
            />

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 rounded-2xl mb-8">
                <Space direction="vertical" size="large" className="w-full">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500">Mã đơn hàng:</Text>
                    <Tag color="blue" className="text-base px-4 py-1">
                      {payment?.orderId}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500">Trạng thái:</Text>
                    <Tag
                      color="success"
                      icon={<CheckCircleFilled />}
                      className="text-base px-4 py-1"
                    >
                      Đã xác nhận
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500">
                      Thời gian giao hàng dự kiến:
                    </Text>
                    <Space>
                      <ClockCircleOutlined className="text-blue-500" />
                      <Text strong>2-3 ngày</Text>
                    </Space>
                  </div>
                </Space>
              </Card>

              <Space className="w-full justify-center" size="large">
                <button
                  onClick={() => navigate("/product")}
                  className="h-12 px-8 bg-white border-2 border-gray-200 rounded-full
                    hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50
                    hover:border-pink-300 hover:text-pink-500 
                    transition-all duration-300 transform hover:scale-105
                    flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  <ShoppingOutlined className="text-lg" />
                  Tiếp Tục Mua Sắm
                </button>
              </Space>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
