import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log environment info
    const info = `API URL: ${import.meta.env.VITE_API_URL || 'default'}`;
    setDebugInfo(info);
    console.log(info);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Login attempt:', { email, hasPassword: !!password });
      
      // Make login request
      const response = await authAPI.login({ email, password });
      console.log('Login response received:', response);
      
      const { data } = response;
      
      // Validate response
      if (!data) {
        throw new Error('No data in response');
      }

      if (!data.token) {
        throw new Error('No token in response');
      }

      if (!data.user) {
        throw new Error('No user in response');
      }

      console.log('Login data valid, storing credentials');
      
      // Store credentials
      login(data.user, data.token);
      
      console.log('Credentials stored, user role:', data.user.role);
      toast.success('Login successful!');
      
      // Redirect based on role
      const dashboardPaths = {
        admin: '/dashboard',
        staff: '/dashboard',
        customer: '/menu',
      };
      
      const redirectPath = dashboardPaths[data.user.role] || '/dashboard';
      console.log('Redirecting to:', redirectPath);
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        url: error.config?.url,
      });

      const errorMsg = 
        error.response?.data?.message || 
        error.message || 
        'Login failed - please try again';
        
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ChefHat size={48} className="text-primary" />
              <h1 className="text-3xl font-bold text-primary">RestauroHub</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Restaurant Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-blue-600"
            >
              <LogIn size={20} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up here
            </Link>
          </p>

          {/* Demo credentials info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <p><strong>Admin:</strong> admin@example.com / password123</p>
              <p><strong>Staff:</strong> staff@example.com / password123</p>
              <p><strong>Customer:</strong> customer@example.com / password123</p>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
              <p>Debug: {debugInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
