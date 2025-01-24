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

        <nav className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <HomeOutlined className="text-lg" /> Home
            </Link>

            <Link
              to="/about"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <UserOutlined className="text-lg" /> About
            </Link>

            <Link
              to="/product"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <ShoppingOutlined className="text-lg" /> Product
            </Link>

            <Link
              to="/contact"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <ContactsOutlined className="text-lg" /> Contact
            </Link>

            <Link
              to="/quiz-landing"
              className="flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-pink-500 hover:bg-pink-50"
            >
              <FileDoneOutlined className="text-lg" /> Quiz
            </Link>
          </div>

          <div className="flex items-center gap-6 ml-10">
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-[0.95rem] font-medium text-pink-500 border-1.5 border-pink-500 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            >
              <LoginOutlined /> Sign In
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 px-5 text-[0.95rem] font-medium text-white bg-pink-500 rounded-lg shadow-pink-500/20 shadow-md transition-all duration-300 hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            >
              Sign Up
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 px-5  text-[0.95rem] font-medium text-white bg-green-500 rounded-lg shadow-green-500/20 shadow-md transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <ShoppingCartOutlined className="text-lg" />
              View Cart
            </Link>
          </div>
        </nav>
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
