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
  FileTextOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth/authSlice";
import { message } from "antd";
import UserAvatar from "./UserAvatar";
import { clearCart } from "../../store/slices/cart/cartSlice";
import { clearWishlist } from "../../store/slices/wishlist/wishlistSlice";
import UserService from "../../utils/user/userService";

export const UserDropdown = ({ onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    name: UserService.getFullName(),
    avatar:
      UserService.getCurrentUser()?.photoURL ||
      localStorage.getItem("userAvatar"),
  });

  // Sử dụng effect để đăng ký listener với UserService
  useEffect(() => {
    // Hàm cập nhật thông tin từ service
    const updateFromService = (user) => {
      if (user) {
        setUserInfo({
          name: user.fullName || user.name || user.username || "User",
          avatar: user.photoURL || localStorage.getItem("userAvatar"),
        });
      } else {
        setUserInfo({
          name: "User",
          avatar: null,
        });
      }
    };

    // Đăng ký listener
    const unsubscribe = UserService.subscribe(updateFromService);

    // Lấy thông tin người dùng hiện tại
    updateFromService(UserService.getCurrentUser());

    // Lắng nghe sự kiện cập nhật user
    const handleUserUpdated = (event) => {
      if (event.detail && event.detail.user) {
        updateFromService(event.detail.user);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      unsubscribe();
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
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
    {
      icon: <FileTextOutlined />,
      label: "Lịch sử trắc nghiệm",
      path: "/quiz-history",
    },
  ];

  // Định nghĩa hàm handleLogout
  const handleLogout = () => {
    try {
      // Lưu avatar trước khi xóa dữ liệu
      const userStr = localStorage.getItem("auth_user");
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const username = currentUser?.username;
      const userAvatar = username
        ? localStorage.getItem(`userAvatar_${username}`)
        : null;

      // Lưu lại allCarts và allWishlists
      const allCarts = localStorage.getItem("allCarts");
      const allWishlists = localStorage.getItem("allWishlists");

      // Ghi nhận sự kiện đăng xuất
      const logoutEvent = new Date().getTime();
      localStorage.setItem("auth_logout_event", logoutEvent);

      // Xóa các thông tin xác thực người dùng
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_sessionId");
      localStorage.removeItem("auth_isAdmin");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_mode");

      // Khôi phục dữ liệu giỏ hàng và danh sách yêu thích
      if (allCarts) localStorage.setItem("allCarts", allCarts);
      if (allWishlists) localStorage.setItem("allWishlists", allWishlists);

      // Khôi phục avatar nếu có
      if (username && userAvatar) {
        localStorage.setItem(`userAvatar_${username}`, userAvatar);
      }

      // Dispatch action để xóa giỏ hàng và danh sách yêu thích trong Redux store
      dispatch(clearCart());
      dispatch(clearWishlist());

      // Sử dụng UserService cho logout
      UserService.logout();

      // Dispatch Redux action
      dispatch(logout());

      // Hiển thị thông báo
      message.success("Đăng xuất thành công!");

      // Chuyển hướng đến trang login
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      message.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  // Thêm handler cho sự kiện avatar được cập nhật
  const handleAvatarUpdated = (event) => {
    if (event.detail && event.detail.avatarUrl) {
      setUserInfo((prev) => ({
        ...prev,
        avatar: event.detail.avatarUrl,
      }));
    } else {
      // Nếu không có URL trực tiếp, cập nhật lại từ localStorage
      const authUserStr = localStorage.getItem("auth_user");
      if (authUserStr) {
        try {
          const userData = JSON.parse(authUserStr);
          const displayName =
            userData.fullName || userData.username || userData.name || "User";
          const username = userData.username || "";
          const avatarKey = `userAvatar_${username}`;
          const globalKey = "userAvatar";

          // Thử lấy avatar từ nhiều nguồn
          const avatarUrl =
            userData.photoURL ||
            localStorage.getItem(avatarKey) ||
            localStorage.getItem(globalKey);

          setUserInfo({
            name: displayName,
            avatar: avatarUrl || null,
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  };

  // Lắng nghe cả avatar tạm thời (xem trước) và avatar đã lưu chính thức
  const handleTempAvatarUpdated = (event) => {
    if (event.detail && event.detail.avatarUrl) {
      setUserInfo((prev) => ({
        ...prev,
        avatar: event.detail.avatarUrl,
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    window.addEventListener("tempAvatarUpdated", handleTempAvatarUpdated);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
      window.removeEventListener("tempAvatarUpdated", handleTempAvatarUpdated);
    };
  }, []);

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
