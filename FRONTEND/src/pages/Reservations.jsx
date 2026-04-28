import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reservationsAPI } from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import ReservationForm from '../components/reservations/ReservationForm';

const RESERVATION_STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled'];

export default function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReservations = async () => {
    try {
      const filters = user.role === 'customer' ? { customerId: user._id } : {};
      const { data } = await reservationsAPI.getAll(filters);
      setReservations(data);
    } catch (error) {
      toast.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (search) {
      filtered = filtered.filter(
        (res) =>
          res.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          res.customerEmail?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await reservationsAPI.updateStatus(id, newStatus);
      toast.success('Reservation status updated');
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update reservation status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await reservationsAPI.deleteReservation(id);
      toast.success('Reservation cancelled');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingReservation(null);
    fetchReservations();
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservations</h1>
          {(user.role === 'customer' || user.role === 'admin' || user.role === 'staff') && (
            <button
              onClick={() => {
                setEditingReservation(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:shadow-lg"
            >
              <Plus size={20} />
              Add Reservation
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              />
            </div>

            {user.role !== 'customer' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                {RESERVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Reservations Grid or Table */}
        {user.role === 'customer' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((res) => (
                <div
                  key={res._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Party of {res.partySize}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(res.reservationDate)} at {formatTime(res.reservationTime)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        res.status
                      )}`}
                    >
                      {res.status}
                    </span>
                  </div>

                  {res.notes && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      <strong>Notes:</strong> {res.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReservation(res);
                        setShowForm(true);
                      }}
                      className="flex-1 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="flex-1 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No reservations yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Party Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((res) => (
                      <tr
                        key={res._id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {res.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {res.partySize}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(res.reservationDate)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={res.status}
                            onChange={(e) =>
                              handleStatusChange(res._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(
                              res.status
                            )}`}
                          >
                            {RESERVATION_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDelete(res._id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                      >
                        No reservations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservation Form Modal */}
        {showForm && (
          <ReservationForm
            reservation={editingReservation}
            onClose={() => {
              setShowForm(false);
              setEditingReservation(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}
