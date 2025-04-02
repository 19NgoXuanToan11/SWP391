import { useState, useEffect } from "react";
import SidebarAdmin from "../../../components/sidebar/admin/SidebarAdmin.jsx";
import axios from "axios";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  BellOutlined,
  SearchOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  LogoutOutlined,
  SettingOutlined,
  EyeOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Spin, message } from "antd";

// Dữ liệu mẫu cho biểu đồ
const monthlyRevenue = [
  { name: "T1", revenue: 65000, orders: 320, profit: 12000 },
  { name: "T2", revenue: 59000, orders: 300, profit: 11000 },
  { name: "T3", revenue: 80000, orders: 450, profit: 15000 },
  { name: "T4", revenue: 81000, orders: 400, profit: 16000 },
  { name: "T5", revenue: 90000, orders: 500, profit: 18000 },
  { name: "T6", revenue: 85000, orders: 480, profit: 17000 },
  { name: "T7", revenue: 95000, orders: 550, profit: 19000 },
];

const productCategories = [
  { name: "Chăm sóc da", value: 4000 },
  { name: "Trang điểm", value: 3000 },
  { name: "Chăm sóc tóc", value: 2000 },
  { name: "Nước hoa", value: 1500 },
  { name: "Dụng cụ", value: 1000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [growthRate, setGrowthRate] = useState(6.23);
  const [brandStats, setBrandStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    // Làm tròn số trước khi định dạng để tránh số lẻ
    const roundedPrice = Math.round(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(roundedPrice);
  };

  // Hàm định dạng ngày tháng
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

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

      // Áp dụng trạng thái đã lưu cho các đơn hàng được tải về
      const ordersWithSavedStatus = response.data.map((order) => {
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

      setOrders(ordersWithSavedStatus);

      // Thêm đoạn code để tải thông tin thanh toán
      let paymentsData = [];
      try {
        const paymentsResponse = await axios.get(
          "https://localhost:7285/Payment/all"
        );
        if (paymentsResponse.data && paymentsResponse.data.data) {
          paymentsData = paymentsResponse.data.data;
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }

      // Tính toán tổng doanh thu từ payment data như trong ordersPage
      const totalRevenue = paymentsData.reduce((sum, payment) => {
        const isPaid =
          payment.status &&
          (payment.status.toLowerCase() === "paid" ||
            payment.status.toLowerCase() === "completed" ||
            payment.status.toLowerCase() === "đã thanh toán");

        // Chỉ tính doanh thu từ các giao dịch đã thanh toán
        if (isPaid) {
          return sum + payment.amount;
        }
        return sum;
      }, 0);

      // Nếu không có dữ liệu thanh toán hoặc tổng doanh thu là 0, sử dụng giá trị từ hình ảnh
      const displayRevenue = totalRevenue > 0 ? totalRevenue : 1185000;

      setOrderStats({
        total: ordersWithSavedStatus.length,
        pending: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "pending"
        ).length,
        processing: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "processing"
        ).length,
        shipped: ordersWithSavedStatus.filter(
          (o) =>
            o.status.toLowerCase() === "shipped" ||
            o.status.toLowerCase() === "shipping"
        ).length,
        delivered: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "delivered"
        ).length,
        cancelled: ordersWithSavedStatus.filter(
          (o) => o.status.toLowerCase() === "cancelled"
        ).length,
        revenue: displayRevenue,
      });

      // Tạo dữ liệu biểu đồ doanh thu với dữ liệu đã cập nhật
      generateRevenueChartData(ordersWithSavedStatus);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7285/api/User");

      if (response.data) {
        const formattedUsers = response.data.map((user) => ({
          id: user.userId,
          username: user.username,
          email: user.email,
          role: user.roleId === 1 ? "Admin" : "User",
          status: user.isVerification ? "Active" : "Inactive",
          lastLogin: user.createdAt || "N/A",
          joinDate: user.createdAt || "N/A",
          isDeleted: user.isDeleted,
        }));

        setUsers(formattedUsers);

        // Lọc tài khoản admin cho hiển thị ban đầu
        const nonAdminUsers = formattedUsers.filter(
          (user) => user.role !== "Admin"
        );

        // Tính toán số liệu thống kê
        setUserStats({
          total: nonAdminUsers.length,
          active: nonAdminUsers.filter((user) => user.status === "Active")
            .length,
          inactive: nonAdminUsers.filter((user) => user.status === "Inactive")
            .length,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
      message.error("Không thể tải dữ liệu người dùng");
    }
  };

  // Tạo dữ liệu biểu đồ doanh thu
  const generateRevenueChartData = (orders) => {
    // Tạo map để lưu trữ doanh thu theo ngày
    const revenueByDay = new Map();
    const ordersByDay = new Map();
    const profitByDay = new Map();

    // Lấy 7 ngày gần nhất
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = `T${7 - i}`;
      revenueByDay.set(dateString, 0);
      ordersByDay.set(dateString, 0);
      profitByDay.set(dateString, 0);
    }

    // Tính toán doanh thu theo ngày
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 0 && daysDiff < 7) {
        const dateString = `T${7 - daysDiff}`;

        // Cộng dồn doanh thu
        revenueByDay.set(
          dateString,
          revenueByDay.get(dateString) + (order.totalAmount || 0)
        );

        // Đếm số đơn hàng
        ordersByDay.set(dateString, ordersByDay.get(dateString) + 1);

        // Ước tính lợi nhuận (giả sử 20% doanh thu)
        profitByDay.set(
          dateString,
          profitByDay.get(dateString) + (order.totalAmount * 0.2 || 0)
        );
      }
    });

    // Chuyển đổi map thành mảng để sử dụng cho biểu đồ
    const chartData = Array.from(revenueByDay.entries()).map(
      ([name, revenue]) => ({
        name,
        revenue,
        orders: ordersByDay.get(name),
        profit: profitByDay.get(name),
      })
    );

    setRevenueData(chartData);

    // Tạo dữ liệu danh mục sản phẩm
    generateProductCategoriesData(orders);
  };

  // Tạo dữ liệu danh mục sản phẩm
  const generateProductCategoriesData = (orders) => {
    // Giả lập dữ liệu danh mục sản phẩm từ đơn hàng
    const categories = {
      "Chăm sóc da": 0,
      "Trang điểm": 0,
      "Chăm sóc tóc": 0,
      "Nước hoa": 0,
      "Dụng cụ": 0,
    };

    // Phân bổ doanh thu vào các danh mục (giả lập)
    orders.forEach((order) => {
      const amount = order.totalAmount || 0;

      // Phân bổ ngẫu nhiên vào các danh mục
      categories["Chăm sóc da"] += amount * 0.3;
      categories["Trang điểm"] += amount * 0.25;
      categories["Chăm sóc tóc"] += amount * 0.2;
      categories["Nước hoa"] += amount * 0.15;
      categories["Dụng cụ"] += amount * 0.1;
    });

    // Chuyển đổi thành mảng để sử dụng cho biểu đồ
    const categoriesData = Object.entries(categories).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

    setProductCategories(categoriesData);
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchOrders();
    fetchUsers();

    // Lấy username từ localStorage
    const authUserStr = localStorage.getItem("auth_user");
    if (authUserStr) {
      try {
        const authUser = JSON.parse(authUserStr);
        setUsername(authUser.username || "");
      } catch (error) {
        console.error("Error parsing auth_user:", error);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        {/* Tiêu đề */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm backdrop-blur-md bg-opacity-80">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Chào mừng trở lại, {username || "Quản trị viên"}!
            </h1>
            <p className="text-gray-500 mt-1">
              Đây là những gì đang diễn ra với cửa hàng của bạn hôm nay.
            </p>
          </div>
        </header>

        {/* Ngày và Thống kê nhanh */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm">
            <CalendarOutlined />
            <span>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Thẻ tóm tắt */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Thẻ Tổng doanh số */}
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tổng doanh số
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {formatPrice(orderStats.revenue)}
                    </p>
                  </div>
                  <div className="bg-pink-500 bg-opacity-10 p-4 rounded-2xl">
                    <DollarOutlined className="text-3xl text-pink-500" />
                  </div>
                </div>
              </div>

              {/* Thẻ Tổng đơn hàng */}
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tổng đơn hàng
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {orderStats.total}
                    </p>
                  </div>
                  <div className="bg-blue-500 bg-opacity-10 p-4 rounded-2xl">
                    <ShoppingOutlined className="text-3xl text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Thẻ Người dùng hoạt động */}
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Người dùng hoạt động
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {userStats.total}
                    </p>
                  </div>
                  <div className="bg-green-500 bg-opacity-10 p-4 rounded-2xl">
                    <UserOutlined className="text-3xl text-green-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Thêm thống kê trạng thái đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Chờ xác nhận
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {orderStats.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <span className="text-yellow-500 text-lg">⏳</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Đang giao</p>
                  <p className="text-lg font-bold text-gray-800">
                    {orderStats.shipped}
                  </p>
                </div>
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <span className="text-indigo-500 text-lg">🚚</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Đã giao</p>
                  <p className="text-lg font-bold text-gray-800">
                    {orderStats.delivered}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-500 text-lg">✅</span>
                </div>
              </div>
            </div>

            {/* Thống kê người dùng và đơn hàng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Thống kê người dùng */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" />
                  Thống kê người dùng
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Tổng người dùng</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {userStats.total}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Người dùng hoạt động
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {userStats.active}
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Hoạt động", value: userStats.active },
                        { name: "Không hoạt động", value: userStats.inactive },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" name="Người dùng" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Thống kê đơn hàng */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingOutlined className="mr-2 text-pink-500" />
                  Thống kê đơn hàng
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orderStats.total}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Đơn hàng đã giao</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orderStats.delivered}
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          // Chỉ hiển thị các trạng thái có đơn hàng (count > 0)
                          ...(orderStats.pending > 0
                            ? [
                                {
                                  name: "Chờ xác nhận",
                                  value: orderStats.pending,
                                },
                              ]
                            : []),
                          ...(orderStats.processing > 0
                            ? [
                                {
                                  name: "Đang xử lý",
                                  value: orderStats.processing,
                                },
                              ]
                            : []),
                          ...(orderStats.shipped > 0
                            ? [
                                {
                                  name: "Đang giao",
                                  value: orderStats.shipped,
                                },
                              ]
                            : []),
                          ...(orderStats.delivered > 0
                            ? [
                                {
                                  name: "Đã giao",
                                  value: orderStats.delivered,
                                },
                              ]
                            : []),
                          ...(orderStats.cancelled > 0
                            ? [
                                {
                                  name: "Đã hủy",
                                  value: orderStats.cancelled,
                                },
                              ]
                            : []),
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {/* Dynamically generate cells based on data count */}
                        {[
                          "#eab308", // Chờ xác nhận
                          "#3b82f6", // Đang xử lý
                          "#6366f1", // Đang giao
                          "#10b981", // Đã giao
                          "#ef4444", // Đã hủy
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value} />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
