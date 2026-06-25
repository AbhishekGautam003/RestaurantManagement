import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ShoppingCart, Users, Calendar, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [statsRes, salesRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getSalesData('week'),
      ]);

      setStats(statsRes.data.data || statsRes.data);
      setSalesData(salesRes.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (user?.role === 'customer') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchDashboardData({ silent: true });
    }, 15000);

    const handleWindowFocus = () => {
      fetchDashboardData({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData({ silent: true });
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user.role === 'customer') {
    return <CustomerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome back, {user.name}!
        </h1>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-gray-600 dark:text-gray-300">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}`
              : 'Loading dashboard data...'}
          </div>
          <div className="flex items-center gap-3">
            {refreshing && (
              <span className="text-blue-600 dark:text-blue-400">Refreshing...</span>
            )}
            <button
              onClick={() => fetchDashboardData({ silent: true })}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:shadow-lg"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: IndianRupee,
              label: 'Total Sales',
              value: formatCurrency(stats?.totalSales || 0),
              color: 'bg-green-100 dark:bg-green-900/30 text-green-600',
            },
            {
              icon: ShoppingCart,
              label: 'Orders',
              value: stats?.totalOrders || 0,
              color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
            },
            {
              icon: Calendar,
              label: 'Reservations',
              value: stats?.totalReservations || 0,
              color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
            },
            {
              icon: Users,
              label: 'Customers',
              value: stats?.totalCustomers || 0,
              color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sales This Week
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Orders Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.ordersByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Dishes */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Dishes This Month
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Dish Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {(stats?.topDishes || []).map((dish, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{dish.name}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {dish.orders}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {formatCurrency(dish.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-400">View your order history</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reservations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your table reservations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
