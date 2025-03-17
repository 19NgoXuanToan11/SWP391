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
import SidebarAdmin from "../../components/SidebarAdmin.jsx";
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

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7285/api/order");
      console.log("Orders response:", response.data);

      // Nếu API đã trả về đầy đủ thông tin, không cần gọi thêm API chi tiết
      setOrders(response.data);

      // Tính toán thống kê
      const totalRevenue = response.data
        .filter(
          (o) =>
            o.status.toLowerCase() === "delivered" ||
            (o.paymentMethod !== null && o.paymentMethod !== "null")
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setOrderStats({
        total: response.data.length,
        pending: response.data.filter(
          (o) => o.status.toLowerCase() === "pending"
        ).length,
        processing: response.data.filter(
          (o) => o.status.toLowerCase() === "processing"
        ).length,
        shipped: response.data.filter(
          (o) => o.status.toLowerCase() === "shipped"
        ).length,
        delivered: response.data.filter(
          (o) => o.status.toLowerCase() === "delivered"
        ).length,
        cancelled: response.data.filter(
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

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await axios.get("https://localhost:7285/Payment/all");
      console.log("Payments response:", response.data);

      if (response.data.data) {
        setPayments(response.data.data);
        calculateStats(response.data.data);
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

  // Calculate payment statistics
  const calculateStats = (data) => {
    const stats = data.reduce(
      (acc, payment) => {
        acc.total += 1;
        acc.totalAmount += payment.amount;
        if (payment.status.toLowerCase() === "pending") {
          acc.pending += 1;
        } else if (
          payment.status.toLowerCase() === "paid" ||
          payment.status.toLowerCase() === "completed"
        ) {
          acc.completed += 1;
        }
        return acc;
      },
      { total: 0, pending: 0, completed: 0, totalAmount: 0 }
    );
    setPaymentStats(stats);
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "processing":
        return "cyan";
      case "shipping":
        return "geekblue";
      case "delivered":
        return "purple";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Get payment status
  const getPaymentStatus = (method) => {
    if (!method) return "Chưa thanh toán";
    if (method === "null") return "Chưa thanh toán";
    if (method.toLowerCase() === "paid") return "Đã thanh toán";
    return method;
  };

  // Get payment color
  const getPaymentColor = (method) => {
    if (!method) return "red";
    if (method === "null") return "red";
    if (method.toLowerCase() === "paid") return "green";
    return method.toLowerCase() === "pending" ? "orange" : "green";
  };

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://localhost:7285/api/order/${orderId}`
      );
      console.log("Order details:", response.data);

      // Nếu có orderDetails, lấy thêm thông tin sản phẩm nếu cần
      if (
        response.data &&
        response.data.orderDetails &&
        response.data.orderDetails.length > 0
      ) {
        const orderWithProductDetails = { ...response.data };

        // Lấy thông tin sản phẩm cho mỗi orderDetail nếu chưa có
        const updatedOrderDetails = await Promise.all(
          orderWithProductDetails.orderDetails.map(async (item) => {
            // Nếu không có hình ảnh hoặc tên sản phẩm, lấy thông tin sản phẩm
            if (!item.image || !item.productName) {
              try {
                const productResponse = await axios.get(
                  `https://localhost:7285/api/product/${item.productId}`
                );

                console.log(
                  `Product ${item.productId} details:`,
                  productResponse.data
                );

                // Lấy hình ảnh từ imageUrls nếu có
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
                  productName:
                    productResponse.data.productName ||
                    productResponse.data.name ||
                    `Sản phẩm #${item.productId}`,
                  image: productImage,
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
        setSelectedOrder(orderWithProductDetails);
      } else {
        setSelectedOrder(response.data);
      }

      setOrderDetailsVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`https://localhost:7285/api/order/${orderId}/status`, {
        status: newStatus,
      });

      message.success("Cập nhật trạng thái đơn hàng thành công");

      // Cập nhật lại danh sách đơn hàng và doanh thu
      fetchOrders();

      // Đóng modal chi tiết nếu đang mở
      if (orderDetailsVisible) {
        setOrderDetailsVisible(false);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status and date range
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (
      statusFilter !== "all" &&
      order.status.toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = new Date(order.orderDate);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();

      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    // Search by orderId, userId or totalAmount
    return (
      order.orderId.toString().includes(searchTerm) ||
      order.userId.toString().includes(searchTerm) ||
      order.totalAmount.toString().includes(searchTerm)
    );
  });

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (
      statusFilter !== "all" &&
      payment.status.toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const paymentDate = new Date(payment.paymentDate);
      const startDate = dateRange[0].startOf("day").toDate();
      const endDate = dateRange[1].endOf("day").toDate();
      if (paymentDate < startDate || paymentDate > endDate) {
        return false;
      }
    }

    // Search by ID, buyer name, or email
    return (
      payment.paymentId.toString().includes(searchTerm) ||
      payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Chart data
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

  // Thêm hàm getStatusTag
  const getStatusTag = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "processing":
        return "Đang chuẩn bị";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Table columns
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span className="font-medium">#{text}</span>,
    },
    {
      title: "Họ tên",
      dataIndex: "buyerName",
      key: "buyerName",
      render: (text, record) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <span>{text || "Không có thông tin"}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "buyerEmail",
      key: "buyerEmail",
      render: (text) => (
        <div className="flex items-center">
          <MailOutlined className="mr-2 text-green-500" />
          <span>{text || "Không có thông tin"}</span>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "buyerPhone",
      key: "buyerPhone",
      render: (text) => (
        <div className="flex items-center">
          <PhoneOutlined className="mr-2 text-orange-500" />
          <span>{text || "Không có thông tin"}</span>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "buyerAddress",
      key: "buyerAddress",
      render: (text) => (
        <div className="flex items-center">
          <HomeOutlined className="mr-2 text-purple-500" />
          <span className="truncate max-w-[200px]" title={text}>
            {text || "Không có thông tin"}
          </span>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-1 text-blue-500" />
          <span>{formatDate(text)}</span>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => (
        <span className="font-medium text-red-500">{formatPrice(text)}</span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => (
        <Tag color={getPaymentColor(text)}>{getPaymentStatus(text)}</Tag>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.status || "pending"}
          style={{ width: 140 }}
          onChange={(value) => updateOrderStatus(record.orderId, value)}
          className="rounded-lg"
        >
          <Option value="pending">
            <Tag color="orange">Chờ xác nhận</Tag>
          </Option>
          <Option value="confirmed">
            <Tag color="blue">Đã xác nhận</Tag>
          </Option>
          <Option value="processing">
            <Tag color="cyan">Đang chuẩn bị</Tag>
          </Option>
          <Option value="shipping">
            <Tag color="geekblue">Đang giao hàng</Tag>
          </Option>
          <Option value="delivered">
            <Tag color="purple">Đã giao hàng</Tag>
          </Option>
          <Option value="completed">
            <Tag color="green">Hoàn thành</Tag>
          </Option>
          <Option value="cancelled">
            <Tag color="red">Đã hủy</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => viewOrderDetails(record.orderId)}
              className="bg-blue-500 hover:bg-blue-600"
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  onClick={() =>
                    updateOrderStatus(record.orderId, "Processing")
                  }
                  disabled={record.status !== "Pending"}
                >
                  <CheckOutlined className="mr-2 text-blue-500" />
                  Xác nhận đơn hàng
                </Menu.Item>
                <Menu.Item
                  key="2"
                  onClick={() => updateOrderStatus(record.orderId, "Shipped")}
                  disabled={record.status !== "Pending"}
                >
                  <Tag color="cyan" className="mr-2">
                    Đã gửi hàng
                  </Tag>
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={() => updateOrderStatus(record.orderId, "Delivered")}
                  disabled={record.status !== "Shipped"}
                >
                  <Tag color="green" className="mr-2">
                    Đã giao hàng
                  </Tag>
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={() => updateOrderStatus(record.orderId, "Cancelled")}
                  disabled={record.status === "Cancelled"}
                >
                  <Tag color="red" className="mr-2">
                    Đã hủy
                  </Tag>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button
              shape="circle"
              icon={<MoreOutlined />}
              size="small"
              className="border-gray-300"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Payment table columns
  const paymentColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (text) => (
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
            <DollarOutlined className="text-blue-600" />
          </span>
          <Text strong className="text-blue-600">
            #{text}
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
          <Avatar
            className="bg-gradient-to-r from-purple-400 to-pink-500"
            icon={<UserOutlined />}
          />
          <div className="flex flex-col">
            <Text strong className="text-gray-800">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              ID: {record.paymentId}
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
            <Text strong className="text-green-600 text-lg">
              {formatPrice(amount)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isPaid =
          status.toLowerCase() === "paid" ||
          status.toLowerCase() === "completed";
        return (
          <Tag
            color={isPaid ? "success" : "warning"}
            className="px-4 py-1 rounded-full text-sm font-medium flex items-center w-fit space-x-1"
          >
            {isPaid ? (
              <>
                <CheckOutlined />
                <span>Đã thanh toán</span>
              </>
            ) : (
              <>
                <ClockCircleOutlined />
                <span>Đang xử lý</span>
              </>
            )}
          </Tag>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-sm border border-yellow-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500/10 p-3 rounded-xl">
                  <FilterOutlined className="text-2xl text-yellow-600" />
                </div>
                <div className="bg-yellow-500/10 rounded-full p-2">
                  <RiseOutlined className="text-yellow-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Đang xử lý
              </h3>
              <Statistic
                value={paymentStats.pending}
                className="!text-2xl font-bold text-yellow-600"
              />
              <Progress
                percent={(paymentStats.pending / paymentStats.total) * 100}
                showInfo={false}
                strokeColor="#faad14"
                className="mt-4"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm border border-purple-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <CheckOutlined className="text-2xl text-purple-600" />
                </div>
                <div className="bg-purple-500/10 rounded-full p-2">
                  <RiseOutlined className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Hoàn thành
              </h3>
              <Statistic
                value={paymentStats.completed}
                className="!text-2xl font-bold text-purple-600"
              />
              <Progress
                percent={(paymentStats.completed / paymentStats.total) * 100}
                showInfo={false}
                strokeColor="#722ed1"
                className="mt-4"
              />
            </motion.div>
          </div>

          {/* Filters */}
          <Card className="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-lg">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Tìm kiếm giao dịch..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500"
                  size="large"
                />
              </div>
              <Select
                defaultValue="all"
                style={{ minWidth: 180 }}
                onChange={setStatusFilter}
                className="rounded-lg"
                size="large"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="pending">Đang xử lý</Option>
                <Option value="completed">Hoàn thành</Option>
              </Select>
              <RangePicker
                onChange={setDateRange}
                className="rounded-lg min-w-[280px]"
                format="DD/MM/YYYY"
                size="large"
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchPayments}
                loading={loadingPayments}
                className="ml-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-lg"
                size="large"
              >
                Làm mới
              </Button>
            </div>
          </Card>

          {/* Payments Table */}
          <Card className="rounded-2xl shadow-sm border-0 overflow-hidden">
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
                className="rounded-lg"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
            ) : (
              <Empty
                description="Không tìm thấy giao dịch nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <Modal
        title={null}
        open={orderDetailsVisible}
        onCancel={() => setOrderDetailsVisible(false)}
        footer={null}
        width={800}
        className="rounded-xl overflow-hidden"
        closeIcon={
          <Button type="text" shape="circle" icon={<CloseOutlined />} />
        }
      >
        {selectedOrder ? (
          <div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 -mt-6 -mx-6 mb-6">
              <div className="flex justify-between items-center text-white">
                <div>
                  <h3 className="text-2xl font-bold">
                    Đơn hàng #{selectedOrder.orderId}
                  </h3>
                  <p className="opacity-80">
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
                <Tag
                  color={getStatusColor(selectedOrder.status)}
                  className="text-base px-4 py-1 rounded-full"
                >
                  {selectedOrder.status}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="rounded-xl shadow-sm border-0">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" /> Thông tin
                  khách hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 mr-4"
                    />
                    <div>
                      <p className="font-medium text-lg">
                        Khách hàng #{selectedOrder.userId}
                      </p>
                      <p className="text-gray-500">
                        ID: {selectedOrder.userId}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-xl shadow-sm border-0">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                  <ShoppingCartOutlined className="mr-2 text-blue-500" /> Thông
                  tin đơn hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn hàng:</span>
                    <span className="font-medium">
                      #{selectedOrder.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày đặt:</span>
                    <span>{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trạng thái:</span>
                    <Tag color={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Tag>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thanh toán:</span>
                    <Tag color={getPaymentColor(selectedOrder.paymentMethod)}>
                      {getPaymentStatus(selectedOrder.paymentMethod)}
                    </Tag>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-6">
              <Title level={5} className="flex items-center mb-4">
                <UserOutlined className="mr-2 text-blue-500" />
                Thông tin khách hàng
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <UserOutlined className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Họ và tên</div>
                    <div className="font-medium">
                      {selectedOrder.buyerName || "Không có thông tin"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <MailOutlined className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Email</div>
                    <div className="font-medium">
                      {selectedOrder.buyerEmail || "Không có thông tin"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <PhoneOutlined className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">
                      Số điện thoại
                    </div>
                    <div className="font-medium">
                      {selectedOrder.buyerPhone || "Không có thông tin"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <HomeOutlined className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">
                      Địa chỉ giao hàng
                    </div>
                    <div className="font-medium">
                      {selectedOrder.buyerAddress || "Không có thông tin"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-xl shadow-sm border-0 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <ShoppingCartOutlined className="mr-2 text-blue-500" /> Sản phẩm
              </h3>

              {selectedOrder.orderDetails &&
              selectedOrder.orderDetails.length > 0 ? (
                <div className="space-y-4">
                  {selectedOrder.orderDetails.map((item) => (
                    <div
                      key={item.orderDetailId || item.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-white rounded-lg mr-4 overflow-hidden border">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={
                                item.productName ||
                                `Sản phẩm #${item.productId}`
                              }
                              className="w-full h-full object-cover"
                              preview={true}
                              fallback="https://placehold.co/100x100/pink/white?text=No+Image"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCartOutlined className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">
                            {item.productName || `Sản phẩm #${item.productId}`}
                          </p>
                          <div className="flex items-center mt-1">
                            <Tag color="blue" className="mr-2">
                              ID: {item.productId}
                            </Tag>
                            <Tag color="purple">SL: {item.quantity}</Tag>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600 text-lg">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-lg">Tổng cộng:</p>
                      <p className="text-xl font-bold text-pink-600">
                        {formatPrice(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Empty
                  description="Không có thông tin chi tiết sản phẩm"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>

            <Card className="rounded-xl shadow-sm border-0 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <ClockCircleOutlined className="mr-2 text-blue-500" /> Lịch sử
                đơn hàng
              </h3>

              <Timeline mode="left">
                <Timeline.Item color="green">
                  <p className="font-medium">Đơn hàng được tạo</p>
                  <p className="text-gray-500">
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </Timeline.Item>
                {selectedOrder.status !== "Pending" && (
                  <Timeline.Item color="blue">
                    <p className="font-medium">Đơn hàng được xử lý</p>
                    <p className="text-gray-500">
                      Nhân viên đang chuẩn bị đơn hàng
                    </p>
                  </Timeline.Item>
                )}
                {(selectedOrder.status === "Shipped" ||
                  selectedOrder.status === "Delivered") && (
                  <Timeline.Item color="cyan">
                    <p className="font-medium">Đơn hàng đã được gửi đi</p>
                    <p className="text-gray-500">
                      Đơn hàng đang được vận chuyển
                    </p>
                  </Timeline.Item>
                )}
                {selectedOrder.status === "Delivered" && (
                  <Timeline.Item color="green">
                    <p className="font-medium">Đơn hàng đã giao thành công</p>
                    <p className="text-gray-500">
                      Khách hàng đã nhận được hàng
                    </p>
                  </Timeline.Item>
                )}
                {selectedOrder.status === "Cancelled" && (
                  <Timeline.Item color="red">
                    <p className="font-medium">Đơn hàng đã bị hủy</p>
                    <p className="text-gray-500">Đơn hàng không được xử lý</p>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setOrderDetailsVisible(false)}
                size="large"
                className="rounded-lg"
              >
                Đóng
              </Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="pending"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, "Pending")
                      }
                    >
                      <Tag color="orange" className="mr-2">
                        Chờ xác nhận
                      </Tag>
                    </Menu.Item>
                    <Menu.Item
                      key="processing"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, "Processing")
                      }
                    >
                      <Tag color="blue" className="mr-2">
                        Đang xử lý
                      </Tag>
                    </Menu.Item>
                    <Menu.Item
                      key="shipped"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, "Shipped")
                      }
                    >
                      <Tag color="cyan" className="mr-2">
                        Đã gửi hàng
                      </Tag>
                    </Menu.Item>
                    <Menu.Item
                      key="delivered"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, "Delivered")
                      }
                    >
                      <Tag color="purple" className="mr-2">
                        Đã giao hàng
                      </Tag>
                    </Menu.Item>
                    <Menu.Item
                      key="cancelled"
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, "Cancelled")
                      }
                    >
                      <Tag color="red" className="mr-2">
                        Đã hủy
                      </Tag>
                    </Menu.Item>
                  </Menu>
                }
                placement="topRight"
                arrow
              >
                <Button
                  type="primary"
                  size="large"
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 border-none"
                >
                  Cập nhật trạng thái <SettingOutlined className="ml-1" />
                </Button>
              </Dropdown>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
