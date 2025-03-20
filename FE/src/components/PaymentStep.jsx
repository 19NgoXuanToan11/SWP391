import React from "react";
import { Steps } from "antd";
import { motion } from "framer-motion";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";

export function PaymentSteps({ current }) {
  const steps = [
    {
      title: "Giỏ Hàng",
      icon: <ShoppingCartOutlined className="text-xl" />,
      color: "text-pink-500",
    },
    {
      title: "Thanh Toán",
      icon: <CreditCardOutlined className="text-xl" />,
      color: "text-pink-500",
    },
    {
      title: "Hoàn Tất",
      icon: <CheckCircleFilled className="text-xl" />,
      color: "text-green-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8 px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <Steps
          current={current}
          className="custom-steps"
          items={steps.map((step, index) => ({
            title: (
              <span
                className={`font-medium ${
                  current === index
                    ? step.color
                    : current > index
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            ),
            description: (
              <span
                className={`text-sm ${
                  current === index
                    ? "text-gray-600"
                    : current > index
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {step.description}
              </span>
            ),
            icon: (
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  current === index
                    ? `${step.color} bg-${step.color.split("-")[1]}-50`
                    : current > index
                    ? "text-green-500 bg-green-50"
                    : "text-gray-400 bg-gray-50"
                }`}
              >
                {current === index && index === 1 ? (
                  <LoadingOutlined className="text-xl animate-spin" />
                ) : (
                  step.icon
                )}
              </div>
            ),
          }))}
        />

        {/* Progress bar */}
        <div className="mt-6 relative">
          <div className="h-1 bg-gray-100 rounded-full">
            <motion.div
              initial={{ width: "0%" }}
              animate={{
                width: `${(current / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-pink-500 to-green-500 rounded-full"
            />
          </div>
          {/* Step dots */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: current >= index ? 1 : 0.5 }}
                className={`w-3 h-3 rounded-full ${
                  current >= index
                    ? "bg-white border-2 border-pink-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
