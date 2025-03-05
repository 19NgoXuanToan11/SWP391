import React, { useState, useEffect } from "react";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";

export const UserDropdown = ({ user }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: user?.name || localStorage.getItem("userName") || "User",
    avatar: localStorage.getItem("userAvatar"),
  });

  // Cập nhật userInfo khi prop user thay đổi
  useEffect(() => {
    if (user?.name) {
      setUserInfo((prevState) => ({
        ...prevState,
        name: user.name,
      }));
    }
  }, [user]);

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
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const menuItems = [
    {
      icon: <UserOutlined />,
      label: "Hồ sơ của tôi",
      path: "/profile",
    },
    {
      icon: <ShoppingOutlined />,
      label: "Đơn hàng của tôi",
      path: "/orders",
    },
    {
      icon: <HeartOutlined />,
      label: "Danh sách yêu thích",
      path: "/wishlist",
    },
  ];

  const userMenu = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl py-3 min-w-[240px] w-auto border border-gray-100"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/20"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
                flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-lg font-semibold">
                  {firstName.charAt(0) || "U"}
                </span>
              </div>
            )}
          </motion.div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {userInfo.name}
            </h3>
            <p className="text-sm text-gray-500">Thành viên</p>
          </div>
        </div>
      </div>

      <div className="py-2 px-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.path}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm text-gray-700 
                hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 
                hover:text-purple-600 transition-all duration-300 group"
            >
              <span
                className="w-8 h-8 flex items-center justify-center rounded-lg 
                bg-gradient-to-r from-pink-500/10 to-purple-500/10 group-hover:from-pink-500 
                group-hover:to-purple-500 transition-colors duration-300"
              >
                <span className="text-lg text-purple-600 group-hover:text-white">
                  {item.icon}
                </span>
              </span>
              <span className="ml-3">{item.label}</span>
            </Link>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: menuItems.length * 0.1 }}
        >
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm text-red-600 
              hover:bg-red-50 transition-all duration-300 group mt-2"
          >
            <span
              className="w-8 h-8 flex items-center justify-center rounded-lg 
              bg-red-500/10 group-hover:bg-red-500 transition-colors duration-300"
            >
              <LogoutOutlined className="text-lg text-red-600 group-hover:text-white" />
            </span>
            <span className="ml-3">Đăng xuất</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <Dropdown
      overlay={userMenu}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="user-dropdown-menu"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 hover:bg-white/80 rounded-xl transition-all 
          duration-300 p-2 backdrop-blur-lg shadow-sm hover:shadow-md"
      >
        {userInfo.avatar ? (
          <img
            src={userInfo.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-lg object-cover ring-2 ring-purple-500/20 flex-shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 
            flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <span className="text-white font-semibold">
              {firstName.charAt(0) || "U"}
            </span>
          </div>
        )}

        <div className="hidden md:flex flex-col items-start overflow-hidden">
          <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
            {userInfo.name}
          </p>
          <p className="text-xs text-gray-500">Thành viên</p>
        </div>

        {/* Mobile View - Chỉ hiện chữ cái đầu */}
        <div className="md:hidden flex flex-col items-center">
          <p className="text-sm font-medium text-gray-700">
            {firstName.charAt(0)}
          </p>
        </div>
      </motion.button>
    </Dropdown>
  );
};
