import React from "react";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const CartPage = () => {
  // Example cart items (mock data)
  const cartItems = [
    {
      id: 1,
      name: "Natural Glow Lipstick",
      description: "Long-lasting, moisturizing formula",
      price: 50,
      quantity: 2,
      image: "https://via.placeholder.com/100",
      color: "Rose Pink",
      brand: "Luxe Beauty",
    },
    {
      id: 2,
      name: "Hydrating Face Cream",
      description: "24-hour moisture protection",
      price: 30,
      quantity: 1,
      image: "https://via.placeholder.com/100",
      size: "50ml",
      brand: "Pure Skin",
    },
    {
      id: 3,
      name: "Volume Mascara",
      description: "Waterproof, lengthening formula",
      price: 20,
      quantity: 3,
      image: "https://via.placeholder.com/100",
      color: "Black",
      brand: "Eye Magic",
    },
  ];

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/product"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingCartOutlined className="mr-2" />
            Your Shopping Cart
            <span className="ml-2 text-sm text-gray-500">
              ({cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
              items)
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCartOutlined className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-800">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.description}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Brand: {item.brand}
                              </p>
                              {item.color && (
                                <p className="text-sm text-gray-500">
                                  Color: {item.color}
                                </p>
                              )}
                              {item.size && (
                                <p className="text-sm text-gray-500">
                                  Size: {item.size}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-2">
                              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                -
                              </button>
                              <span className="w-12 text-center">
                                {item.quantity}
                              </span>
                              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                +
                              </button>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors">
                                <HeartOutlined />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <DeleteOutlined />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <Link to="/payment">
                <button
                  className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium 
                                  hover:bg-transparent hover:text-black transition-all duration-300 
                                  hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
