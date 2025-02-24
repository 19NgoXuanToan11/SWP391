import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Input, Select, DatePicker } from "antd";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

const FilterControls = () => {
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="min-w-[180px]">
        <Select
          defaultValue="all"
          className="w-full h-12 rounded-lg hover:border-purple-300 focus:border-purple-500 
            transition-all duration-300 shadow-sm hover:shadow-md"
          onChange={(value) => setFilterStatus(value)}
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          date: "2024-02-24",
          total: 1250000,
          status: "completed",
          items: [
            { name: "Effaclar Gel", quantity: 1, price: 395000 },
            { name: "Bioderma Sebium", quantity: 2, price: 340000 },
          ],
        },
        {
          id: "ORD-002",
          date: "2024-02-23",
          total: 420000,
          status: "processing",
          items: [
            { name: "Normaderm Phytosolution", quantity: 1, price: 420000 },
          ],
        },
        // Thêm các đơn hàng khác...
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
            <div className="flex gap-4">
              <FilterControls />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-pink-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-2">
                          <ClockCircleOutlined />
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "completed" && "Hoàn thành"}
                          {order.status === "processing" && "Đang xử lý"}
                          {order.status === "cancelled" && "Đã hủy"}
                        </span>
                        {getStatusIcon(order.status)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingOutlined className="text-gray-400" />
                            <span>{item.name}</span>
                            <span className="text-gray-500">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Tổng tiền:
                      </span>
                      <span className="text-xl font-bold text-pink-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
