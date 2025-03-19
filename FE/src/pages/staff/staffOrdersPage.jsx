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

// Thêm CSS tùy chỉnh cho các select dropdown
const customSelectStyles = `
  .custom-order-select .ant-select-selector {
    padding: 8px 12px !important;
    border-radius: 12px !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05) !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-order-select .ant-select-selector:hover {
    border-color: #a5b4fc !important;
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.1) !important;
  }
  
  .custom-order-select .ant-select-focused .ant-select-selector {
    border-color: #818cf8 !important;
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.2) !important;
  }
  
  .custom-order-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    font-weight: 500 !important;
  }
  
  .custom-select-dropdown .ant-select-item {
    padding: 10px 12px !important;
    border-radius: 8px !important;
    margin: 4px 0 !important;
    transition: all 0.2s ease !important;
  }
  
  .custom-select-dropdown .ant-select-item-option-selected {
    background-color: rgba(99, 102, 241, 0.1) !important;
    color: #4f46e5 !important;
  }
  
  .custom-select-dropdown .ant-select-item-option-active {
    background-color: rgba(99, 102, 241, 0.05) !important;
  }
`;

const StaffOrdersPage = () => {
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
        <div className="flex items-center">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <Text strong className="text-green-600">
              {formatPrice(text)}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color, text;

        switch (status?.toLowerCase()) {
          case "pending":
            color = "orange";
            text = "Chờ xác nhận";
            break;
          case "processing":
            color = "blue";
            text = "Đang xử lý";
            break;
          case "shipping":
            color = "cyan";
            text = "Đang giao hàng";
            break;
          case "delivered":
            color = "green";
            text = "Đã giao hàng";
            break;
          case "completed":
            color = "purple";
            text = "Hoàn thành";
            break;
          case "cancelled":
            color = "red";
            text = "Đã hủy";
            break;
          default:
            color = "default";
            text = "Chưa xác định";
        }

        return (
          <Tag color={color} className="px-3 py-1 rounded-full">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.status || "pending"}
          style={{ width: 140 }}
          onChange={(value) => updateOrderStatus(record.orderId, value)}
          className="rounded-lg"
        >
          <Option value="pending">
            <div className="flex items-center">
              <ClockCircleOutlined className="text-orange-500 mr-2" />
              <span>Chờ xác nhận</span>
            </div>
          </Option>
          <Option value="shipping">
            <div className="flex items-center">
              <CarOutlined className="text-cyan-500 mr-2" />
              <span>Đang giao hàng</span>
            </div>
          </Option>
          <Option value="delivered">
            <div className="flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              <span>Đã giao hàng</span>
            </div>
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
          </div>
        </div>
      ),
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
      align: "left",
      render: (amount) => (
        <div className="flex items-center">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <Text strong className="text-green-600">
              {formatPrice(amount)}
            </Text>
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
          {/* Thêm CSS tùy chỉnh */}
          <style>{customSelectStyles}</style>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
          >
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white">
                Quản Lý Đơn Hàng
              </h1>
              <p className="text-white text-opacity-80 mt-2 max-w-2xl">
                Theo dõi và quản lý các đơn hàng
              </p>
            </div>
            {/* Trang trí background hiệu ứng đẹp hơn */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <div className="absolute -left-5 bottom-0 w-24 h-24 rounded-full bg-white opacity-10"></div>
            <div className="absolute right-1/4 bottom-5 w-12 h-12 rounded-full bg-white opacity-20"></div>
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
    </div>
  );
};

export default StaffOrdersPage;
