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
import blackWhiteLogo from "../assets/pictures/black_white_on_trans.png";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import { UserDropdown } from "./userDropdown";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;

  // Lấy số lượng sản phẩm từ Redux store
  const cartQuantity = useSelector((state) => state.cart.quantity);
  const wishlistTotal = useSelector((state) => state.wishlist.total);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kiểm tra xem có thông tin người dùng trong Redux không
  useEffect(() => {
    // Nếu đã đăng nhập nhưng không có thông tin user trong Redux
    if (isAuthenticated && !user) {
      // Lấy thông tin từ localStorage
      const userName = localStorage.getItem("userName");
      const token = localStorage.getItem("token");

      if (userName && token) {
        // Khôi phục thông tin vào Redux
        dispatch(
          setCredentials({
            user: { name: userName, username: userName },
            token: token,
          })
        );
      }
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-sm h-[80px]"
          : "bg-white h-[150px]"
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
              <NavLink
                to="/about"
                icon={<UserOutlined className="text-xl" />}
                text="Giới thiệu"
              />
              <NavLink
                to="/product"
                icon={<ShoppingOutlined className="text-xl" />}
                text="Sản phẩm"
              />
              <NavLink
                to="/contact"
                icon={<ContactsOutlined className="text-xl" />}
                text="Liên hệ"
              />
              <NavLink
                to="/quiz-landing"
                icon={<FileDoneOutlined className="text-xl" />}
                text="Kiểm tra"
              />
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center ml-16 space-x-6">
              {/* Giỏ hàng */}
              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 border border-gray-200 
                          rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <ShoppingCartOutlined className="text-xl text-gray-500 group-hover:text-pink-700 transition-colors" />
                <span className="font-medium text-base whitespace-nowrap">
                  Giỏ hàng
                </span>
                {cartQuantity > 0 && (
                  <span
                    className="flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-700 
                              text-sm font-semibold rounded-full group-hover:bg-pink-200 transition-colors"
                  >
                    {cartQuantity}
                  </span>
                )}
              </Link>

              {/* Phần xác thực */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    {/* Wishlist Icon với số lượng */}
                    <Link
                      to="/wishlist"
                      className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
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
                    <UserDropdown user={user} />
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
