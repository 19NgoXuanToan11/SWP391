import React, { useState } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  GiftOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/auth/authSlice";

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    { path: "/admin/account", icon: <UserOutlined />, label: "Tài khoản" },
    { path: "/admin/order", icon: <ShoppingCartOutlined />, label: "Đơn hàng" },
    { path: "/admin/products", icon: <GiftOutlined />, label: "Sản phẩm" },
    { path: "/admin/category", icon: <AppstoreOutlined />, label: "Danh mục" },
    { path: "/admin/brand", icon: <TagOutlined />, label: "Thương hiệu" },
    {
      path: "/admin/promotion",
      icon: <PercentageOutlined />,
      label: "Khuyến mãi",
    },
  ];

  const handleLogout = () => {
    // Lưu lại allCarts và allWishlists
    const allCarts = localStorage.getItem("allCarts");
    const allWishlists = localStorage.getItem("allWishlists");

    // Xóa các thông tin xác thực
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_sessionId");
    localStorage.removeItem("auth_isAdmin");
    localStorage.removeItem("auth_mode");
    sessionStorage.removeItem("previousPage");

    // Khôi phục giỏ hàng và danh sách yêu thích
    if (allCarts) localStorage.setItem("allCarts", allCarts);
    if (allWishlists) localStorage.setItem("allWishlists", allWishlists);

    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white transition-all duration-300 ease-in-out relative flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white text-gray-800 p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      {/* Logo Section */}
      <div
        className={`p-6 flex items-center ${
          collapsed ? "justify-center" : "justify-start"
        } border-b border-gray-700`}
      >
        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {collapsed ? "BC" : "Beauty & Care"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4 flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path}>
                  <div
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`text-xl ${isActive ? "animate-pulse" : ""}`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span
                        className={`ml-4 font-medium ${
                          isActive ? "font-semibold" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200
            text-red-300 hover:bg-red-500/20 hover:text-white group
          `}
        >
          <span className="text-xl">
            <LogoutOutlined />
          </span>
          {!collapsed && <span className="ml-4 font-medium">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
