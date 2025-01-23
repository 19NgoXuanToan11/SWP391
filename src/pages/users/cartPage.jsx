import React from "react";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";

const CartPage = () => {
  // Example cart items (mock data)
  const cartItems = [
    { id: 1, name: "Product 1", price: 50, quantity: 2 },
    { id: 2, name: "Product 2", price: 30, quantity: 1 },
    { id: 3, name: "Product 3", price: 20, quantity: 3 },
  ];

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
        <ShoppingCartOutlined />
        Your Cart
      </h1>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-gray-500 text-sm">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button className="text-red-500 hover:text-red-700 transition">
                    <DeleteOutlined />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600">Total Items:</p>
          <p>{cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
        </div>
        <div className="flex justify-between mb-6">
          <p className="text-gray-600">Total Price:</p>
          <p className="font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <button className="w-full bg-pink-500 text-white py-2.5 rounded-lg shadow-md hover:bg-pink-600 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
