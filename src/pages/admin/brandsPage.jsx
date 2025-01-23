import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Importing the icons
import SidebarAdmin from "../../components/sidebaradmin";

const BrandsPage = () => {
  const brandsData = [
    { name: "Brand A", category: "Tech", status: "Active" },
    { name: "Brand B", category: "Fashion", status: "Inactive" },
    { name: "Brand C", category: "Food", status: "Active" },
    { name: "Brand D", category: "Home", status: "Active" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      <div className="p-6 bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-6">Brands</h1>

        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b p-3 text-sm font-semibold">Brand Name</th>
                <th className="border-b p-3 text-sm font-semibold">Category</th>
                <th className="border-b p-3 text-sm font-semibold">Status</th>
                <th className="border-b p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brandsData.map((brand, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3">{brand.name}</td>
                  <td className="border-b p-3">{brand.category}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${brand.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {brand.status}
                    </span>
                  </td>
                  <td className="flex border-b p-3 space-x-2">
                    <button className="items-center text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out" aria-label="Edit Brand">
                      <EditOutlined className="mr-2" />
                    </button>
                    <button className="items-center text-red-500 hover:text-red-700 transition duration-150 ease-in-out" aria-label="Delete Brand">
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

export default BrandsPage;
