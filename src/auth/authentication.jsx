import React from "react";
import { Navigate } from "react-router-dom";

const Authentication = ({ children }) => {
  const isAuthenticated = false; // Thay đổi điều này dựa trên trạng thái xác thực thực tế

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default Authentication;
