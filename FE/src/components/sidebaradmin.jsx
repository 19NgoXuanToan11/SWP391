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
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { path: "/account", icon: <UserOutlined />, label: "Users" },
    { path: "/order", icon: <ShoppingCartOutlined />, label: "Orders" },
    { path: "/category", icon: <AppstoreOutlined />, label: "Categories" },
    { path: "/brand", icon: <TagOutlined />, label: "Brands" },
    { path: "/voucher", icon: <GiftOutlined />, label: "Voucher" },
    { path: "/setting", icon: <SettingOutlined />, label: "Settings" },
    { path: "/abouts", icon: <InfoCircleOutlined />, label: "About" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white transition-all duration-300 ease-in-out relative`}
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
          {collapsed ? "BS" : "BeautyShop"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
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

      {/* Bottom Section */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300">Need Help?</h3>
            <p className="text-xs text-gray-400 mt-1">
              Contact our support team
            </p>
            <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Get Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarAdmin;
