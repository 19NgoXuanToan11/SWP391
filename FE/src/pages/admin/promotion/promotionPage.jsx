import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  PercentageOutlined,
  GiftOutlined,
  CalendarOutlined,
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
  InputNumber,
  DatePicker,
  Table,
  Button,
  Popconfirm,
} from "antd";
import SidebarAdmin from "../../../components/sidebar/admin/SidebarAdmin.jsx";
import {
  useGetPromotionsQuery,
  useDeletePromotionMutation,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from "../../../services/api/beautyShopApi.js";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const PromotionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Queries
  const {
    data: promotions,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();
  const [createPromotion] = useCreatePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();

  // Lọc mã khuyến mãi
  useEffect(() => {
    if (promotions) {
      let filtered = [...promotions];
      if (searchTerm) {
        filtered = filtered.filter((promotion) =>
          promotion.promotionName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }
      setFilteredPromotions(filtered);
    }
  }, [searchTerm, promotions]);

  // Xử lý xóa mã khuyến mãi
  const handleDelete = (promotionId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa mã khuyến mãi này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePromotion(promotionId).unwrap();
          message.success("Xóa mã khuyến mãi thành công");
          refetch();
        } catch (error) {
          message.error("Không thể xóa mã khuyến mãi");
        }
      },
    });
  };

  // Xử lý chỉnh sửa mã khuyến mãi
  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);

    form.setFieldsValue({
      promotionName: promotion.promotionName,
      discountPercentage: promotion.discountPercentage,
      dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
    });

    setIsModalVisible(true);
  };

  // Xử lý submit form
  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);

      const promotionData = {
        promotionName: values.promotionName,
        discountPercentage: values.discountPercentage,
        startDate: values.dateRange[0].format("YYYY-MM-DD[T]HH:mm:ss"),
        endDate: values.dateRange[1].format("YYYY-MM-DD[T]HH:mm:ss"),
      };

      if (editingPromotion) {
        // Update existing promotion
        await updatePromotion({
          id: editingPromotion.promotionId,
          promotionData,
        }).unwrap();
        message.success("Cập nhật mã khuyến mãi thành công");
      } else {
        // Create new promotion
        await createPromotion(promotionData).unwrap();
        message.success("Thêm mã khuyến mãi thành công");
      }

      form.resetFields();
      setIsModalVisible(false);
      setEditingPromotion(null);
      refetch();
    } catch (error) {
      console.error("Error submitting promotion:", error);
      message.error("Đã xảy ra lỗi khi lưu mã khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  // Checking if promotion is active
  const isPromotionActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
            <h1 className="text-3xl font-bold text-white">
              Quản Lý Khuyến Mãi
            </h1>
            <p className="text-white text-opacity-80 mt-2">
              Quản lý danh sách mã khuyến mãi của cửa hàng
            </p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khuyến mãi..."
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setEditingPromotion(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            <PlusOutlined />
            <span>Thêm khuyến mãi mới</span>
          </button>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-2xl shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <p className="ml-2">Đang tải dữ liệu...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-red-500">
                Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
              </p>
              <Button onClick={refetch} className="ml-2">
                Thử lại
              </Button>
            </div>
          ) : filteredPromotions?.length === 0 ? (
            <Empty
              description="Không tìm thấy mã khuyến mãi nào"
              className="py-12"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 w-[10%] text-left text-sm font-medium text-gray-500">
                      Mã
                    </th>
                    <th className="px-6 py-4 w-[25%] text-left text-sm font-medium text-gray-500">
                      Tên khuyến mãi
                    </th>
                    <th className="px-6 py-4 w-[15%] text-left text-sm font-medium text-gray-500">
                      Giảm giá
                    </th>
                    <th className="px-6 py-4 w-[20%] text-left text-sm font-medium text-gray-500">
                      Ngày bắt đầu
                    </th>
                    <th className="px-6 py-4 w-[20%] text-left text-sm font-medium text-gray-500">
                      Ngày kết thúc
                    </th>
                    <th className="px-6 py-4 w-[10%] text-right text-sm font-medium text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPromotions.map((promotion) => (
                    <tr
                      key={promotion.promotionId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {promotion.promotionId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <GiftOutlined
                            style={{ color: "#ff4d4f", marginRight: 8 }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {promotion.promotionName}
                            </div>
                            {isPromotionActive(
                              promotion.startDate,
                              promotion.endDate
                            ) && (
                              <Badge
                                status="success"
                                text="Đang áp dụng"
                                style={{ fontSize: "12px" }}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        <div className="flex items-center">
                          <PercentageOutlined
                            className="mr-1"
                            style={{ color: "#ff4d4f" }}
                          />
                          <span>{promotion.discountPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <CalendarOutlined className="mr-2" />
                          <span>{formatDate(promotion.startDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <CalendarOutlined className="mr-2" />
                          <span>{formatDate(promotion.endDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Tooltip title="Chỉnh sửa">
                            <button
                              onClick={() => handleEdit(promotion)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                            >
                              <EditOutlined />
                            </button>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <button
                              onClick={() =>
                                handleDelete(promotion.promotionId)
                              }
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

        {/* Modal thêm/sửa mã khuyến mãi */}
        <Modal
          title={
            editingPromotion
              ? "Chỉnh sửa mã khuyến mãi"
              : "Thêm mã khuyến mãi mới"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              discountPercentage: 10,
            }}
          >
            <Form.Item
              name="promotionName"
              label="Tên mã khuyến mãi"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên mã khuyến mãi",
                },
              ]}
            >
              <Input placeholder="Nhập tên mã khuyến mãi" />
            </Form.Item>

            <Form.Item
              name="discountPercentage"
              label="Phần trăm giảm giá (%)"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập phần trăm giảm giá",
                },
                {
                  type: "number",
                  min: 1,
                  max: 100,
                  message: "Phần trăm giảm giá phải từ 1-100%",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                placeholder="Nhập phần trăm giảm giá"
              />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Thời gian áp dụng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian áp dụng",
                },
              ]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: "100%" }}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              />
            </Form.Item>

            <Form.Item className="mt-4">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center"
                  disabled={loading}
                >
                  {loading && <LoadingOutlined className="mr-2" />}
                  {editingPromotion ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PromotionPage;
