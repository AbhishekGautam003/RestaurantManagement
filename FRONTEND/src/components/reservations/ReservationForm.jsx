import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { reservationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ReservationForm({ reservation, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    partySize: '',
    reservationDate: '',
    reservationTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        customerPhone: reservation.customerPhone,
        partySize: reservation.partySize,
        reservationDate: reservation.reservationDate.split('T')[0],
        reservationTime: reservation.reservationTime,
        notes: reservation.notes || '',
      });
    } else {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        partySize: '',
        reservationDate: '',
        reservationTime: '',
        notes: '',
      });
    }
  }, [reservation]);

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
      if (reservation) {
        await reservationsAPI.update(reservation._id, formData);
        toast.success('Reservation updated successfully');
      } else {
        await reservationsAPI.create(formData);
        toast.success('Reservation created successfully');
      }
      onSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save reservation');
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
              {reservation ? 'Edit Reservation' : 'New Reservation'}
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
                name="customerName"
                value={formData.customerName}
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
                name="customerEmail"
                value={formData.customerEmail}
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
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Party Size
                </label>
                <input
                  type="number"
                  name="partySize"
                  value={formData.partySize}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="reservationDate"
                  value={formData.reservationDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time
              </label>
              <input
                type="time"
                name="reservationTime"
                value={formData.reservationTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Requests
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
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
