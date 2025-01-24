import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagOutlined,
  GiftOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4 text-2xl font-bold">BeautyShop</div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <DashboardOutlined className="mx-5 mr-5" />
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <Link to="/account">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <UserOutlined className="mx-5 mr-5" />
                Users
              </a>
            </Link>
          </li>
          <li>
            <Link to="/order">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <ShoppingCartOutlined className="mx-5 mr-5" />
                Orders
              </a>
            </Link>
          </li>
          <li>
            <Link to="/category">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <AppstoreOutlined className="mx-5 mr-5" />
                Categories
              </a>
            </Link>
          </li>
          <li>
            <Link to="/brand">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <TagOutlined className="mx-5 mr-5" />
                Brands
              </a>
            </Link>
          </li>
          <li>
            <Link to="/voucher">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <GiftOutlined className="mx-5 mr-5" />
                Voucher
              </a>
            </Link>
          </li>
          <li>
            <Link to="/setting">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <SettingOutlined className="mx-5 mr-5" />
                Settings
              </a>
            </Link>
          </li>
          <li>
            <Link to="/abouts">
              <a
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-700"
              >
                <InfoCircleOutlined className="mx-5 mr-5" />
                About
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
