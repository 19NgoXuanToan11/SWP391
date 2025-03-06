import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ShopOutlined,
  TagOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Spin,
  message,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  Badge,
  Empty,
  Avatar,
} from "antd";
import SidebarAdmin from "../../components/SidebarAdmin.jsx";
import {
  useGetBrandsQuery,
  useDeleteBrandMutation,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "../../services/api/beautyShopApi";
import { motion } from "framer-motion";

const { Option } = Select;
const { TextArea } = Input;

const BrandsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBrand, setEditingBrand] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  // Fetch brands using RTK Query
  const {
    data: brands,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBrandsQuery();

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  // Filter brands based on search term and status
  useEffect(() => {
    if (brands) {
      let filtered = [...brands];

      // Filter by search term
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(
          (brand) =>
            brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Không lọc theo status vì API hiện tại không có trường status
      // Có thể bổ sung sau khi API hỗ trợ

      setFilteredBrands(filtered);
    }
  }, [searchTerm, brands]);

  // Handle brand edit
  const handleEdit = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({
      brandName: brand.brandName,
      description: brand.description,
    });
    setIsModalVisible(true);
  };

  // Handle brand delete
  const handleDelete = (brandId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this brand?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteBrand(brandId).unwrap();
          message.success("Brand deleted successfully");
          refetch();
        } catch (error) {
          console.error("Error deleting brand:", error);
          message.error("Failed to delete brand");
        }
      },
    });
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      // Chỉ gửi brandName và description lên API
      const brandData = {
        brandName: values.brandName,
        description: values.description,
      };

      if (editingBrand) {
        // Update existing brand
        await updateBrand({
          brandId: editingBrand.brandId,
          ...brandData,
        }).unwrap();
        message.success("Brand updated successfully");
      } else {
        // Create new brand
        await createBrand(brandData).unwrap();
        message.success("Brand created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingBrand(null);
      refetch();
    } catch (error) {
      console.error("Error saving brand:", error);
      message.error("Failed to save brand");
    }
  };

  // Calculate stats
  const totalBrands = brands?.length || 0;
  // Tạm thời hiển thị 0 cho active và inactive vì API chưa có trường status
  const activeBrands = 0;
  const inactiveBrands = totalBrands;

  if (isError) {
    message.error(
      `Failed to fetch brands: ${error?.data?.message || "Unknown error"}`
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">Brands Management</h1>
            <p className="text-white text-opacity-80 mt-2 max-w-2xl">
              Manage and monitor your brand partnerships
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white p-6 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Brands</p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalBrands}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShopOutlined className="text-xl text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white p-6 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Brands</p>
                <p className="text-3xl font-bold text-gray-800">
                  {activeBrands}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-xl text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white p-6 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Brands</p>
                <p className="text-3xl font-bold text-gray-800">
                  {inactiveBrands}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TagOutlined className="text-xl text-purple-500" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-between items-center mb-6 gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => {
              setEditingBrand(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            <PlusOutlined />
            <span>Add New Brand</span>
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <span className="ml-2">Loading brands...</span>
            </div>
          ) : filteredBrands?.length === 0 ? (
            <Empty
              description="No brands found"
              className="py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBrands.map((brand) => (
                    <tr
                      key={brand.brandId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {brand.brandName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {brand.description?.substring(0, 50)}
                              {brand.description?.length > 50 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.brandId)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              Showing 1 to {filteredBrands?.length || 0} of {totalBrands} brands
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Brand Modal */}
      <Modal
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingBrand(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[
              {
                required: true,
                message: "Please enter the brand name",
              },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter a description",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter brand description" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingBrand(null);
              }}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && (
                <LoadingOutlined className="mr-2" />
              )}
              {editingBrand ? "Update" : "Create"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandsPage;
