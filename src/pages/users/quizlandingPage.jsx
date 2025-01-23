import React, { useState } from "react";
import model from "../../assets/pictures/model.jpg";
import { Link } from "react-router-dom";

export function QuizLandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
      {/* Hexagonal Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 L15 0 L45 0 L60 30 L45 60 L15 60' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Facial Check
        </h1>

        <p className="max-w-xl text-gray-200 mb-8">
          True beauty shines from within, but the right skincare enhances that
          glow, helping you radiate confidence and embrace your natural
          brilliance.
        </p>

        <Link to="/quiz">
          <button className="px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Start
          </button>
        </Link>

        {/* Glowing Points */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-pink-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
