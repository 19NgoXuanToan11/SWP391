import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
  RiseOutlined,
  BarChartOutlined,
  BellOutlined,
  SettingOutlined,
  ExportOutlined,
  PrinterOutlined,
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CheckOutlined,
  MoreOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  message,
  Tooltip,
  Modal,
  Spin,
  Badge,
  Card,
  Avatar,
  Dropdown,
  Menu,
  DatePicker,
  Progress,
  Statistic,
  Divider,
  Empty,
  Image,
  Timeline,
  Typography,
  Descriptions,
  List,
  Space,
} from "antd";
import SidebarAdmin from "../../../components/sidebar/admin/SidebarAdmin.jsx";
import axios from "axios";
import { Area } from "@ant-design/charts";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

dayjs.locale("vi");

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalAmount: 0,
  });

  const datePickerRef = React.useRef(null);
  const statusSelectRef = React.useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7285/api/order");
      console.log("Orders response:", response.data);

      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );

      const ordersWithSavedStatus = response.data.map((order) => {
        const isCancelled =
          order.status?.toLowerCase() === "cancelled" ||
          order.status?.toLowerCase() === "failed";

        if (isCancelled) {
          return {
            ...order,
            status: "cancelled",
          };
        }

        if (orderStatusUpdates[order.orderId]) {
          return {
            ...order,
            status: orderStatusUpdates[order.orderId],
          };
        }
        if (order.trackingCode && orderStatusUpdates[order.trackingCode]) {
          return {
            ...order,
            status: orderStatusUpdates[order.trackingCode],
          };
        }
        return order;
      });

      setOrders(ordersWithSavedStatus);

      const totalRevenue = ordersWithSavedStatus
        .filter((o) => {
          const isPaid =
            o.paymentMethod &&
            o.paymentMethod !== "null" &&
            o.paymentMethod.toLowerCase() !== "pending" &&
            o.status.toLowerCase() === "delivered";

          const paymentStatus =
            o.paymentStatus &&
            o.paymentStatus.toLowerCase() !== "pending" &&
            o.paymentStatus.toLowerCase() !== "chưa thanh toán";

          return isPaid || paymentStatus;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setOrderStats({
        total: ordersWithSavedStatus.length,
        pending: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "pending"
        ).length,
        processing: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "processing"
        ).length,
        shipped: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "shipped"
        ).length,
        delivered: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "delivered"
        ).length,
        cancelled: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "cancelled"
        ).length,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await axios.get("https://localhost:7285/Payment/all");
      console.log("Payments response:", response.data);

      if (response.data.data) {
        const orderStatusUpdates = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );

        const ordersResponse = await axios.get("https://localhost:7285/api/order");
        const cancelledOrderIds = new Set();
        
        ordersResponse.data.forEach(order => {
          if (order.status?.toLowerCase() === "cancelled" || 
              order.status?.toLowerCase() === "failed") {
            cancelledOrderIds.add(order.orderId);
          }
        });

        const paymentsWithOrderStatus = response.data.data.map((payment) => {
          if (cancelledOrderIds.has(payment.orderId)) {
            return {
              ...payment,
              orderStatus: "cancelled"
            };
          }
          
          if (orderStatusUpdates[payment.orderId] === "cancelled") {
            return {
              ...payment,
              orderStatus: "cancelled"
            };
          }
          
          if (payment.orderId && orderStatusUpdates[payment.orderId]) {
            return {
              ...payment,
              orderStatus: orderStatusUpdates[payment.orderId],
            };
          }
          
          return payment;
        });

        setPayments(paymentsWithOrderStatus);
        calculateStats(paymentsWithOrderStatus);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Không thể tải dữ liệu thanh toán");
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, []);

  useEffect(() => {
    const checkForCancelledOrders = () => {
      try {
        const savedStatuses = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );

        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (
              savedStatuses[order.orderId] === "cancelled" ||
              savedStatuses[order.trackingCode] === "cancelled"
            ) {
              return { ...order, status: "cancelled" };
            }
            return order;
          })
        );
      } catch (error) {
        console.error("Error checking for cancelled orders", error);
      }
    };

    checkForCancelledOrders();
    const intervalId = setInterval(checkForCancelledOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const calculateStats = (data) => {
    const stats = data.reduce(
      (acc, payment) => {
        acc.total += 1;

        const isPaid =
          payment.status &&
          (payment.status.toLowerCase() === "paid" ||
            payment.status.toLowerCase() === "completed" ||
            payment.status.toLowerCase() === "đã thanh toán");

        if (isPaid) {
          acc.totalAmount += payment.amount;
          acc.completed += 1;
        } else if (
          payment.status &&
          payment.status.toLowerCase() === "pending"
        ) {
          acc.pending += 1;
        }

        return acc;
      },
      { total: 0, pending: 0, completed: 0, totalAmount: 0 }
    );
    setPaymentStats(stats);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "processing":
        return "cyan";
      case "shipping":
      case "delivering":
        return "geekblue";
      case "delivered":
      case "completed":
      case "complete":
        return "green";
      case "cancelled":
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatus = (method) => {
    if (!method) return "Chưa thanh toán";
    if (method === "null") return "Chưa thanh toán";
    if (method.toLowerCase() === "paid") return "Đã thanh toán";
    return method;
  };

  const getPaymentColor = (method) => {
    if (!method) return "red";
    if (method === "null") return "red";
    if (method.toLowerCase() === "paid") return "green";
    return method.toLowerCase() === "pending" ? "orange" : "green";
  };

  const viewOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://localhost:7285/api/Order/${orderId}`
      );
      console.log("Order details:", response.data);

      if (
        response.data &&
        response.data.orderDetails &&
        response.data.orderDetails.length > 0
      ) {
        const orderWithProductDetails = { ...response.data };

        const updatedOrderDetails = await Promise.all(
          orderWithProductDetails.orderDetails.map(async (item) => {
            if (!item.image || !item.productName) {
              try {
                const productResponse = await axios.get(
                  `https://localhost:7285/api/product/${item.productId}`
                );

                console.log(
                  `Product ${item.productId} details:`,
                  productResponse.data
                );

                let productImage = null;
                if (
                  productResponse.data.imageUrls &&
                  productResponse.data.imageUrls.length > 0
                ) {
                  productImage = productResponse.data.imageUrls[0];
                } else {
                  productImage = productResponse.data.image || null;
                }

                return {
                  ...item,
                  image: productImage,
                  productName: productResponse.data.name,
                };
              } catch (error) {
                console.error(
                  `Error fetching product ${item.productId}:`,
                  error
                );
                return item;
              }
            }
            return item;
          })
        );

        orderWithProductDetails.orderDetails = updatedOrderDetails;
      }

      setSelectedOrder(orderWithProductDetails);
      setOrderDetailsVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);

      // Find the order to update
      const orderToUpdate = orders.find((order) => order.orderId === orderId);
      if (!orderToUpdate) {
        message.error("Không tìm thấy đơn hàng");
        setLoading(false);
        return;
      }

      // Get current status from localStorage or order
      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );
      
      const currentStatus =
        orderStatusUpdates[orderId] ||
        orderStatusUpdates[orderToUpdate.trackingCode] ||
        orderToUpdate.status ||
        "pending";

      // Check if order is already cancelled
      if (currentStatus.toLowerCase() === "cancelled") {
        message.error("Không thể thay đổi trạng thái của đơn hàng đã hủy");
        setLoading(false);
        return;
      }

      // Map frontend status to backend status
      let apiStatus;
      switch (newStatus.toLowerCase()) {
        case "shipping":
          apiStatus = "delivering";
          break;
        case "delivered":
          apiStatus = "complete";
          break;
        case "cancelled":
          apiStatus = "cancelled"; 
          break;
        default:
          apiStatus = newStatus;
      }

      // Log the request 
      console.log(`Updating order ${orderId} status: ${currentStatus} → ${newStatus} (API: ${apiStatus})`);
      
      try {
        // Add paid status to make backend accept the change
        const response = await axios.patch(`https://localhost:7285/api/Order/${orderId}/status`, {
          status: apiStatus,
          paymentConfirmed: true // Add this field to signal that payment is confirmed
        });

        console.log("API response:", response.data);
        message.success("Cập nhật trạng thái đơn hàng thành công");

        // Update the UI and localStorage
        const updatedOrders = orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status: newStatus,
            };
          }
          return order;
        });
        setOrders(updatedOrders);

        orderStatusUpdates[orderId] = newStatus;
        localStorage.setItem(
          "orderStatusUpdates",
          JSON.stringify(orderStatusUpdates)
        );
        
        // Also update the payment list if needed
        if (payments.length > 0) {
          const updatedPayments = payments.map(payment => {
            if (payment.orderId === orderId) {
              return {
                ...payment,
                orderStatus: newStatus
              };
            }
            return payment;
          });
          setPayments(updatedPayments);
        }
        
      } catch (error) {
        console.error("API error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        // Show the server error message if available
        const errorMsg = error.response?.data?.message || error.message;
        message.error("Không thể cập nhật trạng thái đơn hàng: " + errorMsg);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(null);

    if (datePickerRef.current) {
      datePickerRef.current.setValue(null);
    }

    if (statusSelectRef.current) {
      statusSelectRef.current.setValue("all");
    }

    fetchOrders();
    fetchPayments();

    message.success("Đã làm mới dữ liệu");
  };

  const filteredOrders = orders.filter((order) => {
    if (
      statusFilter !== "all" &&
      order.status.toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = new Date(order.orderDate);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();

      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    return (
      order.orderId.toString().includes(searchTerm) ||
      order.userId.toString().includes(searchTerm) ||
      order.totalAmount.toString().includes(searchTerm)
    );
  });

  const filteredPayments = payments.filter((payment) => {
    if (statusFilter !== "all") {
      if (statusFilter === "paid") {
        const isPaid =
          payment.status.toLowerCase() === "paid" ||
          payment.status.toLowerCase() === "completed";
        if (!isPaid) return false;
      } else if (payment.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const paymentDate = new Date(payment.paymentDate);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();
      if (paymentDate < startDate || paymentDate > endDate) {
        return false;
      }
    }

    return (
      payment.paymentId.toString().includes(searchTerm) ||
      payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const chartData = payments.map((payment) => ({
    date: formatDate(payment.paymentDate),
    amount: payment.amount,
  }));

  const chartConfig = {
    data: chartData,
    xField: "date",
    yField: "amount",
    smooth: true,
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: "Doanh thu",
          value: formatPrice(data.amount),
        };
      },
    },
    yAxis: {
      label: {
        formatter: (value) => formatPrice(value),
      },
    },
  };

  const getStatusTag = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang chuẩn bị";
      case "shipping":
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
      case "completed":
      case "complete":
        return "Đã giao hàng";
      case "cancelled":
      case "failed":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const paymentColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
            <ShoppingCartOutlined className="text-blue-600" />
          </span>
          <Text strong className="text-blue-600">
            #{text || "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "buyerName",
      key: "buyerName",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <Text strong className="text-gray-800">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              Mã GD: {record.paymentId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "buyerEmail",
      key: "buyerEmail",
      render: (text) => (
        <div className="flex items-center space-x-2">
          <MailOutlined className="text-green-500" />
          <Text className="text-gray-600">{text || "Không có thông tin"}</Text>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "buyerPhone",
      key: "buyerPhone",
      render: (text) => (
        <div className="flex items-center space-x-2">
          <PhoneOutlined className="text-orange-500" />
          <Text className="text-gray-600">{text || "Không có thông tin"}</Text>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "buyerAddress",
      key: "buyerAddress",
      render: (text) => (
        <div className="flex items-center space-x-2">
          <HomeOutlined className="text-purple-500" />
          <Text className="text-gray-600 truncate max-w-[200px]" title={text}>
            {text || "Không có thông tin"}
          </Text>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => (
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-lg">
          <CalendarOutlined className="text-blue-500" />
          <Text className="text-gray-600">{formatDate(text)}</Text>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <div className="flex items-center justify-end">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            {formatPrice(amount)}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isPaid =
          status.toLowerCase() === "paid" ||
          status.toLowerCase() === "completed";
        return (
          <Tag color={isPaid ? "success" : "warning"}>
            {isPaid ? (
              <>
                <CheckOutlined />
                <span>Đã thanh toán</span>
              </>
            ) : (
              <>
                <ClockCircleOutlined />
                <span>Chưa thanh toán</span>
              </>
            )}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái đơn hàng",
      key: "orderStatus",
      render: (_, record) => {
        const orderStatusUpdates = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );

        let currentStatus =
          orderStatusUpdates[record.orderId] ||
          orderStatusUpdates[record.trackingCode] ||
          record.orderStatus ||
          "pending";

        const matchingOrder = orders.find(o => o.orderId === record.orderId);
        const isOrderCancelled = 
          matchingOrder?.status?.toLowerCase() === "cancelled" || 
          currentStatus === "cancelled";

        if (isOrderCancelled) {
          currentStatus = "cancelled";
        }

        // Simplified payment status check that matches what the backend expects
        const isPaid = 
          record.status?.toLowerCase() === "paid" ||
          record.status?.toLowerCase() === "completed";

        // If order is cancelled or payment is paid, allow status change
        const allowStatusChange = isPaid || currentStatus === "cancelled";

        return (
          <Tooltip
            title={
              !isPaid && currentStatus !== "cancelled"
                ? "Cần thanh toán để cập nhật trạng thái"
                : ""
            }
          >
            <Select
              value={currentStatus}
              style={{
                width: 180,
                fontSize: 14,
                opacity: !isPaid && currentStatus !== "cancelled" ? 0.6 : 1,
              }}
              onChange={(value) => {
                if (record.orderId) {
                  updateOrderStatus(record.orderId, value);
                } else {
                  message.error({
                    content: "Không tìm thấy mã đơn hàng",
                    duration: 2,
                  });
                }
              }}
              className="custom-order-select"
              dropdownClassName="custom-select-dropdown"
              dropdownStyle={{
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                padding: "8px",
              }}
              optionLabelProp="label"
              disabled={!allowStatusChange || isOrderCancelled} 
            >
              <Option
                value="pending"
                label={
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Chờ xác nhận</span>
                  </div>
                }
              >
                <div className="flex items-center py-1.5 px-1 transition-colors duration-200 hover:bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 mr-3">
                    <ClockCircleOutlined className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Chờ xác nhận
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Đơn hàng mới
                    </p>
                  </div>
                </div>
              </Option>
              <Option
                value="shipping"
                label={
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <span>Đang giao hàng</span>
                  </div>
                }
              >
                <div className="flex items-center py-1.5 px-1 transition-colors duration-200 hover:bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 mr-3">
                    <CarOutlined className="text-cyan-500 text-sm" />
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Đang giao hàng
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Đã chuyển cho đơn vị vận chuyển
                    </p>
                  </div>
                </div>
              </Option>
              <Option
                value="delivered"
                label={
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Đã giao hàng</span>
                  </div>
                }
              >
                <div className="flex items-center py-1.5 px-1 transition-colors duration-200 hover:bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                    <CheckCircleOutlined className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">
                      Đã giao hàng
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Khách hàng đã nhận
                    </p>
                  </div>
                </div>
              </Option>
              <Option
                value="cancelled"
                label={
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Đã hủy</span>
                  </div>
                }
              >
                <div className="flex items-center py-1.5 px-1 transition-colors duration-200 hover:bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-3">
                    <CloseCircleOutlined className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Đã hủy</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Đơn hàng đã bị hủy
                    </p>
                  </div>
                </div>
              </Option>
            </Select>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
          >
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white">
                Quản Lý Đơn Hàng
              </h1>
              <p className="text-white text-opacity-80 mt-2 max-w-2xl">
                Theo dõi và quản lý các đơn hàng
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <BarChartOutlined className="text-2xl text-blue-600" />
                </div>
                <div className="bg-blue-500/10 rounded-full p-2">
                  <RiseOutlined className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Tổng giao dịch
              </h3>
              <Statistic
                value={paymentStats.total}
                className="!text-2xl font-bold text-blue-600"
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor={{
                  "0%": "#60A5FA",
                  "100%": "#3B82F6",
                }}
                className="mt-4"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm border border-green-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/10 p-3 rounded-xl">
                  <DollarOutlined className="text-2xl text-green-600" />
                </div>
                <div className="bg-green-500/10 rounded-full p-2">
                  <RiseOutlined className="text-green-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Tổng doanh thu
              </h3>
              <Statistic
                value={formatPrice(paymentStats.totalAmount)}
                className="!text-2xl font-bold text-green-600"
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor={{
                  "0%": "#34D399",
                  "100%": "#059669",
                }}
                className="mt-4"
              />
            </motion.div>
          </div>

          <Card className="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-lg">
            <div className="flex flex-col md:flex-row flex-wrap gap-5">
              <div className="flex-1 min-w-[240px]">
                <label className="text-sm text-gray-500 font-medium mb-2 block">
                  Tìm kiếm
                </label>
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  prefix={<SearchOutlined className="text-blue-500" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md py-2.5"
                  size="large"
                  allowClear
                />
              </div>

              <div className="min-w-[180px]">
                <label className="text-sm text-gray-500 font-medium mb-2 block">
                  Trạng thái
                </label>
                <Select
                  ref={statusSelectRef}
                  defaultValue="all"
                  value={statusFilter}
                  style={{ width: "100%" }}
                  onChange={setStatusFilter}
                  className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  size="large"
                  suffixIcon={<FilterOutlined className="text-blue-500" />}
                  dropdownStyle={{
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  <Option value="all">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-400" />
                      <span>Tất cả trạng thái</span>
                    </div>
                  </Option>
                  <Option value="pending">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>Chờ xác nhận</span>
                    </div>
                  </Option>
                  <Option value="paid">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Đã thanh toán</span>
                    </div>
                  </Option>
                </Select>
              </div>

              <div className="min-w-[240px]">
                <label className="text-sm text-gray-500 font-medium mb-2 block">
                  Khoảng thời gian
                </label>
                <RangePicker
                  ref={datePickerRef}
                  onChange={setDateRange}
                  className="w-full rounded-xl border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  format="DD/MM/YYYY"
                  size="large"
                  allowClear={true}
                  value={dateRange}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  suffixIcon={<CalendarOutlined className="text-blue-500" />}
                  dropdownClassName="rounded-xl shadow-xl"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={resetFilters}
                  loading={loading || loadingPayments}
                  className="h-[52px] px-6 bg-gradient-to-r text-white from-pink-400 to-indigo-400 hover:from-pink-400 hover:to-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  size="large"
                >
                  <span className="font-medium">Làm mới</span>
                </button>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <div className="mb-4">
              <Title level={4} className="!mb-1">
                Danh sách giao dịch
              </Title>
              <Text type="secondary">
                Quản lý và theo dõi các giao dịch thanh toán
              </Text>
            </div>

            {loadingPayments ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  columns={paymentColumns}
                  dataSource={filteredPayments}
                  rowKey="paymentId"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} giao dịch`,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                  }}
                  scroll={{ x: 1800 }}
                  className="rounded-lg"
                  rowClassName="hover:bg-gray-50 transition-colors"
                />
              </div>
            ) : (
              <Empty
                description="Không tìm thấy giao dịch nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPage;
