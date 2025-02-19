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
<<<<<<< Updated upstream
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
=======

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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
    </Dropdown>
  );
};
