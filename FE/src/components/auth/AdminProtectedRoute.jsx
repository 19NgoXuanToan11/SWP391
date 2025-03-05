import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  // Kiểm tra xem người dùng đã đăng nhập và có quyền admin không
  const isAuthenticated =
    auth?.isAuthenticated || !!localStorage.getItem("token");
  const isAdmin =
    auth?.user?.roleId === 1 ||
    auth?.user?.isAdmin ||
    localStorage.getItem("isAdmin") === "true";

  if (!isAuthenticated || !isAdmin) {
    // Chuyển hướng đến trang đăng nhập admin với thông tin về trang đang cố gắng truy cập
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};
