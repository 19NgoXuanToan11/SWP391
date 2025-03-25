import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  TagOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  EyeOutlined,
  SettingOutlined,
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
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../services/api/beautyShopApi";
import { motion } from "framer-motion";

const { Option } = Select;
const { TextArea } = Input;

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  // Lấy danh mục sử dụng RTK Query
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Lọc danh mục dựa trên từ khóa tìm kiếm và trạng thái
  useEffect(() => {
    if (categories) {
      let filtered = [...categories];

      // Lọc theo trạng thái
      if (filterStatus === "active") {
        filtered = filtered.filter((cat) => !cat.isDeleted);
      } else if (filterStatus === "inactive") {
        filtered = filtered.filter((cat) => cat.isDeleted);
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(
          (category) =>
            category.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories, filterStatus]);

  // Xử lý chỉnh sửa danh mục
  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      categoryName: category.categoryName,
      description: category.description,
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa danh mục
  const handleDelete = (categoryId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa danh mục này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCategory(categoryId).unwrap();
          message.success("Xóa danh mục thành công");
          refetch();
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
          message.error("Không thể xóa danh mục");
        }
      },
    });
  };

  // Tính toán thống kê
  const totalCategories = categories?.length || 0;
  const activeCategories =
    categories?.filter((cat) => !cat.isDeleted)?.length || 0;
  const inactiveCategories = totalCategories - activeCategories;
  const totalProducts =
    categories?.reduce((sum, cat) => sum + (cat.productCount || 0), 0) || 0;

  // Lấy màu ngẫu nhiên cho biểu tượng danh mục
  const getCategoryColor = (categoryId) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[categoryId % colors.length];
  };

  // Lấy biểu tượng danh mục
  const getCategoryIcon = (categoryName) => {
    const firstLetter = categoryName
      ? categoryName.charAt(0).toUpperCase()
      : "C";
    return firstLetter;
  };

  if (isError) {
    message.error(
      `Không thể tải danh mục: ${error?.data?.message || "Lỗi không xác định"}`
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Tiêu đề với gradient hoạt ảnh */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">Quản Lý Danh Mục</h1>
            <p className="text-white text-opacity-80 mt-2 max-w-2xl">
              Tổ chức và quản lý các danh mục sản phẩm để nâng cao trải nghiệm
              mua sắm của khách hàng
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
        </motion.div>

        {/* Thẻ thống kê */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
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
                <p className="text-sm text-gray-500">Tổng số danh mục</p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalCategories}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Tất cả danh mục đã đăng ký
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                <AppstoreOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
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
                <p className="text-sm text-gray-500">Danh mục đang hoạt động</p>
                <p className="text-3xl font-bold text-gray-800">
                  {activeCategories}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((activeCategories / totalCategories) * 100) || 0}%
                  trong tổng số danh mục
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
                <CheckCircleOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    Math.round((activeCategories / totalCategories) * 100) || 0
                  }%`,
                }}
              ></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Thanh hành động */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-sm mb-6"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <AppstoreOutlined />
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <BarChartOutlined />
                </button>
              </div>

              <button
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md"
                onClick={() => {
                  setEditingCategory(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                <PlusOutlined />
                <span>Thêm danh mục</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Nội dung danh mục */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <span className="ml-2">Đang tải danh mục...</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <Empty
                description={
                  <span className="text-gray-500">
                    Không tìm thấy danh mục nào. Hãy điều chỉnh tìm kiếm hoặc
                    tạo danh mục mới.
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <button
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                onClick={() => {
                  setEditingCategory(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                <PlusOutlined className="mr-2" />
                Tạo danh mục mới
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.categoryId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-2xl shadow-sm p-6 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 ${getCategoryColor(
                          category.categoryId
                        )} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}
                      >
                        {getCategoryIcon(category.categoryName)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {category.categoryName}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Tooltip title="Chỉnh sửa">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleEdit(category)}
                        >
                          <EditOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(category.categoryId)}
                        >
                          <DeleteOutlined />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Badge
                        status={!category.isDeleted ? "success" : "error"}
                        text={
                          <span className="text-sm font-medium">
                            {!category.isDeleted
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </span>
                        }
                      />
                    </div>
                    <span className="text-sm text-gray-500 flex items-center">
                      <TagOutlined className="mr-1" />
                      {category.productCount || 0} sản phẩm
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((category, index) => (
                    <motion.tr
                      key={category.categoryId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${getCategoryColor(
                              category.categoryId
                            )} rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}
                          >
                            {getCategoryIcon(category.categoryName)}
                          </div>
                          <div className="font-medium text-gray-900">
                            {category.categoryName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          status={!category.isDeleted ? "success" : "error"}
                          text={
                            <span className="text-sm font-medium">
                              {!category.isDeleted
                                ? "Hoạt động"
                                : "Không hoạt động"}
                            </span>
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {category.productCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <Tooltip title="Chỉnh sửa">
                            <button
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                              onClick={() => handleEdit(category)}
                            >
                              <EditOutlined />
                            </button>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <button
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              onClick={() => handleDelete(category.categoryId)}
                            >
                              <DeleteOutlined />
                            </button>
                          </Tooltip>
                          <Tooltip title="Xem chi tiết">
                            <button className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors">
                              <EyeOutlined />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal Form Danh mục */}
        <Modal
          title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
          className="category-modal"
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              console.log("Giá trị form:", values);
              // Xử lý gửi form
              setIsModalVisible(false);
            }}
            initialValues={{
              status: "active",
            }}
          >
            <Form.Item
              name="categoryName"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" className="rounded-xl" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea
                placeholder="Nhập mô tả danh mục"
                rows={4}
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
              <Select className="rounded-xl">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setIsModalVisible(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all"
              >
                {editingCategory ? "Cập nhật danh mục" : "Tạo danh mục"}
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryPage;
