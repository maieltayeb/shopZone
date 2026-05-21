import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      {/* Main Container */}
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Background Elements */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-700"></div>
          </div>
          
          {/* 404 Text */}
          <div className="relative z-10">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>

        {/* Optional: Helpful Icons */}
        <div className="pt-8 flex justify-center gap-8 text-4xl opacity-30">
          <span>📦</span>
          <span>🛍️</span>
          <span>💳</span>
        </div>
      </div>
    </div>
  )
}
