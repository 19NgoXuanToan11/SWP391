import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineCheck } from "react-icons/hi";
import { useVerifyEmailMutation } from "../../../services/api/beautyShopApi";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [countdown, setCountdown] = useState(5);
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setVerificationStatus("error");
      message.error("Token xác thực không hợp lệ");
      setTimeout(() => navigate("/login"), 10000);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);

        if (response.error) {
          throw new Error(response.error.data?.message || "Xác thực thất bại");
        }

        setVerificationStatus("success");
        message.success("Xác thực email thành công!");

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        setVerificationStatus("error");
        message.error("Xác thực email thất bại");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    verifyToken();
  }, [navigate, searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center space-y-4">
          {verificationStatus === "verifying" && (
            <>
              <div className="w-20 h-20 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Đang xác thực email
              </h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <HiOutlineCheck className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Xác thực thành công!
              </h2>
              <p className="text-gray-600">
                Email của bạn đã được xác thực. Chuyển hướng sau {countdown}{" "}
                giây...
              </p>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <HiOutlineMail className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Xác thực thất bại
              </h2>
              <p className="text-gray-600">
                Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Quay lại đăng nhập
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
