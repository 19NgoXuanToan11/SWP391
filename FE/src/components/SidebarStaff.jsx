import React, { useState } from "react";
import {
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { Badge, Avatar, Tooltip } from "antd";

const SidebarStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const menuItems = [
    {
      path: "/staff/orders",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý đơn hàng",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/staff/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white transition-all duration-300 ease-in-out relative flex flex-col shadow-xl`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white text-gray-800 p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      {/* Logo */}
      <div
        className={`p-6 flex items-center ${
          collapsed ? "justify-center" : "justify-start"
        } border-b border-gray-700`}
      >
        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {collapsed ? "BS" : "Beauty & Care"}
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 mt-5">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Tooltip
                title={collapsed ? item.label : ""}
                placement="right"
                mouseEnterDelay={0.5}
              >
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-xl transition-colors ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.badge ? (
                    <Badge count={item.badge} size="small">
                      <span className="text-xl">{item.icon}</span>
                    </Badge>
                  ) : (
                    <span className="text-xl">{item.icon}</span>
                  )}
                  <span
                    className={`ml-3 ${
                      collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                    } transition-all duration-300`}
                  >
                    {item.label}
                  </span>
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <Tooltip title={collapsed ? "Đăng xuất" : ""} placement="right">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 rounded-xl text-gray-300 hover:bg-red-700/30 hover:text-red-400 transition-colors"
          >
            <span className="text-xl">
              <LogoutOutlined />
            </span>
            <span
              className={`ml-3 ${
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              } transition-all duration-300`}
            >
              Đăng xuất
            </span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default SidebarStaff;
