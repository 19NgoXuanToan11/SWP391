import React, { useState } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import SidebarAdmin from "../../components/sidebaradmin";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const ordersData = [
    {
      orderId: "ORD123",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      totalAmount: "$120.00",
      items: 3,
      status: "Shipped",
      date: "2024-01-23 14:30",
      paymentStatus: "Paid",
    },
    {
      orderId: "ORD124",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
      totalAmount: "$75.50",
      items: 2,
      status: "Pending",
      date: "2024-01-23 15:45",
      paymentStatus: "Pending",
    },
    {
      orderId: "ORD125",
      customerName: "Mark Lee",
      totalAmount: "$250.00",
      status: "Delivered",
    },
    {
      orderId: "ORD126",
      customerName: "Lucy Wilson",
      totalAmount: "$99.99",
      status: "Shipped",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage customer orders</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
              <FilterOutlined className="text-gray-500" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 text-pink-500 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
              Export Orders
            </button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">1,485</p>
                <p className="text-xs text-green-500 mt-1">
                  +12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingCartOutlined className="text-xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">$48,592</p>
                <p className="text-xs text-green-500 mt-1">
                  +8.2% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-gray-800">892</p>
                <p className="text-xs text-green-500 mt-1">
                  +5.3% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-xl text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800">45</p>
                <p className="text-xs text-yellow-500 mt-1">
                  Requires attention
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ClockCircleOutlined className="text-xl text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersData.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <CheckSquareOutlined />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              Showing 1 to 10 of 1,485 orders
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
