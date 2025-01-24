import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  TagOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import SidebarAdmin from "../../components/sidebaradmin";

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categoriesData = [
    {
      icon: "🛍️",
      name: "Electronics",
      description: "Devices and gadgets",
      status: "Active",
      products: 245,
      lastUpdated: "2024-01-23",
    },
    {
      icon: "👕",
      name: "Clothing",
      description: "Apparel and accessories",
      status: "Inactive",
      products: 189,
      lastUpdated: "2024-01-22",
    },
    {
      icon: "🥗",
      name: "Food",
      description: "Groceries and edible items",
      status: "Active",
      products: 156,
      lastUpdated: "2024-01-21",
    },
    {
      icon: "🏠",
      name: "Home & Garden",
      description: "Furniture and outdoor items",
      status: "Active",
      products: 178,
      lastUpdated: "2024-01-20",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Categories Management
          </h1>
          <p className="text-gray-500 mt-1">
            Organize and manage your product categories
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
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
            <PlusOutlined />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <AppstoreOutlined className="text-xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Categories</p>
                <p className="text-2xl font-bold text-gray-800">18</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">768</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TagOutlined className="text-xl text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <EditOutlined />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteOutlined />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      category.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.products} products
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Updated {category.lastUpdated}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
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
  );
};

export default CategoryPage;
