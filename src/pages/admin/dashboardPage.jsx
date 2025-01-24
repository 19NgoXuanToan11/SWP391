import React, { useState } from "react";
import SidebarAdmin from "../../components/sidebaradmin";
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

// Mock data for charts
const monthlyRevenue = [
  { name: "Jan", revenue: 65000, orders: 320, profit: 12000 },
  { name: "Feb", revenue: 59000, orders: 300, profit: 11000 },
  { name: "Mar", revenue: 80000, orders: 450, profit: 15000 },
  { name: "Apr", revenue: 81000, orders: 400, profit: 16000 },
  { name: "May", revenue: 90000, orders: 500, profit: 18000 },
  { name: "Jun", revenue: 85000, orders: 480, profit: 17000 },
  { name: "Jul", revenue: 95000, orders: 550, profit: 19000 },
];

const productCategories = [
  { name: "Skincare", value: 4000 },
  { name: "Makeup", value: 3000 },
  { name: "Haircare", value: 2000 },
  { name: "Fragrance", value: 1500 },
  { name: "Tools", value: 1000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm backdrop-blur-md bg-opacity-80">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, Admin!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {/* Profile Dropdown */}
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
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium">
                        A
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Admin User
                        </h3>
                        <p className="text-sm text-gray-500">
                          admin@example.com
                        </p>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Super Admin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 px-4 space-y-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3">
                      <UserOutlined />
                      <span>Your Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3">
                      <SettingOutlined />
                      <span>Settings & Privacy</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3">
                      <QuestionCircleOutlined />
                      <span>Help & Support</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3">
                      <BulbOutlined />
                      <span>Display & Accessibility</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3">
                      <LogoutOutlined />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Date and Quick Stats */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarOutlined />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Total Sales Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  $841,162
                </p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-red-500 text-sm bg-red-50 px-2 py-1 rounded-lg">
                    <ArrowDownOutlined className="mr-1" />
                    3.6%
                  </span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-pink-500 bg-opacity-10 p-4 rounded-2xl">
                <DollarOutlined className="text-3xl text-pink-500" />
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">123,460</p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    2.8%
                  </span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-4 rounded-2xl">
                <ShoppingOutlined className="text-3xl text-blue-500" />
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  1,014,125
                </p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    1.36%
                  </span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-green-500 bg-opacity-10 p-4 rounded-2xl">
                <UserOutlined className="text-3xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Growth Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Growth</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">+6.23%</p>
                <div className="flex items-center mt-4 space-x-2">
                  <span className="flex items-center text-green-500 text-sm bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="mr-1" />
                    2.4%
                  </span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-purple-500 bg-opacity-10 p-4 rounded-2xl">
                <RiseOutlined className="text-3xl text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Overview Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Revenue Overview
              </h2>
              <select
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
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
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Analytics Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Orders Analytics
              </h2>
              <select
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
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
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#ffc658"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Categories Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Product Categories
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

          {/* Sales by Category Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Sales by Category
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
                  <Bar dataKey="value" fill="#8884d8">
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

        {/* Recent Sales Table */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Sales</h2>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 rounded-xl">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Add your table rows here */}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
