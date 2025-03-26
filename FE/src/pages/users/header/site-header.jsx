import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import blackWhiteLogo from "../../../assets/pictures/black_white_on_trans.png";
import { Link } from "react-router-dom";
import { Dropdown, message } from "antd";
import { UserDropdown } from "../../../components/user/userDropdown";
import { useSelector, useDispatch } from "react-redux";
import {
  setCredentials,
  logout,
  checkSession,
} from "../../../store/slices/auth/authSlice";
import UserAvatar from "../../../components/user/UserAvatar";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, isAuthenticated } = auth;

  // Lấy số lượng sản phẩm từ Redux store
  const cartQuantity = useSelector((state) => state.cart.quantity);
  const wishlistTotal = useSelector((state) => state.wishlist.total);

  // Xử lý scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // Lắng nghe sự kiện localStorage để đồng bộ trạng thái đăng nhập giữa các tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Nếu có thay đổi liên quan đến auth
      if (e.key === "auth_token" || e.key === "auth_user" || e.key === null) {
        // Kiểm tra lại phiên đăng nhập
        dispatch(checkSession());
      }
    };

    // Thêm event listener
    window.addEventListener("storage", handleStorageChange);

    // Kiểm tra phiên đăng nhập mỗi 30 giây
    const intervalId = setInterval(() => {
      dispatch(checkSession());
    }, 30000);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [dispatch]);

  // Hàm đăng xuất
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

      // Sử dụng window.location.reload() để tải lại trang hiện tại
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      message.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  // Thêm vào phần useEffect
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkLoginStatus = () => {
      const isAdminRoute =
        location.pathname.includes("/dashboard") ||
        location.pathname.includes("/admin");

      const isAdminLoggedIn = localStorage.getItem("isAdmin") === "true";
      const authMode = localStorage.getItem("auth_mode");

      // Nếu đang ở trang người dùng thông thường nhưng vẫn có thông tin đăng nhập admin
      if (!isAdminRoute && isAdminLoggedIn && authMode === "admin") {
        // Xóa thông tin đăng nhập admin
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_sessionId");
        localStorage.removeItem("auth_isAdmin");
        localStorage.removeItem("auth_mode");

        // Tải lại trang để cập nhật UI
        window.location.reload();
      }
    };

    checkLoginStatus();
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-sm h-[80px]"
          : "bg-white h-[100px]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 transition-transform duration-300 hover:opacity-80"
          >
            <img
              src={blackWhiteLogo}
              alt="Beauty & Care Logo"
              className={`transition-all duration-300 ${
                isScrolled ? "h-[150px]" : "h-[150px]"
              }`}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center justify-center flex-1 px-8">
            {/* Primary Navigation */}
            <div className="hidden lg:flex items-center space-x-12 w-full max-w-4xl justify-center">
              <NavLink
                to="/"
                icon={<HomeOutlined className="text-xl" />}
                text="Trang chủ"
              />
              {/* <NavLink
                to="/about"
                icon={<UserOutlined className="text-xl" />}
                text="Giới thiệu"
              /> */}
              <NavLink
                to="/product"
                icon={<ShoppingOutlined className="text-xl" />}
                text="Sản phẩm"
              />
              {/* <NavLink
                to="/contact"
                icon={<ContactsOutlined className="text-xl" />}
                text="Liên hệ"
              /> */}
              <NavLink
                to="/quiz-landing"
                icon={<FileDoneOutlined className="text-xl" />}
                text="Trắc nghiệm"
              />
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center ml-16 space-x-6">
              {/* Giỏ hàng */}
              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 border border-gray-200 
                rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group relative"
              >
                <ShoppingCartOutlined className="text-xl" />
                <span className="font-medium text-base whitespace-nowrap">
                  Giỏ hàng
                </span>
                {cartQuantity > 0 && isAuthenticated && (
                  <span
                    className="ml-1 w-5 h-5 bg-pink-500 text-white 
                               text-xs rounded-full flex items-center justify-center"
                  >
                    {cartQuantity}
                  </span>
                )}
              </Link>

              {/* Phần xác thực */}
              <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <>
                    {/* Wishlist Icon với số lượng */}
                    <Link
                      to="/wishlist"
                      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <HeartOutlined className="text-xl" />
                      {wishlistTotal > 0 && (
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white 
                                       text-xs rounded-full flex items-center justify-center"
                        >
                          {wishlistTotal}
                        </span>
                      )}
                    </Link>
                    <UserDropdown user={user} onLogout={handleLogout} />
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:text-gray-900 
                             transition-colors whitespace-nowrap text-base font-medium"
                  >
                    <UserOutlined className="text-xl" />
                    <span>Đăng nhập/Đăng ký</span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

// NavLink Component
function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center text-gray-600 hover:text-gray-900 px-4 py-2 
                relative group transition-colors duration-300 text-center whitespace-nowrap"
    >
      <span className="flex items-center justify-center w-6 h-6 mb-1.5">
        {icon}
      </span>
      <span className="text-base font-medium">{text}</span>
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 
                   transform scale-x-0 group-hover:scale-x-100 
                   transition-transform duration-300 origin-left"
      ></span>
    </Link>
  );
}
