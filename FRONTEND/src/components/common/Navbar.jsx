import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navigation = user ? {
    admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Menu', path: '/menu' },
      { name: 'Orders', path: '/orders' },
      { name: 'Reservations', path: '/reservations' },
      { name: 'Staff', path: '/staff' },
    ],
    staff: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Orders', path: '/orders' },
      { name: 'Reservations', path: '/reservations' },
    ],
    customer: [
      { name: 'Menu', path: '/menu' },
      { name: 'Orders', path: '/my-orders' },
      { name: 'Reservations', path: '/my-reservations' },
    ],
  } : null;

  const userNavigation = navigation ? navigation[user.role] || [] : [];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <ChefHat size={32} />
            <span>RestauroHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? userNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {item.name}
              </Link>
            )) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/login') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/signup') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="md:hidden border-t dark:border-gray-800">
            <div className="px-4 py-2 space-y-1">
              {user ? userNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {item.name}
                </Link>
              )) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/login') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/signup') ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 mt-4"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
