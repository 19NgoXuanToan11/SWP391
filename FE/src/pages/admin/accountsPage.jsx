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
} from "antd";
import SidebarAdmin from "../../components/SidebarAdmin.jsx";
import axios from "axios";
import { motion } from "framer-motion";

const { Option } = Select;
const { TabPane } = Tabs;

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

  // Fetch users from API
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
          setFilteredUsers(formattedUsers);

          // Tính toán số liệu thống kê
          setTotalUsers(formattedUsers.length);
          setActiveUsers(
            formattedUsers.filter((user) => user.status === "Active").length
          );
          setInactiveUsers(
            formattedUsers.filter((user) => user.status === "Inactive").length
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and active tab
  useEffect(() => {
    let filtered = [...users];

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter((user) => user.status === "Active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((user) => user.status === "Inactive");
    } else if (activeTab === "admin") {
      filtered = filtered.filter((user) => user.role === "Admin");
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, activeTab]);

  // Handle user edit
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

  // Handle user delete
  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          // Implement API call to delete user
          // await axios.delete(`https://localhost:7285/api/User/${userId}`);

          // For now, just update the UI
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          message.success("User deleted successfully");
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete user");
        }
      },
    });
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      if (editingUser) {
        // Implement API call to update user
        // await axios.put(`https://localhost:7285/api/User/${editingUser.id}`, values);

        // For now, just update the UI
        const updatedUsers = users.map((user) => {
          if (user.id === editingUser.id) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedUsers);
        message.success("User updated successfully");
      } else {
        // Implement API call to create user
        // const response = await axios.post("https://localhost:7285/api/User", values);

        // For now, just update the UI
        const newUser = {
          id: Date.now(), // Temporary ID
          avatar: `https://ui-avatars.com/api/?name=${values.username}`,
          ...values,
          lastLogin: "N/A",
          joinDate: new Date().toISOString(),
        };
        setUsers([...users, newUser]);
        message.success("User created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Failed to save user");
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      message.warning("Please select at least one user");
      return;
    }

    if (action === "delete") {
      Modal.confirm({
        title: `Are you sure you want to delete ${selectedRows.length} selected users?`,
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            // Implement API call to delete users
            // await Promise.all(selectedRows.map(id => axios.delete(`https://localhost:7285/api/User/${id}`)));

            // For now, just update the UI
            const updatedUsers = users.filter(
              (user) => !selectedRows.includes(user.id)
            );
            setUsers(updatedUsers);
            setSelectedRows([]);
            message.success(
              `${selectedRows.length} users deleted successfully`
            );
          } catch (error) {
            console.error("Error deleting users:", error);
            message.error("Failed to delete users");
          }
        },
      });
    } else if (action === "activate") {
      // Implement activate logic
      const updatedUsers = users.map((user) => {
        if (selectedRows.includes(user.id)) {
          return { ...user, status: "Active" };
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedRows([]);
      message.success(`${selectedRows.length} users activated successfully`);
    } else if (action === "deactivate") {
      // Implement deactivate logic
      const updatedUsers = users.map((user) => {
        if (selectedRows.includes(user.id)) {
          return { ...user, status: "Inactive" };
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedRows([]);
      message.success(`${selectedRows.length} users deactivated successfully`);
    }
  };

  // Toggle row selection
  const toggleRowSelection = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  // Toggle all rows selection
  const toggleAllRows = () => {
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map((user) => user.id));
    }
  };

  // Dropdown menu for more actions
  const moreActionsMenu = (user) => [
    {
      key: "view",
      label: (
        <div className="flex items-center space-x-2 px-4 py-2">
          <EyeOutlined />
          <span>View Details</span>
        </div>
      ),
    },
    {
      key: "edit",
      label: (
        <div
          className="flex items-center space-x-2 px-4 py-2"
          onClick={() => handleEdit(user)}
        >
          <EditOutlined />
          <span>Edit User</span>
        </div>
      ),
    },
    {
      key: "delete",
      label: (
        <div
          className="flex items-center space-x-2 px-4 py-2 text-red-500"
          onClick={() => handleDelete(user.id)}
        >
          <DeleteOutlined />
          <span>Delete User</span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Accounts
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your system users and their permissions
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md"
              onClick={handleAddUser}
            >
              <UserAddOutlined />
              <span>Add New User</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                <p className="text-xs text-gray-400 mt-1">
                  All registered accounts
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-md">
                <TeamOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
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
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-3xl font-bold text-gray-800">
                  {activeUsers}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((activeUsers / totalUsers) * 100)}% of total users
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
                  width: `${Math.round((activeUsers / totalUsers) * 100)}%`,
                }}
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
                <p className="text-sm text-gray-500">Inactive Users</p>
                <p className="text-3xl font-bold text-gray-800">
                  {inactiveUsers}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((inactiveUsers / totalUsers) * 100)}% of total
                  users
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                <CloseCircleOutlined className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{
                  width: `${Math.round((inactiveUsers / totalUsers) * 100)}%`,
                }}
              ></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Bar */}
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
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
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
                        <span>All Users</span>
                      </div>
                    </Option>
                    <Option value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircleOutlined className="text-green-500" />
                        <span>Active Users</span>
                      </div>
                    </Option>
                    <Option value="inactive">
                      <div className="flex items-center gap-2">
                        <CloseCircleOutlined className="text-red-500" />
                        <span>Inactive Users</span>
                      </div>
                    </Option>
                    <Option value="admin">
                      <div className="flex items-center gap-2">
                        <SettingOutlined className="text-purple-500" />
                        <span>Admins</span>
                      </div>
                    </Option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedRows.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    {selectedRows.length} selected
                  </span>
                  <button
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => handleBulkAction("activate")}
                  >
                    <CheckCircleOutlined />
                  </button>
                  <button
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    onClick={() => handleBulkAction("deactivate")}
                  >
                    <CloseCircleOutlined />
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <DeleteOutlined />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-pink-500 focus:ring-pink-500 mr-2"
                          checked={
                            selectedRows.length === filteredUsers.length &&
                            filteredUsers.length > 0
                          }
                          onChange={toggleAllRows}
                        />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedRows.includes(user.id) ? "bg-pink-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            className="rounded text-pink-500 focus:ring-pink-500"
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
                            <UserOutlined className="mr-2 text-gray-400" />
                            {user.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Tag
                          color={user.role === "Admin" ? "purple" : "blue"}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {user.role}
                        </Tag>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          status={
                            user.status === "Active" ? "success" : "error"
                          }
                          text={
                            <span className="text-sm font-medium">
                              {user.status}
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
                          <Tooltip title="Edit">
                            <button
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                              onClick={() => handleEdit(user)}
                            >
                              <EditOutlined />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
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
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
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
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              Showing 1 to {filteredUsers.length} of {totalUsers} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Form Modal */}
      <Modal
        title={
          <div className="text-xl font-bold">
            {editingUser ? "Edit User" : "Add New User"}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="user-modal"
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter username"
                className="rounded-lg py-2"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter email"
                className="rounded-lg py-2"
              />
            </Form.Item>
          </div>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                placeholder="Enter password"
                className="rounded-lg py-2"
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select placeholder="Select role" className="rounded-lg">
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status" className="rounded-lg">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="address" label="Address">
            <Input
              placeholder="Enter address (optional)"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <button
              type="button"
              className="mr-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              {editingUser ? "Update" : "Create"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountsPage;
