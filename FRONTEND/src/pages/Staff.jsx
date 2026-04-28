import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { staffAPI } from '../services/api';
import toast from 'react-hot-toast';
import StaffForm from '../components/staff/StaffForm';

const SHIFTS = ['Morning (6-2)', 'Afternoon (2-10)', 'Night (10-6)'];
const FALLBACK_STAFF = [
  {
    _id: 'mock-staff-record-1',
    name: 'John Smith',
    email: 'staff@example.com',
    phone: '5551234567',
    position: 'Chef',
    shift: 'Morning (6-2)',
  },
  {
    _id: 'mock-staff-record-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '5551234568',
    position: 'Waiter',
    shift: 'Afternoon (2-10)',
  },
];

export default function Staff() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      const { data } = await staffAPI.getAll();
      setStaffMembers(Array.isArray(data) ? data : FALLBACK_STAFF);
    } catch (error) {
      setStaffMembers(FALLBACK_STAFF);
      toast.error(error.response?.data?.message || 'Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = staffMembers;

    if (search) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(search.toLowerCase()) ||
          staff.email.toLowerCase().includes(search.toLowerCase()) ||
          staff.position.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staffMembers, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;

    try {
      await staffAPI.delete(id);
      toast.success('Staff member removed');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to remove staff member');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingStaff(null);
    fetchStaff();
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <button
            onClick={() => {
              setEditingStaff(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:shadow-lg"
          >
            <Plus size={20} />
            Add Staff Member
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr
                      key={staff._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {staff.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {staff.shift}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {staff.phone}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingStaff(staff);
                              setShowForm(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(staff._id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                      No staff members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Form Modal */}
        {showForm && (
          <StaffForm
            staff={editingStaff}
            onClose={() => {
              setShowForm(false);
              setEditingStaff(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}
