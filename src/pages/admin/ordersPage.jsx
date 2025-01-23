import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing the icons
import SidebarAdmin from "../../components/sidebaradmin";

const OrdersPage = () => {
  const ordersData = [
    { orderId: "ORD123", customerName: "John Doe", totalAmount: "$120.00", status: "Shipped" },
    { orderId: "ORD124", customerName: "Jane Smith", totalAmount: "$75.50", status: "Pending" },
    { orderId: "ORD125", customerName: "Mark Lee", totalAmount: "$250.00", status: "Delivered" },
    { orderId: "ORD126", customerName: "Lucy Wilson", totalAmount: "$99.99", status: "Shipped" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      <div className="p-6 bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b p-3 text-sm font-semibold">Order ID</th>
                <th className="border-b p-3 text-sm font-semibold">Customer Name</th>
                <th className="border-b p-3 text-sm font-semibold">Total Amount</th>
                <th className="border-b p-3 text-sm font-semibold">Status</th>
                <th className="border-b p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3">{order.orderId}</td>
                  <td className="border-b p-3">{order.customerName}</td>
                  <td className="border-b p-3">{order.totalAmount}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${order.status === "Shipped" ? "bg-blue-500 text-white" : order.status === "Delivered" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="flex border-b p-3 space-x-2">
                    <button className="items-center text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out" aria-label="Edit Order">
                      <EditOutlined className="mr-2" />
                    </button>
                    <button className="items-center text-red-500 hover:text-red-700 transition duration-150 ease-in-out" aria-label="Delete Order">
                      <DeleteOutlined className="mr-2" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
