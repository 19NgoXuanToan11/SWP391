import React, { useState } from "react";
import SidebarAdmin from "../../components/SidebarAdmin.jsx";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  BellOutlined,
  SearchOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dữ liệu mẫu cho biểu đồ
const monthlyRevenue = [
  { name: "T1", revenue: 65000, orders: 320, profit: 12000 },
  { name: "T2", revenue: 59000, orders: 300, profit: 11000 },
  { name: "T3", revenue: 80000, orders: 450, profit: 15000 },
  { name: "T4", revenue: 81000, orders: 400, profit: 16000 },
  { name: "T5", revenue: 90000, orders: 500, profit: 18000 },
  { name: "T6", revenue: 85000, orders: 480, profit: 17000 },
  { name: "T7", revenue: 95000, orders: 550, profit: 19000 },
];

const productCategories = [
  { name: "Chăm sóc da", value: 4000 },
  { name: "Trang điểm", value: 3000 },
  { name: "Chăm sóc tóc", value: 2000 },
  { name: "Nước hoa", value: 1500 },
  { name: "Dụng cụ", value: 1000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        {/* Tiêu đề */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm backdrop-blur-md bg-opacity-80">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Chào mừng trở lại, Quản trị viên!
            </h1>
            <p className="text-gray-500 mt-1">
              Đây là những gì đang diễn ra với cửa hàng của bạn hôm nay.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {/* Menu thả xuống hồ sơ */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-xl transition-colors p-2"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    Quản trị viên
                  </p>
                  <p className="text-xs text-gray-500">Quản trị viên cấp cao</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 transform transition-all duration-300 ease-in-out">
                  {/* Tiêu đề hồ sơ - Hiện đại hóa */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-medium shadow-md">
                        A
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Quản trị viên
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          admin@example.com
                        </p>
                        <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full mt-1 inline-block font-medium shadow-sm">
                          Quản trị viên cấp cao
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Các mục menu - Hiện đại hóa */}
                  <div className="py-3 px-4 space-y-2">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-200">
                        <UserOutlined />
                      </span>
                      <span className="font-medium">Hồ sơ của bạn</span>
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-200">
                        <SettingOutlined />
                      </span>
                      <span className="font-medium">
                        Cài đặt & Quyền riêng tư
                      </span>
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all duration-200">
                        <QuestionCircleOutlined />
                      </span>
                      <span className="font-medium">Trợ giúp & Hỗ trợ</span>
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-200">
                        <BulbOutlined />
                      </span>
                      <span className="font-medium">Hiển thị & Trợ năng</span>
                    </button>

                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                        <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
                          <LogoutOutlined />
                        </span>
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Ngày và Thống kê nhanh */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarOutlined />
            <span>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Thẻ tóm tắt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Thẻ Tổng doanh số */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tổng doanh số
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  841.162.000 đ
                </p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-red-500 text-sm bg-red-50 px-2 py-1 rounded-lg">
                    <ArrowDownOutlined className="mr-1" />
                    3,6%
                  </span>
                  <span className="text-gray-400 text-sm">
                    so với tháng trước
                  </span>
                </div>
              </div>
              <div className="bg-pink-500 bg-opacity-10 p-4 rounded-2xl">
                <DollarOutlined className="text-3xl text-pink-500" />
              </div>
            </div>
          </div>

          {/* Thẻ Tổng đơn hàng */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tổng đơn hàng
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">123.460</p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    2,8%
                  </span>
                  <span className="text-gray-400 text-sm">
                    so với tháng trước
                  </span>
                </div>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-4 rounded-2xl">
                <ShoppingOutlined className="text-3xl text-blue-500" />
              </div>
            </div>
          </div>

          {/* Thẻ Người dùng hoạt động */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Người dùng hoạt động
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  1.014.125
                </p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    1,36%
                  </span>
                  <span className="text-gray-400 text-sm">
                    so với tháng trước
                  </span>
                </div>
              </div>
              <div className="bg-green-500 bg-opacity-10 p-4 rounded-2xl">
                <UserOutlined className="text-3xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Thẻ Tăng trưởng */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tăng trưởng</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">+6,23%</p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    2,4%
                  </span>
                  <span className="text-gray-400 text-sm">
                    so với tháng trước
                  </span>
                </div>
              </div>
              <div className="bg-purple-500 bg-opacity-10 p-4 rounded-2xl">
                <RiseOutlined className="text-3xl text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Lưới biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Biểu đồ tổng quan doanh thu */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Tổng quan doanh thu
              </h2>
              <select
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
                <option>90 ngày qua</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh thu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ phân tích đơn hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Phân tích đơn hàng
              </h2>
              <select
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
                <option>90 ngày qua</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Đơn hàng"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#ffc658"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Lợi nhuận"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ danh mục sản phẩm */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Danh mục sản phẩm
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {productCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ doanh số theo danh mục */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Doanh số theo danh mục
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Doanh số">
                    {productCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
