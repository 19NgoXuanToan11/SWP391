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
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { message } from "antd";
import UserAvatar from "./common/UserAvatar";

export const UserDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    name: user?.name || localStorage.getItem("userName") || "User",
    avatar: user?.photoURL || localStorage.getItem("userAvatar"),
  });

  // Cập nhật userInfo khi prop user thay đổi
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || user.username || "User",
        avatar: user.photoURL || localStorage.getItem("userAvatar"),
      });
    }
  }, [user]);

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "auth_token" ||
        e.key === "auth_user" ||
        e.key === "auth_logout_event" ||
        e.key?.startsWith("userAvatar_") ||
        e.key === null
      ) {
        const userStr = localStorage.getItem("auth_user");

        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            const username = userData.username || userData.name || "User";

            // Tạo key riêng cho mỗi user
            const avatarKey = `userAvatar_${username}`;

            // Thử lấy avatar từ nhiều nguồn
            const avatarUrl =
              userData.photoURL ||
              localStorage.getItem(avatarKey) ||
              sessionStorage.getItem(avatarKey);

            // Nếu không có avatar, thử lấy từ IndexedDB
            if (!avatarUrl) {
              getAvatarFromIndexedDB(username).then((url) => {
                if (url) {
                  setUserInfo((prev) => ({ ...prev, avatar: url }));
                  // Khôi phục vào localStorage với key riêng
                  localStorage.setItem(avatarKey, url);
                }
              });
            }

            setUserInfo({
              name: username,
              avatar: avatarUrl || null,
            });
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Thêm hàm lấy avatar từ IndexedDB (giống như trong ProfilePage)
  const getAvatarFromIndexedDB = (username) => {
    // ... code giống như trong ProfilePage
  };

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
  ];

  // Định nghĩa hàm handleLogout
  const handleLogout = () => {
    try {
      // Xóa giỏ hàng và danh sách yêu thích trong localStorage
      localStorage.removeItem("allCarts");
      localStorage.removeItem("allWishlists");

      // Xóa thông tin đăng nhập từ localStorage ngay lập tức
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_sessionId");
      localStorage.removeItem("auth_isAdmin");

      // Hiển thị thông báo
      message.success("Đăng xuất thành công!");

      // Kích hoạt sự kiện storage để các tab khác biết về việc đăng xuất
      const logoutEvent = new Date().getTime();
      localStorage.setItem("auth_logout_event", logoutEvent);

      // Chuyển hướng đến trang login thay vì tải lại trang hiện tại
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      message.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  const userMenu = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-xl p-2 min-w-[250px] border border-gray-100"
    >
      <div className="p-3">
        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Link
                to={item.path}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm text-gray-700 
                  hover:bg-gray-50 transition-all duration-300 group"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-lg 
                  bg-gray-100 group-hover:bg-pink-100 transition-colors duration-300"
                >
                  <span className="text-gray-500 group-hover:text-pink-600">
                    {item.icon}
                  </span>
                </span>
                <span className="ml-3">{item.label}</span>
              </Link>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
          >
            <button
              onClick={handleLogout}
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
      <div className="flex items-center space-x-2 cursor-pointer">
        <UserAvatar size={40} className="cursor-pointer" />
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {userInfo.name}
        </span>
      </div>
    </Dropdown>
  );
};
