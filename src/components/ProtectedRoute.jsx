import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
