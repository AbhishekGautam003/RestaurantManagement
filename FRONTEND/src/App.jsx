import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Staff from './pages/Staff';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <Reservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <Reservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/staff"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Staff />
                  </ProtectedRoute>
                }
              />

              {/* Unauthorized page */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>

            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default App;
