import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const filters = user.role === 'customer' ? { customerId: user._id } : {};
      const { data } = await ordersAPI.getAll(filters);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (search) {
      filtered = filtered.filter(
        (order) =>
          order._id.includes(search) ||
          order.customerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;

    try {
      await ordersAPI.deleteOrder(id);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Orders</h1>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  {user.role === 'admin' && (
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.role === 'admin' || user.role === 'staff' ? (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {formatDateTime(order.createdAt)}
                      </td>
                      {user.role === 'admin' && (
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
