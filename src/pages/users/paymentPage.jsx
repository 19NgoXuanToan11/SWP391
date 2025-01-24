import React, { useState } from "react";
import {
  CreditCardOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            Back to Cart
          </Link>
          <div className="flex items-center space-x-2">
            <LockOutlined className="text-green-500" />
            <span className="text-sm text-gray-600">Secure Checkout</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === "credit-card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-gray-900"
                  />
                  <span className="ml-3">
                    <span className="text-gray-900 font-medium">
                      Credit Card
                    </span>
                    <span className="text-gray-500 block text-sm">
                      Pay with Visa, Mastercard
                    </span>
                  </span>
                  <div className="ml-auto flex space-x-2">
                    <img src="/visa.svg" alt="Visa" className="h-8" />
                    <img
                      src="/mastercard.svg"
                      alt="Mastercard"
                      className="h-8"
                    />
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-gray-900"
                  />
                  <span className="ml-3">
                    <span className="text-gray-900 font-medium">PayPal</span>
                    <span className="text-gray-500 block text-sm">
                      Pay with your PayPal account
                    </span>
                  </span>
                  <img src="/paypal.svg" alt="PayPal" className="h-8 ml-auto" />
                </label>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                      <CreditCardOutlined className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC/CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Billing Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>$100.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$10.00</span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>$110.00</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium 
                                  hover:bg-transparent hover:text-black transition-all duration-300 
                                  hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Complete Purchase
              </button>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <LockOutlined className="mr-2" />
                Secure payment processing
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-center text-green-700">
                <CheckCircleOutlined className="text-xl mr-2" />
                <span className="font-medium">100% Money Back Guarantee</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                We offer a 30-day money-back guarantee for all purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
