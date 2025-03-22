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
import SidebarStaff from "../../components/SidebarStaff.jsx";
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
  const updateOrderStatus = (orderId, newStatus) => {
    try {
      setLoading(true);
      // Update local state
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
      message.success("Cập nhật trạng thái đơn hàng thành công");

      // Update localStorage to sync with user view
      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );
      orderStatusUpdates[orderId] = newStatus;
      localStorage.setItem(
        "orderStatusUpdates",
        JSON.stringify(orderStatusUpdates)
      );
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
            {formatPrice(amount)}
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
          <Tag color={isPaid ? "success" : "warning"}>
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
    {
      title: "Trạng thái đơn hàng",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.orderStatus || "pending"}
          style={{
            width: 180,
            fontSize: 14,
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
                <span className="text-gray-800 font-medium">Chờ xác nhận</span>
                <p className="text-xs text-gray-500 mt-0.5">Đơn hàng mới</p>
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
                <span className="text-gray-800 font-medium">Đã giao hàng</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Khách hàng đã nhận
                </p>
              </div>
            </div>
          </Option>
        </Select>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarStaff />
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
            className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-300 via-purple-500 to-pink-500"
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

          {/* Payments Table */}
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
