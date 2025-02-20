import React, { useState, useEffect } from "react";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HeartOutlined,
} from "@ant-design/icons";

export const UserDropdown = ({ user }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem("userName") || "User",
    avatar: localStorage.getItem("userAvatar"),
  });

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const updateUserInfo = () => {
      setUserInfo({
        name: localStorage.getItem("userName") || "User",
        avatar: localStorage.getItem("userAvatar"),
      });
    };

    window.addEventListener("storage", updateUserInfo);
    return () => window.removeEventListener("storage", updateUserInfo);
  }, []);

  // Tách tên thành các phần
  const nameParts = userInfo.name.split(" ");
  const firstName = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts[1] : "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const userMenu = (
    <div className="bg-white rounded-xl shadow-lg py-2 w-52 border border-gray-100">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center space-x-3">
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {firstName.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-800">
              {userInfo.name}
            </h3>
          </div>
        </div>
      </div>

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
            localStorage.clear();
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
      <button className="flex items-center space-x-2 hover:bg-gray-300 rounded-xl transition-colors p-2 w-40">
        {userInfo.avatar ? (
          <img
            src={userInfo.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-medium">
              {firstName.charAt(0) || "U"}
            </span>
          </div>
        )}
        <div className="hidden md:block text-left">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-medium text-gray-700">{firstName}</p>
            {middleName && (
              <p className="text-sm font-medium text-gray-700">{middleName}</p>
            )}
            {lastName && (
              <p className="text-sm font-medium text-gray-700">{lastName}</p>
            )}
          </div>
        </div>
      </button>
    </Dropdown>
  );
};
