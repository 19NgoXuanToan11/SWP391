import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CustomerOrderPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user");

  useEffect(() => {
    // Giả lập gọi API để lấy lịch sử đơn hàng
    setOrders([
      { id: 1, orderDate: "2024-01-20", total: "$100" },
      { id: 2, orderDate: "2024-01-22", total: "$150" },
    ]);
  }, [user]);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Order History of {user}
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-colors"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">
                  Order {order.id}
                </p>
                <p className="text-sm text-gray-500">{order.orderDate}</p>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {order.total}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerOrderPage;
