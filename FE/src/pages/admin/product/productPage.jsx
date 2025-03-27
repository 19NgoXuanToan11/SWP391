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
  DollarOutlined,
  BarChartOutlined,
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
  InputNumber,
  Upload,
} from "antd";
import SidebarAdmin from "../../../components/sidebar/admin/SidebarAdmin.jsx";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "../../../services/api/beautyShopApi.js";
import { motion } from "framer-motion";

const { Option } = Select;
const { TextArea } = Input;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");

  // Queries
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();
  const { data: brands } = useGetBrandsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Lọc sản phẩm
  useEffect(() => {
    if (products) {
      let filtered = [...products];
      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            product.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Xử lý xóa sản phẩm
  const handleDelete = (productId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProduct(productId).unwrap();
          message.success("Xóa sản phẩm thành công");
          refetch();
        } catch (error) {
          message.error("Không thể xóa sản phẩm");
        }
      },
    });
  };

  // Xử lý chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    // Helper function to map volume name to ID
    const getVolumeIdFromName = (name) => {
      const volumeMap = {
        "50ml": 1,
        "100ml": 2,
        "150ml": 3,
        "200ml": 4,
        "500ml": 5,
      };
      return volumeMap[name] || null;
    };

    setEditingProduct(product);
    form.setFieldsValue({
      productName: product.productName,
      description: product.description,
      price: product.price,
      brandId: product.brandId,
      categoryId: product.categoryId,
      mainIngredients: product.mainIngredients,
      volumeId: getVolumeIdFromName(product.volumeName), // Convert name to ID
      skinTypeId: product.skinTypeId,
      imageUrls: product.imageUrls?.join(", "),
    });
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleFormSubmit = async (values) => {
    try {
      // Xử lý chuỗi URL hình ảnh thành mảng
      const imageUrlsArray = values.imageUrls
        ? values.imageUrls
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url)
        : [];

      const productData = {
        productName: values.productName,
        description: values.description,
        price: parseFloat(values.price), // Đảm bảo price là số
        mainIngredients: values.mainIngredients,
        brandId: parseInt(values.brandId), // Đảm bảo ID là số
        volumeId: parseInt(values.volumeId),
        skinTypeId: parseInt(values.skinTypeId),
        categoryId: parseInt(values.categoryId),
        imageUrls: imageUrlsArray,
      };

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.productId,
          productData,
        }).unwrap();
        message.success("Cập nhật sản phẩm thành công");
      } else {
        const response = await createProduct(productData).unwrap();
        message.success("Tạo sản phẩm mới thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      refetch(); // Refresh danh sách sản phẩm
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error.data?.message || "Không thể lưu sản phẩm. Vui lòng thử lại!"
      );
    }
  };

  // Thêm helper function để xử lý skin type
  const getSkinTypeName = (skinTypeId) => {
    const skinTypes = {
      1: "Da dầu",
      2: "Da khô",
      3: "Da hỗn hợp",
      4: "Da nhạy cảm",
    };
    return skinTypes[skinTypeId];
  };

  const getSkinTypeColor = (skinTypeId) => {
    const skinTypeColors = {
      1: "blue",
      2: "orange",
      3: "purple",
      4: "red",
    };
    return skinTypeColors[skinTypeId];
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">Quản Lý Sản Phẩm</h1>
            <p className="text-white text-opacity-80 mt-2">
              Quản lý danh sách sản phẩm của cửa hàng
            </p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            <PlusOutlined />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>

        {/* Products Grid/List */}
        <div className="bg-white rounded-2xl shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spin />
            </div>
          ) : filteredProducts?.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm nào" />
          ) : (
            <div className="overflow-x-auto whitespace-nowrap min-w-full">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 w-[100px] text-left text-sm font-medium text-gray-500">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-4 w-[250px] text-left text-sm font-medium text-gray-500">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-4 w-[150px] text-left text-sm font-medium text-gray-500">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 w-[150px] text-left text-sm font-medium text-gray-500">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 w-[100px] text-left text-sm font-medium text-gray-500">
                      Thể tích
                    </th>
                    <th className="px-6 py-4 w-[120px] text-left text-sm font-medium text-gray-500">
                      Loại da
                    </th>
                    <th className="px-6 py-4 w-[200px] text-left text-sm font-medium text-gray-500">
                      Thành phần
                    </th>
                    <th className="px-6 py-4 w-[120px] text-left text-sm font-medium text-gray-500">
                      Giá
                    </th>
                    <th className="px-6 py-4 w-[100px] text-right text-sm font-medium text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.productId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.imageUrls?.[0] || "placeholder.jpg"}
                          alt={product.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[230px]">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[230px]">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">
                        {brands?.find((b) => b.brandId === product.brandId)
                          ?.brandName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate">
                        {categories?.find(
                          (c) => c.categoryId === product.categoryId
                        )?.categoryName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.volumeName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <Badge
                          color={getSkinTypeColor(product.skinTypeId)}
                          text={getSkinTypeName(product.skinTypeId) || "-"}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Tooltip title={product.mainIngredients}>
                          <div className="text-sm text-gray-500 truncate max-w-[180px]">
                            {product.mainIngredients || "-"}
                          </div>
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-pink-500 whitespace-nowrap">
                        {product.price?.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Tooltip title="Chỉnh sửa">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                            >
                              <EditOutlined />
                            </button>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <button
                              onClick={() => handleDelete(product.productId)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <DeleteOutlined />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        <Modal
          title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingProduct(null);
          }}
          footer={null}
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="imageUrls"
                label="URL hình ảnh"
                rules={[
                  { required: true, message: "Vui lòng nhập URL hình ảnh" },
                ]}
                tooltip="Nhập URL hình ảnh, nếu có nhiều hình thì phân cách bằng dấu phẩy"
              >
                <Input.TextArea
                  placeholder="https://example.com/image1.jpg"
                  autoSize={{ minRows: 1, maxRows: 3 }}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select>
                  {brands?.map((brand) => (
                    <Option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select>
                  {categories?.map((category) => (
                    <Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="volumeId"
                label="Thể tích"
                rules={[{ required: true, message: "Vui lòng chọn thể tích" }]}
              >
                <Select>
                  <Option value={1}>50ml</Option>
                  <Option value={2}>100ml</Option>
                  <Option value={3}>150ml</Option>
                  <Option value={4}>200ml</Option>
                  <Option value={5}>500ml</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="skinTypeId"
                label="Loại da"
                rules={[{ required: true, message: "Vui lòng chọn loại da" }]}
              >
                <Select>
                  <Option value={1}>Da dầu</Option>
                  <Option value={2}>Da khô</Option>
                  <Option value={3}>Da hỗn hợp</Option>
                  <Option value={4}>Da nhạy cảm</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="mainIngredients"
              label="Thành phần chính"
              rules={[
                { required: true, message: "Vui lòng nhập thành phần chính" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập các thành phần chính của sản phẩm, phân cách bằng dấu phẩy"
              />
            </Form.Item>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingProduct(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                {editingProduct ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductPage;
