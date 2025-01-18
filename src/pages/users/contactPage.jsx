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
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-10">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={model}
            alt="Contact Us"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-pink-500"
                placeholder="Your Name"
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
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-pink-500"
                placeholder="Your message"
                rows="4"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
