import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";
import { useVerifyEmailMutation } from "../../services/api/beautyShopApi";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      message.error("Token xác thực không hợp lệ");
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        // Gọi API với method GET và token là query parameter
        const response = await verifyEmail(token);

        if (response.error) {
          throw new Error(response.error.data?.message || "Xác thực thất bại");
        }

        if (response.data?.success) {
          message.success(
            response.data.message || "Xác thực email thành công!"
          );

          // Đếm ngược 5 giây
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
        }
      } catch (err) {
        message.error("Xác thực email thất bại");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate, searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Xác thực Email
        </h2>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {countdown > 0
              ? `Chuyển hướng đến trang đăng nhập sau ${countdown} giây...`
              : "Đang chuyển hướng..."}
          </p>
        </div>
      </div>
    </div>
  );
}
