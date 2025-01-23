import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing the icons
import SidebarAdmin from "../../components/sidebaradmin";

const AccountsPage = () => {
  const accountsData = [
    { username: "john_doe", email: "john@example.com", role: "Admin", status: "Active" },
    { username: "jane_smith", email: "jane@example.com", role: "User", status: "Inactive" },
    { username: "mark_lee", email: "mark@example.com", role: "Editor", status: "Active" },
    { username: "lucy_wilson", email: "lucy@example.com", role: "Admin", status: "Active" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      <div className="p-6 bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-6">User Accounts</h1>

        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b p-3 text-sm font-semibold">Username</th>
                <th className="border-b p-3 text-sm font-semibold">Email</th>
                <th className="border-b p-3 text-sm font-semibold">Role</th>
                <th className="border-b p-3 text-sm font-semibold">Status</th>
                <th className="border-b p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accountsData.map((account, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3">{account.username}</td>
                  <td className="border-b p-3">{account.email}</td>
                  <td className="border-b p-3">{account.role}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${account.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="flex border-b p-3 space-x-2">
                    <button className="items-center text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out" aria-label="Edit Account">
                      <EditOutlined className="mr-2" />
                    </button>
                    <button className="items-center text-red-500 hover:text-red-700 transition duration-150 ease-in-out" aria-label="Delete Account">
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

export default AccountsPage;
