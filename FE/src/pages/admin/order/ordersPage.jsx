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

  // Thêm state để lưu tham chiếu đến RangePicker và Select component
  const datePickerRef = React.useRef(null);
  const statusSelectRef = React.useRef(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7285/api/order");
      console.log("Orders response:", response.data);

      // Khôi phục trạng thái từ localStorage
      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );

      // Kiểm tra trạng thái của tất cả các đơn hàng trong API
      if (response.data && Array.isArray(response.data)) {
        // Lặp qua tất cả các đơn hàng từ API
        response.data.forEach((order) => {
          // Nếu đơn hàng có trạng thái failed hoặc cancelled (đã bị hủy bởi người dùng)
          if (
            order.status &&
            (order.status.toLowerCase() === "failed" ||
              order.status.toLowerCase().includes("cancel"))
          ) {
            // Đánh dấu đơn hàng này là đã hủy trong localStorage
            orderStatusUpdates[order.orderId] = "cancelled";
            console.log(
              `Order #${order.orderId} marked as cancelled in localStorage`
            );
          }
        });
      }

      // Lưu lại các thay đổi trạng thái vào localStorage
      localStorage.setItem(
        "orderStatusUpdates",
        JSON.stringify(orderStatusUpdates)
      );

      // Áp dụng trạng thái đã lưu cho các đơn hàng được tải về
      const ordersWithSavedStatus = response.data.map((order) => {
        // Kiểm tra nếu đơn hàng đã bị hủy bởi người dùng (status từ API là 'failed')
        if (
          order.status &&
          (order.status.toLowerCase() === "failed" ||
            order.status.toLowerCase().includes("cancel"))
        ) {
          // Trả về đơn hàng với trạng thái "cancelled" cho giao diện admin
          return {
            ...order,
            status: "cancelled",
          };
        }

        // Kiểm tra nếu có trạng thái lưu cho đơn hàng này
        if (orderStatusUpdates[order.orderId]) {
          return {
            ...order,
            status: orderStatusUpdates[order.orderId], // Ưu tiên sử dụng trạng thái đã lưu
          };
        }
        // Kiểm tra nếu có trackingCode và có trạng thái lưu theo trackingCode
        if (order.trackingCode && orderStatusUpdates[order.trackingCode]) {
          return {
            ...order,
            status: orderStatusUpdates[order.trackingCode],
          };
        }
        return order;
      });

      // Nếu API đã trả về đầy đủ thông tin, không cần gọi thêm API chi tiết
      setOrders(ordersWithSavedStatus);

      // Tính toán thống kê
      const totalRevenue = ordersWithSavedStatus
        .filter((o) => {
          // Chỉ tính doanh thu cho đơn hàng đã thanh toán
          const isPaid =
            o.paymentMethod &&
            o.paymentMethod !== "null" &&
            o.paymentMethod.toLowerCase() !== "pending" &&
            o.status.toLowerCase() === "delivered";

          // Kiểm tra trạng thái thanh toán
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

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await axios.get("https://localhost:7285/Payment/all");
      console.log("Payments response:", response.data);

      if (response.data.data) {
        // Khôi phục trạng thái từ localStorage
        const orderStatusUpdates = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );

        // Kiểm tra từng đơn hàng trong API orders nếu bị hủy
        try {
          const ordersResponse = await axios.get(
            "https://localhost:7285/api/order"
          );
          if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
            ordersResponse.data.forEach((order) => {
              if (
                order.status &&
                (order.status.toLowerCase() === "failed" ||
                  order.status.toLowerCase().includes("cancel"))
              ) {
                // Đánh dấu đơn hàng này là đã hủy trong localStorage
                orderStatusUpdates[order.orderId] = "cancelled";
                console.log(
                  `Order #${order.orderId} marked as cancelled in payment handling`
                );
              }
            });
          }
        } catch (ordersError) {
          console.error("Error checking orders in fetchPayments:", ordersError);
        }

        // Lưu lại các thay đổi trạng thái vào localStorage
        localStorage.setItem(
          "orderStatusUpdates",
          JSON.stringify(orderStatusUpdates)
        );

        // Áp dụng trạng thái đã lưu cho payments
        const paymentsWithOrderStatus = response.data.data.map((payment) => {
          // Kiểm tra nếu payment có orderStatus là failed (đã bị hủy)
          if (
            payment.orderStatus &&
            (payment.orderStatus.toLowerCase() === "failed" ||
              payment.orderStatus.toLowerCase().includes("cancel"))
          ) {
            // Cập nhật trạng thái trong localStorage nếu có orderId
            if (payment.orderId) {
              orderStatusUpdates[payment.orderId] = "cancelled";
            }

            return {
              ...payment,
              orderStatus: "cancelled",
            };
          }

          // Kiểm tra nếu có đơn hàng liên quan và đã bị hủy trong localStorage
          if (
            payment.orderId &&
            orderStatusUpdates[payment.orderId] === "cancelled"
          ) {
            return {
              ...payment,
              orderStatus: "cancelled",
            };
          }

          // Kiểm tra nếu đơn hàng đã bị hủy trong API
          if (
            payment.orderStatus &&
            payment.orderStatus.toLowerCase() === "failed"
          ) {
            // Cập nhật trạng thái trong localStorage
            if (payment.orderId) {
              orderStatusUpdates[payment.orderId] = "cancelled";
            }

            // Trả về payment với trạng thái đã hủy
            return {
              ...payment,
              orderStatus: "cancelled",
            };
          }

          // Thêm trạng thái đơn hàng từ localStorage nếu có
          if (payment.orderId && orderStatusUpdates[payment.orderId]) {
            return {
              ...payment,
              orderStatus: orderStatusUpdates[payment.orderId],
            };
          }
          return payment;
        });

        // Lưu lại các thay đổi trạng thái vào localStorage
        localStorage.setItem(
          "orderStatusUpdates",
          JSON.stringify(orderStatusUpdates)
        );

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

  // Thêm hàm để cập nhật trạng thái đơn hàng hiện có
  const resetAndUpdateOrderStatuses = async () => {
    console.log(
      "Resetting and updating all cancelled order statuses in localStorage"
    );

    try {
      // Tải dữ liệu đơn hàng từ API
      const ordersResponse = await axios.get(
        "https://localhost:7285/api/order"
      );

      // Xóa localStorage hiện tại và tạo mới (hoặc giữ lại và cập nhật)
      let orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );

      // Kiểm tra từng đơn hàng
      if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
        // Lặp qua tất cả đơn hàng để tìm đơn đã hủy
        ordersResponse.data.forEach((order) => {
          // Nếu đơn hàng có trạng thái failed hoặc cancelled (đã bị hủy bởi người dùng)
          if (
            order.status &&
            (order.status.toLowerCase() === "failed" ||
              order.status.toLowerCase().includes("cancel"))
          ) {
            // Đánh dấu đơn hàng này là đã hủy trong localStorage
            orderStatusUpdates[order.orderId] = "cancelled";
            console.log(
              `Order #${order.orderId} marked as cancelled during initialization`
            );
          }
        });
      }

      // Lưu lại vào localStorage
      localStorage.setItem(
        "orderStatusUpdates",
        JSON.stringify(orderStatusUpdates)
      );

      console.log(
        "Updated localStorage with cancelled orders:",
        orderStatusUpdates
      );

      // Gọi fetchOrders để áp dụng trạng thái mới
      fetchOrders();
      fetchPayments();

      message.success("Đã cập nhật lại trạng thái tất cả đơn hàng");
    } catch (error) {
      console.error("Error in resetAndUpdateOrderStatuses:", error);

      // Nếu có lỗi, vẫn tiếp tục fetch dữ liệu
      fetchOrders();
      fetchPayments();
    }
  };

  // Thêm hàm để cưỡng chế hiển thị trạng thái đã hủy cho các đơn hàng
  const forceUpdateOrderStatusesInUI = () => {
    console.log("Forcing UI update for cancelled orders");

    // Lấy dữ liệu từ localStorage
    const cancelledStatusUpdates = JSON.parse(
      localStorage.getItem("orderStatusUpdates") || "{}"
    );

    // Danh sách các orderId đã bị hủy từ localStorage
    const cancelledOrderIds = Object.keys(cancelledStatusUpdates).filter(
      (orderId) => cancelledStatusUpdates[orderId] === "cancelled"
    );

    // Cập nhật UI trực tiếp
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        // Kiểm tra nếu order có trạng thái là failed từ API
        if (
          order.status &&
          (order.status.toLowerCase() === "failed" ||
            order.status.toLowerCase().includes("cancel"))
        ) {
          console.log(
            `Forcing order #${order.orderId} to cancelled status because API status is failed`
          );
          return { ...order, status: "cancelled" };
        }

        // Kiểm tra nếu orderId nằm trong danh sách đã bị hủy từ localStorage
        if (
          order.orderId &&
          cancelledOrderIds.includes(order.orderId.toString())
        ) {
          console.log(
            `Forcing order #${order.orderId} to cancelled status in UI from localStorage`
          );
          return { ...order, status: "cancelled" };
        }
        return order;
      });
      return updatedOrders;
    });

    // Cập nhật UI cho payments
    setPayments((prevPayments) => {
      const updatedPayments = prevPayments.map((payment) => {
        // Kiểm tra nếu payment có trạng thái failed từ API
        if (
          payment.orderStatus &&
          (payment.orderStatus.toLowerCase() === "failed" ||
            payment.orderStatus.toLowerCase().includes("cancel"))
        ) {
          console.log(
            `Forcing payment with orderStatus failed to cancelled status in UI`
          );
          return { ...payment, orderStatus: "cancelled" };
        }

        // Kiểm tra nếu payment liên quan đến đơn hàng đã hủy
        if (
          payment.orderId &&
          cancelledOrderIds.includes(payment.orderId.toString())
        ) {
          console.log(
            `Forcing payment for order #${payment.orderId} to cancelled status in UI`
          );
          return { ...payment, orderStatus: "cancelled" };
        }
        return payment;
      });
      return updatedPayments;
    });

    message.success("Đã cập nhật trạng thái đơn hàng đã hủy trong giao diện");
  };

  useEffect(() => {
    // Reset và cập nhật trạng thái trước khi fetch dữ liệu
    resetAndUpdateOrderStatuses();

    // Cưỡng chế cập nhật UI sau khi đã tải xong dữ liệu
    const uiUpdateTimeout = setTimeout(() => {
      forceUpdateOrderStatusesInUI();
    }, 2000);

    // Set up a polling mechanism to check for cancelled orders
    const orderUpdateInterval = setInterval(() => {
      // Refresh order data to check for any that were cancelled by users
      fetchOrders();
      fetchPayments();
      // Cưỡng chế cập nhật UI sau mỗi lần cập nhật dữ liệu
      forceUpdateOrderStatusesInUI();
    }, 20000); // Check every 20 seconds

    // Clean up on component unmount
    return () => {
      clearInterval(orderUpdateInterval);
      clearTimeout(uiUpdateTimeout);
    };
  }, []);

  // Calculate payment statistics
  const calculateStats = (data) => {
    const stats = data.reduce(
      (acc, payment) => {
        acc.total += 1;

        const isPaid =
          payment.status &&
          (payment.status.toLowerCase() === "paid" ||
            payment.status.toLowerCase() === "completed" ||
            payment.status.toLowerCase() === "đã thanh toán");

        // Only add amount to totalAmount if payment is paid
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
        `https://localhost:7285/api/Order/${orderId}`
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);

      // Lấy trạng thái hiện tại từ record hoặc từ localStorage
      const orderStatusUpdates = JSON.parse(
        localStorage.getItem("orderStatusUpdates") || "{}"
      );

      const orderToUpdate = orders.find((order) => order.orderId === orderId);
      if (!orderToUpdate) {
        message.error("Không tìm thấy đơn hàng");
        setLoading(false);
        return;
      }

      const currentStatus =
        orderStatusUpdates[orderId] ||
        orderStatusUpdates[orderToUpdate.trackingCode] ||
        orderToUpdate.status ||
        "pending";

      // Kiểm tra nếu đơn hàng đã hủy thì không cho phép thay đổi trạng thái
      if (currentStatus === "cancelled") {
        message.error("Không thể thay đổi trạng thái của đơn hàng đã hủy");
        setLoading(false);
        return;
      }

      // Kiểm tra quy tắc chuyển đổi trạng thái
      // 1. Từ "pending" chỉ có thể chuyển sang "shipping" hoặc "cancelled"
      // 2. Từ "shipping" chỉ có thể chuyển sang "delivered" hoặc "cancelled"
      // 3. Từ "delivered" không thể chuyển về trạng thái trước đó
      // 4. Từ "cancelled" không thể chuyển sang trạng thái khác

      let isValidTransition = true;
      let errorMessage = "";

      if (
        currentStatus === "pending" &&
        newStatus !== "pending" &&
        newStatus !== "shipping" &&
        newStatus !== "cancelled"
      ) {
        isValidTransition = false;
        errorMessage =
          "Từ trạng thái Chờ xác nhận chỉ có thể chuyển sang Đang giao hàng hoặc Đã hủy";
      } else if (
        currentStatus === "shipping" &&
        newStatus !== "shipping" &&
        newStatus !== "delivered" &&
        newStatus !== "cancelled"
      ) {
        isValidTransition = false;
        errorMessage =
          "Từ trạng thái Đang giao hàng chỉ có thể chuyển sang Đã giao hàng hoặc Đã hủy";
      } else if (currentStatus === "delivered" && newStatus !== "delivered") {
        isValidTransition = false;
        errorMessage = "Không thể thay đổi trạng thái sau khi đã giao hàng";
      }

      if (!isValidTransition) {
        message.error(errorMessage);
        setLoading(false);
        return;
      }

      // Chuyển đổi trạng thái hiển thị sang trạng thái API chấp nhận
      let apiStatus;
      switch (newStatus) {
        case "shipping":
          apiStatus = "delivering";
          break;
        case "delivered":
          apiStatus = "complete";
          break;
        case "cancelled":
          apiStatus = "failed";
          break;
        default:
          apiStatus = newStatus;
      }

      // Gọi API để cập nhật
      await axios.patch(`https://localhost:7285/api/Order/${orderId}/status`, {
        status: apiStatus,
      });

      message.success("Cập nhật trạng thái đơn hàng thành công");

      // Cập nhật UI
      if (orderToUpdate) {
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

        // Cập nhật localStorage
        const orderStatusUpdates = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );
        orderStatusUpdates[orderId] = newStatus;
        localStorage.setItem(
          "orderStatusUpdates",
          JSON.stringify(orderStatusUpdates)
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm resetFilters để làm mới tất cả các bộ lọc
  const resetFilters = () => {
    // Reset tất cả các bộ lọc và tìm kiếm
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(null);

    // Xóa giá trị trong RangePicker bằng cách đặt giá trị là null
    if (datePickerRef.current) {
      datePickerRef.current.setValue(null);
    }

    // Đặt lại giá trị Select về "all"
    if (statusSelectRef.current) {
      statusSelectRef.current.setValue("all");
    }

    // Fetch lại dữ liệu ban đầu
    fetchOrders();
    fetchPayments();

    message.success("Đã làm mới dữ liệu");
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
      case "processing":
        return "Đang chuẩn bị";
      case "shipping":
        return "Đang giao hàng";
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
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

  // Payment table columns
  const paymentColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text, record) => (
        <div className="flex items-center">
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
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <Text strong className="text-gray-700">
            {text}
          </Text>
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
          <Text className="text-gray-600">{text || "Không có thông tin"}</Text>
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
          <Text className="text-gray-600">{text || "Không có thông tin"}</Text>
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
        <div className="flex items-center px-3 py-1 bg-gray-50 rounded-md">
          <CalendarOutlined className="mr-2 text-blue-500" />
          <Text className="text-gray-600">{formatDate(text)}</Text>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <div className="text-right font-medium text-green-600">
          {formatPrice(amount)}
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
        return isPaid ? (
          <Tag
            color="success"
            className="px-3 py-1 rounded-md flex items-center"
          >
            <CheckCircleOutlined className="mr-1" />
            <span>Đã thanh toán</span>
          </Tag>
        ) : (
          <Tag
            color="warning"
            className="px-3 py-1 rounded-md flex items-center"
          >
            <ClockCircleOutlined className="mr-1" />
            <span>Chưa thanh toán</span>
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái đơn hàng",
      key: "orderStatus",
      render: (_, record) => {
        // Lấy trạng thái hiện tại từ record hoặc từ localStorage
        const orderStatusUpdates = JSON.parse(
          localStorage.getItem("orderStatusUpdates") || "{}"
        );

        const currentStatus =
          orderStatusUpdates[record.orderId] || record.orderStatus || "pending";

        // Kiểm tra trạng thái đơn hàng
        const isDelivered =
          currentStatus.toLowerCase() === "delivered" ||
          currentStatus.toLowerCase() === "completed";
        const isCancelled =
          currentStatus.toLowerCase() === "cancelled" ||
          currentStatus.toLowerCase() === "failed";

        return isDelivered ? (
          <Tag
            color="success"
            className="px-3 py-1 rounded-md flex items-center"
          >
            <CheckCircleOutlined className="mr-1" />
            <span>Đã thanh toán</span>
          </Tag>
        ) : isCancelled ? (
          <Tag color="error" className="px-3 py-1 rounded-md flex items-center">
            <CloseCircleOutlined className="mr-1" />
            <span>Đã hủy</span>
          </Tag>
        ) : (
          <div className="flex space-x-2">
            <Button
              type="default"
              size="small"
              onClick={() => updateOrderStatus(record.orderId, "delivered")}
              className="rounded-md text-xs border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 hover:border-green-300"
            >
              Đã thanh toán
            </Button>
            <Button
              type="default"
              size="small"
              onClick={() => updateOrderStatus(record.orderId, "cancelled")}
              className="rounded-md text-xs border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300"
            >
              Đã hủy
            </Button>
          </div>
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChartOutlined className="text-xl text-blue-600" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Tổng giao dịch
              </h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {paymentStats.total}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-auto">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <DollarOutlined className="text-xl text-green-600" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                Tổng doanh thu
              </h3>
              <div className="text-2xl font-bold text-green-600 mb-4">
                {formatPrice(paymentStats.totalAmount)}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-auto">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white mb-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-5">
              <div className="flex-1 min-w-[240px]">
                <label className="text-sm text-gray-500 font-medium mb-2 block">
                  Tìm kiếm
                </label>
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 py-2"
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
                  className="rounded-xl"
                  size="large"
                  suffixIcon={<FilterOutlined className="text-gray-400" />}
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
                  className="w-full rounded-xl"
                  format="DD/MM/YYYY"
                  size="large"
                  allowClear={true}
                  value={dateRange}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  dropdownClassName="rounded-xl shadow-xl"
                />
              </div>

              <div className="flex gap-2 items-end">
                <button
                  onClick={resetFilters}
                  className="h-10 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ReloadOutlined />
                  <span className="font-medium">Làm mới</span>
                </button>

                <button
                  onClick={() => {
                    resetAndUpdateOrderStatuses();
                    setTimeout(() => {
                      forceUpdateOrderStatusesInUI();
                    }, 1000);
                    message.info("Đang cập nhật lại trạng thái đơn hàng...");
                  }}
                  className="h-10 px-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ReloadOutlined />
                  <span className="font-medium">Cập nhật trạng thái</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white mb-6">
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
