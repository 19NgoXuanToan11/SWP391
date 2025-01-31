import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  LoginOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  BellOutlined,
  HeartOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import blackWhiteLogo from "../assets/pictures/black_white_on_trans.png";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import { UserDropdown } from "./userDropdown";
import { useGetUserProfileQuery } from "../services/api/beautyShopApi";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { data: user, isLoading } = useGetUserProfileQuery();
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-sm h-[100px]"
          : "bg-white h-[90px]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center transition-transform duration-300 hover:opacity-80"
          >
            <img
              src={blackWhiteLogo}
              alt="Beauty & Care Logo"
              className={`transition-all duration-300 ${
                isScrolled ? "h-[120px]" : "h-[120px]"
              }`}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center justify-center flex-1 px-8">
            {/* Primary Navigation */}
            <div className="hidden lg:flex items-center justify-between space-x-8 w-full max-w-2xl">
              <NavLink
                to="/"
                icon={<HomeOutlined className="text-lg" />}
                text="Home"
              />
              <NavLink
                to="/about"
                icon={<UserOutlined className="text-lg" />}
                text="About"
              />
              <NavLink
                to="/product"
                icon={<ShoppingOutlined className="text-lg" />}
                text="Products"
              />
              <NavLink
                to="/contact"
                icon={<ContactsOutlined className="text-lg" />}
                text="Contact"
              />
              <NavLink
                to="/quiz-landing"
                icon={<FileDoneOutlined className="text-lg" />}
                text="Quiz"
              />
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center ml-auto space-x-6">
              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 
                          rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <span className="flex items-center justify-center w-5 h-5">
                  <ShoppingCartOutlined className="text-lg text-gray-500 group-hover:text-pink-700 transition-colors" />
                </span>
                <span className="font-medium">Cart</span>
                <span
                  className="flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-700 
                               text-xs font-semibold rounded-full group-hover:bg-gray-200 transition-colors"
                >
                  3
                </span>
              </Link>

              {/* Auth Section */}
              <div className="flex items-center space-x-6">
                {isAuthenticated ? (
                  <UserDropdown user={user} />
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <UserOutlined className="text-lg" />
                      <span className="text-sm">Đăng nhập / Đăng ký</span>
                    </Link>
                  </>
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
      className="flex items-center text-gray-600 hover:text-gray-900 px-4 py-2 
                relative group transition-colors duration-300"
    >
      {/* Icon và Text container */}
      <div className="flex items-center space-x-2">
        <span className="flex items-center justify-center w-5 h-5">{icon}</span>
        <span className="font-medium">{text}</span>
      </div>

      {/* Hover Effect Border */}
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 
                     transform scale-x-0 group-hover:scale-x-100 
                     transition-transform duration-300 origin-left"
      ></span>
    </Link>
  );
}
