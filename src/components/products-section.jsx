import { useState } from "react";
import { motion } from "framer-motion";
import ritualCollection from "../assets/pictures/ritual_collection.jpg";
import recoveryCollection from "../assets/pictures/recovery_collection.jpg";

export function ProductsSection() {
  const [activeTab, setActiveTab] = useState("skincare");

  return (
    <section className="relative min-h-screen">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Discover Your{" "}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Beauty
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Explore our curated collection of premium beauty products designed
            to enhance your natural radiance
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-xl rounded-3xl p-2.5 shadow-lg border border-white/20">
            {["skincare", "makeup", "body", "hair"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-4 rounded-2xl text-sm font-medium transition-all duration-500 ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-lg ring-1 ring-pink-200/50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/30"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-purple-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={ritualCollection}
              alt="Skincare Ritual"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                Morning Ritual Collection
              </h3>
              <p className="text-white/90 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                Start your day with our carefully curated morning skincare
                routine
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={recoveryCollection}
              alt="Night Routine"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                Night Recovery Collection
              </h3>
              <p className="text-white/90 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                Rejuvenate your skin while you sleep with our night care
                essentials
              </p>
            </div>
          </motion.div>
        </div>

        {/* Beauty Tips Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "✨",
                title: "Personalized Routine",
                description:
                  "Get a customized skincare routine based on your skin type and concerns",
              },
              {
                icon: "🌿",
                title: "Natural Ingredients",
                description:
                  "Clean beauty products made with carefully selected natural ingredients",
              },
              {
                icon: "🔬",
                title: "Dermatologist Tested",
                description:
                  "All products are tested and approved by certified dermatologists",
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-shadow duration-300"
          >
            Explore All Collections
          </motion.button>
        </div>
      </div>
    </section>
  );
}
