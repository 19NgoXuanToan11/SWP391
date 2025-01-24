import React from "react";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
  // Example order history (mock data)
  const orderHistory = [
    {
      orderId: "ORD12345",
      date: "2025-01-10",
      totalPrice: 150,
      items: [
        {
          name: "Natural Glow Lipstick",
          quantity: 2,
          price: 50,
        },
        {
          name: "Hydrating Face Cream",
          quantity: 1,
          price: 30,
        },
      ],
    },
    {
      orderId: "ORD12346",
      date: "2025-01-15",
      totalPrice: 90,
      items: [
        {
          name: "Volume Mascara",
          quantity: 3,
          price: 20,
        },
      ],
    },
  ];

  const handleCancelOrder = (orderId) => {
    // Handle cancel order logic (e.g., call API, show confirmation, etc.)
    alert(`Order ${orderId} has been cancelled.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/cart">
            <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeftOutlined className="mr-2" />
              Back to Cart
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingCartOutlined className="mr-2" />
            Order History
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {orderHistory.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCartOutlined className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">You have no past orders</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orderHistory.map((order) => (
                <li
                  key={order.orderId}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        Order ID: {order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">Date: {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="text-sm text-gray-500">
                          {item.name} x{item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Cancel Order Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Hủy Đơn Hàng
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
