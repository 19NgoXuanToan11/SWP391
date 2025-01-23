import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing the icons
import SidebarAdmin from "../../components/sidebaradmin";

const VouchersPage = () => {
  const vouchersData = [
    { code: "VOUCHER123", description: "10% off on Electronics", discount: "$10.00", status: "Active" },
    { code: "VOUCHER124", description: "15% off on Clothing", discount: "$15.00", status: "Inactive" },
    { code: "VOUCHER125", description: "20% off on Food", discount: "$20.00", status: "Active" },
    { code: "VOUCHER126", description: "5% off on Home & Garden", discount: "$5.00", status: "Expired" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      <div className="p-6 bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-6">Vouchers</h1>

        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b p-3 text-sm font-semibold">Voucher Code</th>
                <th className="border-b p-3 text-sm font-semibold">Description</th>
                <th className="border-b p-3 text-sm font-semibold">Discount</th>
                <th className="border-b p-3 text-sm font-semibold">Status</th>
                <th className="border-b p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchersData.map((voucher, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3">{voucher.code}</td>
                  <td className="border-b p-3">{voucher.description}</td>
                  <td className="border-b p-3">{voucher.discount}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${voucher.status === "Active" ? "bg-green-500 text-white" : voucher.status === "Inactive" ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"}`}
                    >
                      {voucher.status}
                    </span>
                  </td>
                  <td className="flex border-b p-3 space-x-2">
                    <button className="items-center text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out" aria-label="Edit Voucher">
                      <EditOutlined className="mr-2" />
                    </button>
                    <button className="items-center text-red-500 hover:text-red-700 transition duration-150 ease-in-out" aria-label="Delete Voucher">
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

export default VouchersPage;
