import React from "react";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Badge, Tag, Timeline, Divider } from "antd";

const OrderHistoryPage = () => {
  // Dữ liệu lịch sử đơn hàng (dữ liệu mẫu)
  const orderHistory = [
    {
      orderId: "ORD12345",
      date: "2025-01-10",
      status: "Đã giao hàng",
      totalPrice: 1500000,
      paymentMethod: "Thanh toán khi nhận hàng",
      items: [
        {
          name: "Son Môi Tự Nhiên",
          quantity: 2,
          price: 500000,
          image: "https://example.com/lipstick.jpg"
        },
        {
          name: "Kem Dưỡng Ẩm",
          quantity: 1,
          price: 300000,
          image: "https://example.com/cream.jpg"
        },
      ],
    },
    {
      orderId: "ORD12346",
      date: "2025-01-15",
      status: "Đang giao hàng",
      totalPrice: 900000,
      paymentMethod: "Thẻ tín dụng",
      items: [
        {
          name: "Mascara Tăng Độ Dày",
          quantity: 3,
          price: 200000,
          image: "https://example.com/mascara.jpg"
        },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao hàng":
        return "success";
      case "Đang giao hàng":
        return "processing";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCancelOrder = (orderId) => {
    // Xử lý logic hủy đơn hàng (ví dụ: gọi API, hiển thị xác nhận, v.v.)
    alert(`Đơn hàng ${orderId} đã được hủy.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/cart">
            <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeftOutlined className="mr-2" />
              <span className="text-lg">Quay Lại Giỏ Hàng</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShoppingCartOutlined className="mr-3 text-pink-600" />
            Lịch Sử Đơn Hàng
          </h1>
        </div>

        {/* Danh sách đơn hàng */}
        <div className="space-y-6">
          {orderHistory.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <ShoppingCartOutlined className="text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            orderHistory.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Header đơn hàng */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Đơn hàng: {order.orderId}
                      </h3>
                      <p className="text-gray-500">
                        Ngày đặt: {new Date(order.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Badge.Ribbon
                      text={order.status}
                      color={getStatusColor(order.status)}
                    >
                      <div className="h-16 w-32"></div>
                    </Badge.Ribbon>
                  </div>
                </div>

                {/* Chi tiết đơn hàng */}
                <div className="p-6">
                  {/* Danh sách sản phẩm */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-gray-500">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer đơn hàng */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-gray-500 mb-1">
                        Phương thức thanh toán: {order.paymentMethod}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        Tổng tiền: {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="px-6 py-2.5 bg-red-400 text-white rounded-xl hover:bg-red-600 
                                transition-colors duration-300 font-medium"
                    >
                      Hủy Đơn Hàng
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
