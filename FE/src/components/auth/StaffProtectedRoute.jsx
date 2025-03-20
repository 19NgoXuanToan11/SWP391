import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const StaffProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  // Kiểm tra xem người dùng đã đăng nhập và có quyền staff hoặc admin không
  const isAuthenticated =
    auth?.isAuthenticated || !!localStorage.getItem("auth_token");
  const isStaff =
    auth?.user?.role === "staff" ||
    auth?.user?.role === "Admin" ||
    localStorage.getItem("auth_user")?.includes('"role":"staff"') ||
    localStorage.getItem("auth_isAdmin") === "true";

  if (!isAuthenticated || !isStaff) {
    // Chuyển hướng đến trang đăng nhập staff với thông tin về trang đang cố gắng truy cập
    return (
      <Navigate to="/staff/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default StaffProtectedRoute;
