import React, { useState } from "react";
import model from "../../assets/pictures/model.jpg";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Biểu mẫu đã được gửi:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-10">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg">
        {/* Phần hình ảnh bên trái */}
        <div className="w-full md:w-1/2">
          <img
            src={model}
            alt="Liên hệ với chúng tôi"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        {/* Phần biểu mẫu bên phải */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Liên hệ với chúng tôi
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-pink-500"
                placeholder="Tên của bạn"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-pink-500"
                placeholder="ban@example.com"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Tin nhắn
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-pink-500"
                placeholder="Tin nhắn của bạn"
                rows="4"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Liên hệ với chúng tôi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
