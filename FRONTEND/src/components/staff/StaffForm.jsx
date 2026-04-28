import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { staffAPI } from '../../services/api';
import toast from 'react-hot-toast';

const POSITIONS = ['Chef', 'Waiter', 'Cashier', 'Manager', 'Kitchen Staff', 'Cleaner'];
const SHIFTS = ['Morning (6-2)', 'Afternoon (2-10)', 'Night (10-6)'];

export default function StaffForm({ staff, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Chef',
    shift: 'Morning (6-2)',
    joinDate: '',
    salary: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        position: staff.position,
        shift: staff.shift,
        joinDate: staff.joinDate.split('T')[0],
        salary: staff.salary,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: 'Chef',
        shift: 'Morning (6-2)',
        joinDate: today,
        salary: '',
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (staff) {
        await staffAPI.update(staff._id, formData);
        toast.success('Staff member updated successfully');
      } else {
        await staffAPI.create(formData);
        toast.success('Staff member added successfully');
      }
      onSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="my-4 w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {staff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pr-1">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shift
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {SHIFTS.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-white hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
