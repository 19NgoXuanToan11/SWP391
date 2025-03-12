import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Spin, Alert, Empty, message, Input, Select, DatePicker } from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

const FilterControls = ({ onSearch, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4">
      {/* Search Bar */}
      <div className="flex-1 min-w-[280px]">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm đơn hàng..."
          className="h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500 
            transition-all duration-300 shadow-sm hover:shadow-md"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="min-w-[180px]">
        <Select
          defaultValue="all"
          className="w-full h-12 rounded-lg hover:border-purple-300 focus:border-purple-500 
            transition-all duration-300 shadow-sm hover:shadow-md"
          onChange={(value) => onStatusChange(value)}
          options={[
            {
              value: "all",
              label: (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 
                    shadow-sm"
                  />
                  <span className="font-medium">Tất cả</span>
                </div>
              ),
            },
            {
              value: "completed",
              label: (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500
                    shadow-sm animate-pulse"
                  />
                  <span className="font-medium">Hoàn thành</span>
                </div>
              ),
            },
            {
              value: "processing",
              label: (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500
                    shadow-sm animate-pulse"
                  />
                  <span className="font-medium">Đang xử lý</span>
                </div>
              ),
            },
            {
              value: "cancelled",
              label: (
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500
                    shadow-sm"
                  />
                  <span className="font-medium">Đã hủy</span>
                </div>
              ),
            },
          ]}
          dropdownStyle={{
            borderRadius: "1rem",
            padding: "0.5rem",
            border: "2px solid #e5e7eb",
          }}
        />
      </div>
    </div>
  );
};

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const currentUser = { id: "user123" }; // Replace with actual user data

  // Update the API_BASE_URL to match the endpoint shown in Swagger
  const API_BASE_URL = "https://localhost:7285";

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    // We can still check for user authentication if needed
    if (!currentUser || !currentUser.id) {
      setError("Vui lòng đăng nhập để xem lịch sử đơn hàng");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/GetAllHistory`, {
        headers: {
          accept: "*/*",
        },
      });

      // Based on the response shown in your screenshot
      if (response.data && Array.isArray(response.data)) {
        const formattedOrders = response.data.map((order) => ({
          id: order.historyId.toString(),
          trackingCode: order.trackingCode,
          shipper: order.shipper,
          status: order.status.toLowerCase(),
          date: new Date().toISOString(),
          total: 0,
          orderDetails: order.orderDetails || [],
        }));

        setOrders(formattedOrders);
      } else {
        setOrders([]);
        message.info("Không tìm thấy đơn hàng nào");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau."
      );
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined className="text-green-500" />;
      case "processing":
        return <LoadingOutlined className="text-blue-500" />;
      case "cancelled":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao hàng";
      default:
        return "Không xác định";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Lịch Sử Đơn Hàng
            </h1>
            <div className="flex gap-4 w-full md:w-auto">
              <FilterControls
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>

          {error && (
            <Alert
              message="Lỗi"
              description={error}
              type="error"
              showIcon
              className="mb-6 rounded-xl shadow-md"
              icon={<ExclamationCircleOutlined />}
              action={
                <button
                  onClick={fetchOrders}
                  className="px-4 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Thử lại
                </button>
              }
            />
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <Spin
                size="large"
                indicator={
                  <LoadingOutlined className="text-4xl text-pink-500" spin />
                }
              />
              <p className="mt-4 text-gray-600 animate-pulse">
                Đang tải dữ liệu đơn hàng...
              </p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <InfoCircleOutlined className="text-purple-500" />
                            Đơn hàng #{order.id}
                          </h3>
                          <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <ClockCircleOutlined />
                            {formatDate(order.date)}
                          </p>
                          <div className="mt-2 flex flex-col gap-1">
                            <p className="text-gray-600 flex items-center gap-2">
                              <span className="font-medium">Mã theo dõi:</span>
                              <span className="text-blue-600 font-medium">
                                {order.trackingCode}
                              </span>
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <span className="font-medium">
                                Người giao hàng:
                              </span>
                              <span>{order.shipper}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                            {getStatusIcon(order.status)}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 my-4"></div>

                      <div className="space-y-3">
                        {order.orderDetails && order.orderDetails.length > 0 ? (
                          order.orderDetails.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                            >
                              <div className="flex items-center gap-2">
                                <ShoppingOutlined className="text-gray-400" />
                                <span>Sản phẩm #{index + 1}</span>
                              </div>
                              <span className="font-medium">
                                {formatPrice(0)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-gray-500 italic">
                            Không có thông tin chi tiết đơn hàng
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Tổng tiền:
                        </span>
                        <span className="text-xl font-bold text-pink-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/order-detail/${order.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full 
                            hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500">
                    {searchTerm
                      ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm"
                      : "Bạn chưa có đơn hàng nào"}
                  </span>
                }
              >
                <Link to="/product">
                  <button
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full 
                    hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Mua sắm ngay
                  </button>
                </Link>
              </Empty>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default OrdersHistoryPage;
