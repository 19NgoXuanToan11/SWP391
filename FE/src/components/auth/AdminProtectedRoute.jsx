import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập và có quyền admin không
  const isAuthenticated =
    auth?.isAuthenticated || !!localStorage.getItem("token");
  const isAdmin =
    auth?.user?.roleId === 1 ||
    auth?.user?.role === "Admin" ||
    auth?.user?.isAdmin ||
    localStorage.getItem("isAdmin") === "true";

  // Thêm kiểm tra khi chuyển từ trang người dùng sang trang admin
  useEffect(() => {
    // Nếu người dùng vừa từ trang thường truy cập vào trang admin
    const previousPage = sessionStorage.getItem("previousPage");
    const currentPage = location.pathname;

    // Lưu trang hiện tại vào session storage
    sessionStorage.setItem("previousPage", currentPage);

    // Nếu trước đó đang ở trang người dùng và hiện tại là trang admin
    if (
      previousPage &&
      !previousPage.includes("/admin") &&
      currentPage.includes("/admin")
    ) {
      // Đảm bảo đã thiết lập chế độ admin
      if (isAdmin) {
        localStorage.setItem("auth_mode", "admin");
        localStorage.setItem("isAdmin", "true");
      } else {
        navigate("/admin/login", { replace: true });
      }
    }
  }, [location.pathname, navigate, isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    // Chuyển hướng đến trang đăng nhập admin với thông tin về trang đang cố gắng truy cập
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}
