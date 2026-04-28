import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { menuAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
const DIETARY_TYPES = [
  { value: 'veg', label: 'Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
];

export default function MenuForm({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    dietaryType: 'veg',
    image: '',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || 'Main Course',
        dietaryType: item.dietaryType || 'veg',
        image: item.image || '',
        isAvailable: item.isAvailable ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        dietaryType: 'veg',
        image: '',
        isAvailable: true,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        await menuAPI.update(item._id, formData);
        toast.success('Menu item updated successfully');
      } else {
        await menuAPI.create(formData);
        toast.success('Menu item created successfully');
      }
      onSubmit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
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
              {item ? 'Edit Menu Item' : 'Add Menu Item'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food Type
            </label>
            <select
              name="dietaryType"
              value={formData.dietaryType}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            >
              {DIETARY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700 dark:text-gray-300">
              Available
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg disabled:opacity-50"
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
