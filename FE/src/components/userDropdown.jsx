import React from "react";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HeartOutlined,
} from "@ant-design/icons";

export const UserDropdown = ({ user }) => {
  const navigate = useNavigate();

  const userMenu = (
    <div className="bg-white rounded-xl shadow-lg py-2 w-52 border border-gray-100">
      {/* Thông tin người dùng */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">
              {user?.name || "Người dùng"}
            </h3>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Mục menu */}
      <div className="py-2">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <UserOutlined className="mr-3 text-lg" />
          <span>Hồ sơ của tôi</span>
        </Link>

        <Link
          to="/orders"
          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <ShoppingOutlined className="mr-3 text-lg" />
          <span>Đơn hàng của tôi</span>
        </Link>

        <Link
          to="/wishlist"
          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <HeartOutlined className="mr-3 text-lg" />
          <span>Danh sách yêu thích</span>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogoutOutlined className="mr-3 text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={userMenu}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="user-dropdown-menu"
    >
      <button className="flex items-center space-x-3 hover:bg-gray-100 rounded-xl transition-colors p-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-medium">
            {user?.name?.charAt(0) || "U"}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </button>
    </Dropdown>
  );
};
