import React from 'react';
import SidebarAdmin from '../../components/sidebaradmin';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined,
  RiseOutlined,
  BellOutlined,
  SearchOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm backdrop-blur-md bg-opacity-80">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
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
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <BellOutlined className="text-xl text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-xl">
              <img 
                src="https://via.placeholder.com/40" 
                alt="User" 
                className="w-10 h-10 rounded-xl border-2 border-pink-500"
              />
              <div>
                <p className="font-semibold text-gray-800">Elana Saint</p>
                <p className="text-sm text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Date and Quick Stats */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarOutlined />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Total Sales Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">$841,162</p>
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
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
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
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">1,014,125</p>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
              <select className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Sales Chart Coming Soon</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Revenue Analytics</h2>
              <select className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Revenue Chart Coming Soon</span>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Status</th>
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
