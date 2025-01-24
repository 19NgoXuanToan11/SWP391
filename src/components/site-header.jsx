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
} from "@ant-design/icons";
import blackWhiteLogo from "../assets/pictures/black_white_on_trans.png";
import { Link } from "react-router-dom";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
            <div className="hidden lg:flex items-center justify-between w-full max-w-2xl">
              <NavLink to="/" icon={<HomeOutlined />} text="Home" />
              <NavLink to="/about" icon={<UserOutlined />} text="About" />
              <NavLink
                to="/product"
                icon={<ShoppingOutlined />}
                text="Products"
              />
              <NavLink
                to="/contact"
                icon={<ContactsOutlined />}
                text="Contact"
              />
              <NavLink
                to="/quiz-landing"
                icon={<FileDoneOutlined />}
                text="Quiz"
              />
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center space-x-6 ml-auto">
              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 
                          rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <ShoppingCartOutlined className="text-gray-500 group-hover:text-pink-700 transition-colors" />
                <span className="font-medium">Cart</span>
                <span
                  className="flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-700 
                               text-xs font-semibold rounded-full group-hover:bg-gray-200 transition-colors"
                >
                  3
                </span>
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hidden md:flex items-center px-4 py-2 text-gray-700 border border-gray-200 
                            rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  <LoginOutlined className="mr-2 text-pink-500" />
                  <span className="font-medium">Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center px-4 py-2 bg-pink-500 text-white 
                            rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Sign Up
                </Link>
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
      <span className="text-lg mr-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <span className="font-medium">{text}</span>

      {/* Hover Effect Border */}
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 
                     transform scale-x-0 group-hover:scale-x-100 
                     transition-transform duration-300 origin-left"
      ></span>
    </Link>
  );
}
