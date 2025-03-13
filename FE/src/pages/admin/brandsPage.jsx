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
      title: "Bạn có chắc chắn muốn xóa thương hiệu này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteBrand(brandId).unwrap();
          message.success("Xóa thương hiệu thành công");
          refetch();
        } catch (error) {
          console.error("Lỗi khi xóa thương hiệu:", error);
          message.error("Không thể xóa thương hiệu");
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
        message.success("Cập nhật thương hiệu thành công");
      } else {
        // Create new brand
        await createBrand(brandData).unwrap();
        message.success("Tạo thương hiệu mới thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingBrand(null);
      refetch();
    } catch (error) {
      console.error("Lỗi khi lưu thương hiệu:", error);
      message.error("Không thể lưu thương hiệu");
    }
  };

  // Calculate stats
  const totalBrands = brands?.length || 0;
  // Tạm thời hiển thị 0 cho active và inactive vì API chưa có trường status
  const activeBrands = 0;
  const inactiveBrands = totalBrands;

  if (isError) {
    message.error(
      `Không thể tải danh sách thương hiệu: ${
        error?.data?.message || "Lỗi không xác định"
      }`
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
            <h1 className="text-3xl font-bold text-white">
              Quản Lý Thương Hiệu
            </h1>
            <p className="text-white text-opacity-80 mt-2 max-w-2xl">
              Quản lý và giám sát các đối tác thương hiệu của bạn
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
                <p className="text-sm text-gray-500">Tổng số thương hiệu</p>
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
                <p className="text-sm text-gray-500">
                  Thương hiệu đang hoạt động
                </p>
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
                <p className="text-sm text-gray-500">
                  Thương hiệu không hoạt động
                </p>
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
                placeholder="Tìm kiếm thương hiệu..."
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
            <span>Thêm thương hiệu mới</span>
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
              <span className="ml-2">Đang tải thương hiệu...</span>
            </div>
          ) : filteredBrands?.length === 0 ? (
            <Empty
              description="Không tìm thấy thương hiệu nào"
              className="py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thao tác
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
                          Hoạt động
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
              Hiển thị 1 đến {filteredBrands?.length || 0} trong tổng số{" "}
              {totalBrands} thương hiệu
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Trước
              </button>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Tiếp
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Brand Modal */}
      <Modal
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
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
            label="Tên thương hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên thương hiệu",
              },
            ]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả thương hiệu" />
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
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && (
                <LoadingOutlined className="mr-2" />
              )}
              {editingBrand ? "Cập nhật" : "Tạo mới"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandsPage;
