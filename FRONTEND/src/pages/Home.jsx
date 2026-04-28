import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat size={64} className="text-white" />
            <h1 className="text-5xl font-bold text-white">RestauroHub</h1>
          </div>
          <p className="text-xl text-white/90 mb-8">Restaurant Management System</p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Streamline your restaurant operations with our comprehensive management platform.
            Manage menus, orders, reservations, and staff all in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            <LogIn size={20} />
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            <UserPlus size={20} />
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}