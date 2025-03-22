import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Spin,
  Alert,
  Empty,
  message,
  Input,
  Select,
  DatePicker,
  Tag,
  Badge,
  Tooltip,
  Button,
} from "antd";
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
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  TagOutlined,
  HistoryOutlined,
  SettingOutlined,
  CarOutlined,
  GiftOutlined,
  FireOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

// Loại bỏ component FilterControls cũ và tích hợp trực tiếp vào trang

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Lấy userId từ localStorage
  const [userId, setUserId] = useState(() => {
    try {
      const authUserStr = localStorage.getItem("auth_user");

      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);

        if (authUser && authUser.id) {
          return authUser.id;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing auth_user:", error);
      return null;
    }
  });

  // API base URL
  const API_BASE_URL = "https://localhost:7285";

  // Thêm state để lưu trữ status updates
  const [orderStatusUpdates, setOrderStatusUpdates] = useState({});

  useEffect(() => {
    fetchOrders();

    // Lấy status updates từ localStorage khi component mount
    const updates = JSON.parse(
      localStorage.getItem("orderStatusUpdates") || "{}"
    );
    console.log("Status updates from localStorage:", updates); // Debug log
    setOrderStatusUpdates(updates);

    // Kiểm tra cập nhật mỗi giây
    const interval = setInterval(() => {
      const latestUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );
      setOrderStatusUpdates(latestUpdates);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    // Kiểm tra userId có tồn tại không
    if (!userId) {
      setError("Vui lòng đăng nhập để xem lịch sử đơn hàng");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching orders for user ID: ${userId}`);

      // Sử dụng endpoint /user/{userId} như yêu cầu
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          accept: "*/*",
        },
      });

      console.log("API response:", response.data);

      // Process the response based on the API structure
      if (response.data && Array.isArray(response.data)) {
        const formattedOrders = response.data.map((order) => {
          // Tính tổng tiền từ các sản phẩm
          let totalAmount = 0;
          if (order.products && Array.isArray(order.products)) {
            totalAmount = order.products.reduce((sum, product) => {
              return sum + (product.price || 0) * (product.quantity || 1);
            }, 0);
          }

          // Chuyển đổi trạng thái từ API sang trạng thái trong ứng dụng
          let status = (order.status || "").toLowerCase();

          // Đảm bảo trạng thái khớp với các giá trị trong dropdown
          switch (status) {
            case "completed":
              status = "completed";
              break;
            case "shipping":
              status = "shipping";
              break;
            case "pending":
              status = "pending";
              break;
            case "cancelled":
              status = "cancelled";
              break;
            default:
              status = "pending"; // Trạng thái mặc định nếu không xác định
          }

          return {
            id: order.trackingCode || "N/A",
            trackingCode: order.trackingCode || "N/A",
            shipper: order.shipper || "Chưa xác định",
            status: status,
            date: new Date().toISOString(), // Sử dụng ngày hiện tại nếu không có
            total: totalAmount,
            products: order.products || [],
            estimatedDelivery: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
        });

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
      case "shipping":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case "completed":
        return "shadow-green-300";
      case "shipping":
        return "shadow-blue-300";
      case "pending":
        return "shadow-yellow-300";
      case "cancelled":
        return "shadow-red-300";
      default:
        return "shadow-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined className="text-green-500" />;
      case "shipping":
        return <LoadingOutlined className="text-blue-500" />;
      case "pending":
        return <ClockCircleOutlined className="text-yellow-500" />;
      case "cancelled":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <InfoCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã thanh toán";
      case "pending":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIconComponent = (status, className = "") => {
    switch (status) {
      case "completed":
        return (
          <div className={`rounded-full bg-green-100 p-2 ${className}`}>
            <CheckCircleOutlined className="text-green-500 text-lg" />
          </div>
        );
      case "shipping":
        return (
          <div className={`rounded-full bg-blue-100 p-2 ${className}`}>
            <CarOutlined className="text-blue-500 text-lg" />
          </div>
        );
      case "pending":
        return (
          <div className={`rounded-full bg-yellow-100 p-2 ${className}`}>
            <ClockCircleOutlined className="text-yellow-500 text-lg" />
          </div>
        );
      case "cancelled":
        return (
          <div className={`rounded-full bg-red-100 p-2 ${className}`}>
            <CloseCircleOutlined className="text-red-500 text-lg" />
          </div>
        );
      default:
        return (
          <div className={`rounded-full bg-gray-100 p-2 ${className}`}>
            <InfoCircleOutlined className="text-gray-500 text-lg" />
          </div>
        );
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

  const calculateTimeRemaining = (deliveryDate) => {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đã quá hạn";
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";
    return `${diffDays} ngày`;
  };

  // Filter orders based on search term and other filters
  const filteredOrders = orders.filter((order) => {
    // Filter by tab/status
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by dropdown status
    if (filterStatus !== "all" && order.status !== filterStatus) {
      return false;
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = new Date(order.date);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();

      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    // If no search term, return all filtered orders
    if (!searchTerm) return true;

    // Search by order ID or tracking code
    if (
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingCode
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return true;
    }

    // Search by product name
    if (order.products && Array.isArray(order.products)) {
      return order.products.some(
        (product) =>
          product.productName &&
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return false;
  });

  // Stats for order summary
  const orderStats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    pending: orders.filter((o) => o.status === "pending").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header section with animated background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

          <div className="relative p-8 md:p-10 z-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Lịch Sử Đơn Hàng
            </h1>
          </div>
        </motion.div>

        {/* Advanced Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm đơn hàng
                </label>
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Nhập mã đơn hoặc tên sản phẩm..."
                  className="h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </div>

              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <Select
                  defaultValue="all"
                  className="w-full h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={handleStatusChange}
                  options={[
                    {
                      value: "all",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span className="font-medium">Tất cả</span>
                        </div>
                      ),
                    },
                    {
                      value: "completed",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                          <span className="font-medium">Đã thanh toán</span>
                        </div>
                      ),
                    },
                    {
                      value: "shipping",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                          <span className="font-medium">Đang giao hàng</span>
                        </div>
                      ),
                    },
                    {
                      value: "pending",
                      label: (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="font-medium">Chờ xác nhận</span>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian
                </label>
                <RangePicker
                  className="h-12 rounded-xl border-2 hover:border-purple-300 focus:border-purple-500
                    transition-all duration-300 shadow-sm hover:shadow-md"
                  format="DD/MM/YYYY"
                  onChange={setDateRange}
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </div>

              <Button
                onClick={fetchOrders}
                className="h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl
                  hover:shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-purple-700
                  hover:translate-y-[-2px] border-0"
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </motion.div>

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
                  className={`bg-white rounded-2xl shadow-md hover:shadow-lg 
                    border border-gray-100 hover:border-purple-200 
                    transition-all duration-300 overflow-hidden
                    ${order.status === "cancelled" ? "opacity-90" : ""}`}
                >
                  {/* Order Header */}
                  <div className="p-6 pb-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {getStatusIconComponent(order.status, "md:hidden")}
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                              <span className="text-purple-500 mr-1">#</span>
                              <span>{order.id}</span>
                            </h3>
                            {order.status === "shipping" && (
                              <Badge
                                count="Mới"
                                style={{
                                  backgroundColor: "#FF4D4F",
                                  marginLeft: "8px",
                                }}
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                            <CalendarOutlined />
                            <span>{formatDate(order.date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {getStatusIconComponent(order.status, "hidden md:flex")}

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                                order.status
                              )} shadow-sm ${getStatusGlow(order.status)}`}
                            >
                              {getStatusText(order.status)}
                            </span>

                            {/* Tag trạng thái mới từ staff/admin */}
                            {orderStatusUpdates[order.trackingCode] && (
                              <span
                                className={`px-3 py-1 rounded-full text-white flex items-center gap-2
                                  ${
                                    orderStatusUpdates[order.trackingCode] ===
                                    "shipping"
                                      ? "bg-blue-500 shadow-sm shadow-blue-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "delivered"
                                      ? "bg-green-500 shadow-sm shadow-green-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "pending"
                                      ? "bg-yellow-500 shadow-sm shadow-yellow-300"
                                      : orderStatusUpdates[
                                          order.trackingCode
                                        ] === "cancelled"
                                      ? "bg-red-500 shadow-sm shadow-red-300"
                                      : "bg-gray-500"
                                  }`}
                              >
                                {orderStatusUpdates[order.trackingCode] ===
                                "shipping" ? (
                                  <>
                                    <CarOutlined />
                                    <span>Đang giao hàng</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "delivered" ? (
                                  <>
                                    <CheckCircleOutlined />
                                    <span>Đã giao hàng</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "pending" ? (
                                  <>
                                    <ClockCircleOutlined />
                                    <span>Chờ xác nhận</span>
                                  </>
                                ) : orderStatusUpdates[order.trackingCode] ===
                                  "cancelled" ? (
                                  <>
                                    <CloseCircleOutlined />
                                    <span>Đã hủy</span>
                                  </>
                                ) : (
                                  <span>
                                    {orderStatusUpdates[order.trackingCode]}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>

                          <span className="text-gray-500 text-sm mt-1">
                            {order.status === "shipping" && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <CarOutlined />
                                <span>
                                  Dự kiến:{" "}
                                  {calculateTimeRemaining(
                                    order.estimatedDelivery
                                  )}
                                </span>
                              </div>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Tracking Info */}
                  <div className="px-6 py-2 border-t border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-wrap items-center justify-between gap-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Mã theo dõi">
                          <TagOutlined className="mr-2 text-purple-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">Mã theo dõi:</span>
                        <span className="text-blue-600 font-semibold">
                          {order.trackingCode}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Đơn vị vận chuyển">
                          <TeamOutlined className="mr-2 text-green-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">
                          Đơn vị vận chuyển:
                        </span>
                        <span>{order.shipper}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Tooltip title="Tổng tiền">
                          <FireOutlined className="mr-2 text-red-500" />
                        </Tooltip>
                        <span className="font-medium mr-1">Tổng tiền:</span>
                        <span className="text-red-600 font-bold">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="text-sm text-purple-600 font-medium flex items-center gap-1
                          hover:text-purple-800 transition-colors px-3 py-1.5 rounded-lg
                          hover:bg-purple-50"
                      >
                        {expandedOrder === order.id ? (
                          <>
                            Thu gọn <DownOutlined />
                          </>
                        ) : (
                          <>
                            Chi tiết <RightOutlined />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <ShoppingOutlined className="text-purple-500" />
                          Chi tiết đơn hàng
                        </h4>

                        <div className="space-y-4">
                          {order.products && order.products.length > 0 ? (
                            order.products.map((product, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 border border-gray-100 rounded-xl
                                  hover:border-purple-200 transition-all hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    {product.productImages ? (
                                      <img
                                        src={product.productImages}
                                        alt={product.productName}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                      />
                                    ) : (
                                      <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <ShoppingOutlined className="text-2xl text-purple-400" />
                                      </div>
                                    )}
                                    {product.quantity > 1 && (
                                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                        {product.quantity}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800 hover:text-purple-600 transition-colors cursor-pointer">
                                      {product.productName ||
                                        `Sản phẩm #${index + 1}`}
                                    </h5>
                                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                                      {product.brandName && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                                          {product.brandName}
                                        </span>
                                      )}
                                      {product.category && (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">
                                          {product.category}
                                        </span>
                                      )}
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        Số lượng: {product.quantity || 1}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-800">
                                    {formatPrice(product.price || 0)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatPrice(
                                      (product.price || 0) *
                                        (product.quantity || 1)
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-gray-500 italic bg-gray-50 rounded-xl">
                              <ShoppingOutlined className="text-2xl mb-2 text-gray-400" />
                              <p>Không có thông tin chi tiết sản phẩm</p>
                            </div>
                          )}

                          {/* Order Summary Section */}
                          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-medium text-gray-700 mb-4">
                              Tóm tắt đơn hàng
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-gray-600">
                                <span>Tổng tiền sản phẩm:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                                <span>Tổng thanh toán:</span>
                                <span className="text-xl text-pink-600">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <div className="mt-6">
                            <div className="relative pl-6 ml-2 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:bg-gray-200">
                              {/* Shipping Status - show only if relevant */}
                              {(order.status === "shipping" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "shipping") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                                  <div className="flex-1 bg-blue-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-blue-700">
                                        Đang giao hàng
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đang được vận chuyển đến bạn
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Delivered Status - show only if relevant */}
                              {(order.status === "delivered" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "delivered") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-purple-500 border-4 border-purple-100"></div>
                                  <div className="flex-1 bg-purple-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-purple-700">
                                        Đã giao hàng
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đã được giao thành công
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Cancelled Status - show only if relevant */}
                              {(order.status === "cancelled" ||
                                orderStatusUpdates[order.trackingCode] ===
                                  "cancelled") && (
                                <div className="relative flex items-center gap-4">
                                  <div className="absolute left-[-22px] w-5 h-5 rounded-full bg-red-500 border-4 border-red-100"></div>
                                  <div className="flex-1 bg-red-50 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-red-700">
                                        Đã hủy
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(new Date())}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Đơn hàng đã bị hủy
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="relative z-10"
                description={
                  <span className="text-gray-500 text-lg">
                    {searchTerm
                      ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm"
                      : "Bạn chưa có đơn hàng nào"}
                  </span>
                }
              >
                <Link to="/product">
                  <button
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full 
                      hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-lg font-medium"
                  >
                    <ShoppingOutlined className="mr-2" />
                    Mua sắm ngay
                  </button>
                </Link>
              </Empty>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
