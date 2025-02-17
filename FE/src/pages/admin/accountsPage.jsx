import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import SidebarAdmin from "../../components/sidebaradmin";

const AccountsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const accountsData = [
    {
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      username: "john_doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-23 14:30",
      joinDate: "2023-12-01",
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      username: "mark_lee",
      email: "mark@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      username: "lucy_wilson",
      email: "lucy@example.com",
      role: "Admin",
      status: "Active",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">User Accounts</h1>
          <p className="text-gray-500 mt-1">
            Manage your system users and their permissions
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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

          <button className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
            <UserAddOutlined />
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">1,234</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <UserAddOutlined className="text-xl text-pink-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-800">1,180</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserAddOutlined className="text-xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-800">54</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <UserAddOutlined className="text-xl text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accountsData.map((account, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <img
                          src={account.avatar}
                          alt={account.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {account.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          account.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          account.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-4">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <EditOutlined />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <DeleteOutlined />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreOutlined />
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
              Showing 1 to 10 of 50 entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Previous
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
