import React from 'react';
import SidebarAdmin from '../../components/sidebaradmin';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
        <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">BeautyShop Dashboard</h1>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">🔔</button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://via.placeholder.com/40" 
                alt="User" 
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2">Elana Saint</span>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-sm font-medium">Total Sales</h2>
            <p className="text-xl font-bold">$841,162</p>
            <p className="text-sm text-red-500">-3.6%</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-sm font-medium">Total Purchases</h2>
            <p className="text-xl font-bold">$123,460</p>
            <p className="text-sm text-green-500">+3.6%</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-sm font-medium">Active Customers</h2>
            <p className="text-xl font-bold">1,014,125</p>
            <p className="text-sm text-blue-500">+1.36%</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-sm font-medium">New Customers</h2>
            <p className="text-xl font-bold">900,562</p>
            <p className="text-sm text-blue-500">+6.23%</p>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-white p-6 rounded-md shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
          {/* Replace this with a chart library like Chart.js */}
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span>Graph Placeholder</span>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-lg font-bold mb-4">Sales by Category</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-2">Latest Niky Black Shoes</td>
                <td className="border-b p-2 text-red-500">21,562</td>
              </tr>
              <tr>
                <td className="border-b p-2">Latest Men Shirt</td>
                <td className="border-b p-2">15,102</td>
              </tr>
              <tr>
                <td className="border-b p-2">Latest Women Purse</td>
                <td className="border-b p-2">9,562</td>
              </tr>
              <tr>
                <td className="border-b p-2">Latest Women Sandals</td>
                <td className="border-b p-2">1,002</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
