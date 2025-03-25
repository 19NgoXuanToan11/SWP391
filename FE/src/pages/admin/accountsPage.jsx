import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  LoadingOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
  EyeOutlined,
  SettingOutlined,
  BarsOutlined,
  AppstoreOutlined,
  LockOutlined,
  UnlockOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  message,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  Badge,
  Avatar,
  Dropdown,
  Tag,
  Tabs,
  Empty,
  Switch,
} from "antd";
import SidebarAdmin from "../../components/SidebarAdmin.jsx";
import axios from "axios";
import { motion } from "framer-motion";

const { Option } = Select;
const { TabPane } = Tabs;
const { Password } = Input;

const AccountsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table or grid

  // Lấy dữ liệu người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7285/api/User");

        // Kiểm tra nếu response có dữ liệu
        if (response.data) {
          // Chuyển đổi dữ liệu từ API để phù hợp với cấu trúc hiển thị
          const formattedUsers = response.data.map((user) => ({
            id: user.userId,
            avatar:
              user.avatar ||
              "https://ui-avatars.com/api/?name=" + user.username,
            username: user.username,
            email: user.email,
            role: user.roleId === 1 ? "Admin" : "User",
            status: user.isVerification ? "Active" : "Inactive",
            lastLogin: user.createdAt || "N/A",
            joinDate: user.createdAt || "N/A",
            isDeleted: user.isDeleted,
            address: user.address || "N/A",
          }));

          setUsers(formattedUsers);

          // Lọc tài khoản admin cho hiển thị ban đầu
          const nonAdminUsers = formattedUsers.filter(
            (user) => user.role !== "Admin"
          );
          setFilteredUsers(nonAdminUsers);

          // Tính toán số liệu thống kê (không bao gồm admin vì lý do bảo mật)
          setTotalUsers(nonAdminUsers.length);
          setActiveUsers(
            nonAdminUsers.filter((user) => user.status === "Active").length
          );
          setInactiveUsers(
            nonAdminUsers.filter((user) => user.status === "Inactive").length
          );
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
        message.error(
          "Không thể tải dữ liệu người dùng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Lọc người dùng dựa trên từ khóa tìm kiếm và tab đang hoạt động
  useEffect(() => {
    let filtered = [...users];

    // Đầu tiên lọc tài khoản admin trừ khi đang xem tab admin
    if (activeTab !== "admin") {
      filtered = filtered.filter((user) => user.role !== "Admin");
    }

    // Sau đó áp dụng các bộ lọc khác
    if (activeTab === "active") {
      filtered = filtered.filter((user) => user.status === "Active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((user) => user.status === "Inactive");
    } else if (activeTab === "admin") {
      filtered = filtered.filter((user) => user.role === "Admin");
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, activeTab]);

  // Xử lý chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      address: user.address,
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa người dùng
  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này không?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Thực hiện gọi API để xóa người dùng
          // await axios.delete(`https://localhost:7285/api/User/${userId}`);

          // Tạm thời, chỉ cập nhật giao diện
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          message.success("Xóa người dùng thành công");
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error);
          message.error("Không thể xóa người dùng");
        }
      },
    });
  };

  // Xử lý gửi biểu mẫu
  const handleFormSubmit = async (values) => {
    try {
      if (editingUser) {
        // Thực hiện gọi API để cập nhật người dùng
        // await axios.put(`https://localhost:7285/api/User/${editingUser.id}`, values);

        // Tạm thời, chỉ cập nhật giao diện
        const updatedUsers = users.map((user) => {
          if (user.id === editingUser.id) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedUsers);
        message.success("Cập nhật người dùng thành công");
      } else {
        // Thực hiện gọi API để tạo người dùng
        // const response = await axios.post("https://localhost:7285/api/User", values);

        // Tạm thời, chỉ cập nhật giao diện
        const newUser = {
          id: Date.now(), // ID tạm thời
          avatar: `https://ui-avatars.com/api/?name=${values.username}`,
          ...values,
          lastLogin: "N/A",
          joinDate: new Date().toISOString(),
        };
        setUsers([...users, newUser]);
        message.success("Tạo người dùng mới thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      message.error("Không thể lưu người dùng");
    }
  };

  // Xử lý khi nhấn nút thêm người dùng
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: "User", status: "Active" });
    setIsModalVisible(true);
  };

  // Xử lý hành động hàng loạt
  const handleBulkAction = (actionType) => {
    if (selectedRows.length === 0) return;

    const actionMap = {
      activate: {
        title: "Kích hoạt người dùng",
        content: `Bạn có chắc chắn muốn kích hoạt ${selectedRows.length} người dùng không?`,
        success: "Kích hoạt người dùng thành công",
        error: "Không thể kích hoạt người dùng",
        perform: (user) => ({ ...user, status: "Active" }),
      },
      deactivate: {
        title: "Vô hiệu hóa người dùng",
        content: `Bạn có chắc chắn muốn vô hiệu hóa ${selectedRows.length} người dùng không?`,
        success: "Vô hiệu hóa người dùng thành công",
        error: "Không thể vô hiệu hóa người dùng",
        perform: (user) => ({ ...user, status: "Inactive" }),
      },
      delete: {
        title: "Xóa người dùng",
        content: `Bạn có chắc chắn muốn xóa ${selectedRows.length} người dùng không? Hành động này không thể hoàn tác.`,
        success: "Xóa người dùng thành công",
        error: "Không thể xóa người dùng",
        perform: null, // Trường hợp đặc biệt cho xóa
      },
    };

    const { title, content, success, error, perform } = actionMap[actionType];

    Modal.confirm({
      title,
      content,
      okText: "Đồng ý",
      okType: actionType === "delete" ? "danger" : "primary",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (actionType === "delete") {
            // Đối với xóa, lọc ra các người dùng đã chọn
            const updatedUsers = users.filter(
              (user) => !selectedRows.includes(user.id)
            );
            setUsers(updatedUsers);
          } else {
            // Đối với các hành động khác, cập nhật người dùng
            const updatedUsers = users.map((user) => {
              if (selectedRows.includes(user.id)) {
                return perform(user);
              }
              return user;
            });
            setUsers(updatedUsers);
          }
          setSelectedRows([]);
          message.success(success);
        } catch (err) {
          console.error(
            `Lỗi khi thực hiện hành động hàng loạt ${actionType}:`,
            err
          );
          message.error(error);
        }
      },
    });
  };

  // Chuyển đổi lựa chọn hàng
  const toggleRowSelection = (userId) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Chuyển đổi lựa chọn tất cả hàng
  const toggleAllRows = () => {
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map((user) => user.id));
    }
  };

  // Menu hành động khác
  const moreActionsMenu = (user) => [
    {
      key: "1",
      label: (
        <div
          className="flex items-center space-x-2 px-3 py-2"
          onClick={() => handleEdit(user)}
        >
          <EditOutlined className="text-blue-500" />
          <span>Chỉnh sửa người dùng</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="flex items-center space-x-2 px-3 py-2"
          onClick={() => {
            // Thực hiện xem chi tiết người dùng
            message.info(`Xem chi tiết cho ${user.username}`);
          }}
        >
          <EyeOutlined className="text-green-500" />
          <span>Xem chi tiết</span>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="flex items-center space-x-2 px-3 py-2"
          onClick={() => {
            // Thực hiện đặt lại mật khẩu
            message.info(`Đặt lại mật khẩu cho ${user.username}`);
          }}
        >
          <LockOutlined className="text-orange-500" />
          <span>Đặt lại mật khẩu</span>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div
          className="flex items-center space-x-2 px-3 py-2"
          onClick={() => handleDelete(user.id)}
        >
          <DeleteOutlined className="text-red-500" />
          <span>Xóa người dùng</span>
        </div>
      ),
    },
  ];

  // Lấy màu ngẫu nhiên cho nền avatar người dùng
  const getUserColor = (userId) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[userId % colors.length];
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Tiêu đề với gradient hoạt ảnh */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">
              Quản Lý Người Dùng
            </h1>
            <p className="text-white text-opacity-80 mt-2 max-w-2xl">
              Quản lý tài khoản người dùng, quyền hạn và quyền truy cập vào ứng
              dụng của bạn
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
        </motion.div>

        {/* Thẻ thống kê */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white p-6 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng số người dùng</p>
                <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tất cả tài khoản đã đăng ký
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                <TeamOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white p-6 rounded-2xl shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Người dùng đang hoạt động
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {activeUsers}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((activeUsers / totalUsers) * 100) || 0}% trong
                  tổng số người dùng
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-md">
                <CheckCircleOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    Math.round((activeUsers / totalUsers) * 100) || 0
                  }%`,
                }}
              ></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Thanh hành động */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-sm mb-6"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="inline-block">
                  <Select
                    className="min-w-[180px] rounded-xl filter-select"
                    suffixIcon={<FilterOutlined className="text-gray-400" />}
                    onChange={(value) => setActiveTab(value)}
                    value={activeTab}
                    dropdownStyle={{ borderRadius: "12px" }}
                    bordered={false}
                    style={{
                      background: "#f9fafb",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      borderRadius: "12px",
                      padding: "2px 8px",
                    }}
                  >
                    <Option value="all">
                      <div className="flex items-center gap-2">
                        <TeamOutlined className="text-blue-500" />
                        <span>Tất cả người dùng</span>
                      </div>
                    </Option>
                    <Option value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>Người dùng đang hoạt động</span>
                      </div>
                    </Option>
                    <Option value="inactive">
                      <div className="flex items-center gap-2">
                        <CloseCircleOutlined className="text-red-500" />
                        <span>Người dùng không hoạt động</span>
                      </div>
                    </Option>
                    <Option value="admin">
                      <div className="flex items-center gap-2">
                        <SettingOutlined className="text-purple-500" />
                        <span>Quản trị viên</span>
                      </div>
                    </Option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  className={`p-2 rounded-lg ${
                    viewMode === "table"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <BarsOutlined />
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <AppstoreOutlined />
                </button>
              </div>

              {selectedRows.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    Đã chọn {selectedRows.length}
                  </span>
                  <Tooltip title="Kích hoạt người dùng">
                    <button
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      onClick={() => handleBulkAction("activate")}
                    >
                      <CheckCircleOutlined />
                    </button>
                  </Tooltip>
                  <Tooltip title="Vô hiệu hóa người dùng">
                    <button
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => handleBulkAction("deactivate")}
                    >
                      <CloseCircleOutlined />
                    </button>
                  </Tooltip>
                  <Tooltip title="Xóa người dùng">
                    <button
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              ) : (
                <button
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all shadow-md"
                  onClick={handleAddUser}
                >
                  <UserAddOutlined />
                  <span>Thêm người dùng</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Nội dung người dùng */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <span className="ml-2">Đang tải người dùng...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <Empty
                description={
                  <span className="text-gray-500">
                    Không tìm thấy người dùng nào. Hãy điều chỉnh tìm kiếm hoặc
                    tạo người dùng mới.
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <button
                className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                onClick={handleAddUser}
              >
                <UserAddOutlined className="mr-2" />
                Tạo người dùng mới
              </button>
            </div>
          ) : viewMode === "table" ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-purple-500 focus:ring-purple-500 mr-2"
                            checked={
                              selectedRows.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={toggleAllRows}
                          />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Người dùng
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedRows.includes(user.id) ? "bg-purple-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              className="rounded text-purple-500 focus:ring-purple-500"
                              checked={selectedRows.includes(user.id)}
                              onChange={() => toggleRowSelection(user.id)}
                            />
                            <Avatar
                              src={user.avatar}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${user.username}`;
                              }}
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="flex items-center text-gray-900">
                              <MailOutlined className="mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <HomeOutlined className="mr-2 text-gray-400" />
                              {user.address}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Tag
                            color={user.role === "Admin" ? "purple" : "blue"}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {user.role === "Admin"
                              ? "Quản trị viên"
                              : "Người dùng"}
                          </Tag>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            status={
                              user.status === "Active" ? "success" : "error"
                            }
                            text={
                              <span className="text-sm font-medium">
                                {user.status === "Active"
                                  ? "Hoạt động"
                                  : "Không hoạt động"}
                              </span>
                            }
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarOutlined className="mr-2 text-gray-400" />
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-3">
                            <Tooltip title="Chỉnh sửa">
                              <button
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                onClick={() => handleEdit(user)}
                              >
                                <EditOutlined />
                              </button>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <button
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                onClick={() => handleDelete(user.id)}
                              >
                                <DeleteOutlined />
                              </button>
                            </Tooltip>
                            <Dropdown
                              menu={{ items: moreActionsMenu(user) }}
                              placement="bottomRight"
                              trigger={["click"]}
                            >
                              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
                                <MoreOutlined />
                              </button>
                            </Dropdown>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Hiển thị {filteredUsers.length} trong tổng số {totalUsers}{" "}
                  người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    Trước
                  </button>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    Tiếp
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Chế độ xem lưới
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`bg-white rounded-2xl shadow-sm p-6 transition-all ${
                    selectedRows.includes(user.id)
                      ? "ring-2 ring-purple-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-purple-500 focus:ring-purple-500 mr-3"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                      />
                      <div className="relative">
                        <Avatar
                          src={user.avatar}
                          alt={user.username}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${user.username}`;
                          }}
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                            user.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } border-2 border-white`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Tooltip title="Chỉnh sửa">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleEdit(user)}
                        >
                          <EditOutlined />
                        </button>
                      </Tooltip>
                      <Dropdown
                        menu={{ items: moreActionsMenu(user) }}
                        placement="bottomRight"
                        trigger={["click"]}
                      >
                        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreOutlined />
                        </button>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {user.username}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MailOutlined className="mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <HomeOutlined className="mr-2 text-gray-400" />
                      {user.address}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Tag
                      color={user.role === "Admin" ? "purple" : "blue"}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {user.role === "Admin" ? "Quản trị viên" : "Người dùng"}
                    </Tag>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarOutlined className="mr-1" />
                      Tham gia {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Modal biểu mẫu người dùng */}
        <Modal
          title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
          className="user-modal"
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              role: "User",
              status: "Active",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="username"
                label="Tên người dùng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người dùng" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập tên người dùng"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Nhập email"
                  className="rounded-xl"
                />
              </Form.Item>
            </div>

            {!editingUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: !editingUser,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: !editingUser,
                      message: "Vui lòng xác nhận mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp"));
                      },
                    }),
                  ]}
                >
                  <Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>
            )}

            <Form.Item name="address" label="Địa chỉ">
              <Input
                prefix={<HomeOutlined className="text-gray-400" />}
                placeholder="Nhập địa chỉ"
                className="rounded-xl"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="role" label="Vai trò">
                <Select className="rounded-xl">
                  <Option value="User">Người dùng</Option>
                  <Option value="Admin">Quản trị viên</Option>
                </Select>
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select className="rounded-xl">
                  <Option value="Active">Hoạt động</Option>
                  <Option value="Inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setIsModalVisible(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
              >
                {editingUser ? "Cập nhật người dùng" : "Tạo người dùng"}
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AccountsPage;
