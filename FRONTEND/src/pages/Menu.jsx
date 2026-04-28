import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Clock,
  Star,
  ShoppingCart,
  Minus,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { menuAPI, ordersAPI } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import MenuForm from '../components/menu/MenuForm';

function FoodTypeIndicator({ dietaryType = 'veg' }) {
  const isVeg = dietaryType !== 'non-veg';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
        isVeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 ${
          isVeg ? 'border-green-600' : 'border-red-600'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}
        />
      </span>
      {isVeg ? 'Veg' : 'Non-Veg'}
    </span>
  );
}

export default function Menu() {
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer';
  const ratingStorageKey = `menu-ratings-${user?._id || 'guest'}`;
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(isCustomer);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ratings, setRatings] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});

  useEffect(() => {
    fetchMenuItems();
    if (isCustomer) {
      fetchCustomerOrders();
    }
  }, []);

  useEffect(() => {
    if (!isCustomer) return;

    try {
      const stored = localStorage.getItem(ratingStorageKey);
      setRatings(stored ? JSON.parse(stored) : {});
    } catch (error) {
      setRatings({});
    }
  }, [isCustomer, ratingStorageKey]);

  useEffect(() => {
    if (!isCustomer) return;
    localStorage.setItem(ratingStorageKey, JSON.stringify(ratings));
  }, [isCustomer, ratingStorageKey, ratings]);

  useEffect(() => {
    filterItems();
  }, [items, search, category]);

  const fetchMenuItems = async () => {
    try {
      const { data } = await menuAPI.getAll();
      setItems(data);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async () => {
    try {
      const { data } = await ordersAPI.getAll({ customerId: user?._id });
      setCustomerOrders(data);
    } catch (error) {
      toast.error('Failed to fetch your orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await menuAPI.delete(id);
      toast.success('Menu item deleted');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchMenuItems();
  };

  const addToCart = (item) => {
    if (!item.isAvailable) return;

    setAddedFeedback((prev) => ({ ...prev, [item._id]: true }));
    window.setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [item._id]: false }));
    }, 900);

    setCart((prev) => {
      const existing = prev.find((entry) => entry._id === item._id);
      if (existing) {
        return prev.map((entry) =>
          entry._id === item._id
            ? {
                ...entry,
                quantity: entry.quantity + 1,
                subtotal: (entry.quantity + 1) * Number(entry.price),
              }
            : entry
        );
      }

      return [
        ...prev,
        {
          _id: item._id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          subtotal: Number(item.price),
        },
      ];
    });
  };

  const updateCartQuantity = (itemId, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCart((prev) => prev.filter((entry) => entry._id !== itemId));
      return;
    }

    setCart((prev) =>
      prev.map((entry) =>
        entry._id === itemId
          ? {
              ...entry,
              quantity: nextQuantity,
              subtotal: nextQuantity * Number(entry.price),
            }
          : entry
      )
    );
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, entry) => sum + Number(entry.subtotal || 0), 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0),
    [cart]
  );

  const cartLookup = useMemo(
    () =>
      cart.reduce((acc, entry) => {
        acc[entry._id] = entry.quantity;
        return acc;
      }, {}),
    [cart]
  );

  const orderedItems = useMemo(() => {
    const map = new Map();

    for (const order of customerOrders) {
      for (const entry of order.items || []) {
        const key = entry.menuItemId || entry.name;
        if (!key) continue;

        const current = map.get(key) || {
          key,
          name: entry.name,
          orderCount: 0,
          lastOrderedAt: order.createdAt,
        };

        current.orderCount += Number(entry.quantity || 0);
        if (new Date(order.createdAt) > new Date(current.lastOrderedAt)) {
          current.lastOrderedAt = order.createdAt;
        }
        map.set(key, current);
      }
    }

    return [...map.values()].sort(
      (a, b) => new Date(b.lastOrderedAt) - new Date(a.lastOrderedAt)
    );
  }, [customerOrders]);

  const orderedItemKeys = useMemo(
    () => new Set(orderedItems.map((entry) => entry.key)),
    [orderedItems]
  );

  const getItemRating = (item) => {
    return ratings[item.menuItemId] || ratings[item._id] || ratings[item.name] || 0;
  };

  const saveRating = (itemKey, itemName, value) => {
    setRatings((prev) => ({
      ...prev,
      [itemKey]: value,
    }));
    toast.success(`${itemName} rated ${value} star${value > 1 ? 's' : ''}`);
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      toast.error('Add at least one item to place an order');
      return;
    }

    setSubmittingOrder(true);

    try {
      await ordersAPI.create({
        items: cart.map((entry) => ({
          menuItemId: entry._id.startsWith('mock-') ? undefined : entry._id,
          name: entry.name,
          quantity: entry.quantity,
          price: entry.price,
          subtotal: entry.subtotal,
        })),
        totalAmount: cartTotal,
        deliveryType: 'Dine-in',
        paymentMethod: 'Cash',
        notes: 'Placed from customer menu',
      });

      toast.success('Order placed successfully');
      setCart([]);
      fetchCustomerOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              {isCustomer ? 'Restaurant Menu' : 'Menu Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isCustomer
                ? 'Tap any dish to add it to your cart, then place the order when you are ready.'
                : `${filteredItems.length} items available`}
            </p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            >
              <Plus size={22} />
              Add Item
            </button>
          )}
        </div>

        <div className={`grid gap-8 ${isCustomer ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
          <div>
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all dark:border-gray-700 dark:bg-gray-800 ${
                      isCustomer && item.isAvailable
                        ? 'cursor-pointer hover:border-green-300 hover:shadow-xl dark:hover:border-green-500'
                        : 'hover:border-blue-300 hover:shadow-xl dark:hover:border-blue-500'
                    }`}
                    onClick={() => {
                      if (isCustomer) addToCart(item);
                    }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-6xl text-gray-500 dark:from-gray-600 dark:to-gray-700 dark:text-gray-400">
                          V
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex flex-col gap-2">
                        <span className="inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                          {item.category}
                        </span>
                        <FoodTypeIndicator dietaryType={item.dietaryType} />
                      </div>

                      <div className="absolute right-3 top-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                            item.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < (getItemRating(item) || 4)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {orderedItemKeys.has(item._id) || orderedItemKeys.has(item.name)
                                ? `${getItemRating(item) || 0}/5 your rating`
                                : 'Popular item'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>

                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock size={16} className="text-blue-600" />
                        <span>{item.preparationTime || 15} min prep time</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div>
                          <span className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Price</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(item.price || 0)}
                          </span>
                        </div>

                        {user?.role === 'admin' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem(item);
                                setShowForm(true);
                              }}
                              className="rounded-lg bg-blue-100 p-2.5 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                              title="Edit item"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item._id);
                              }}
                              className="rounded-lg bg-red-100 p-2.5 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                              title="Delete item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : isCustomer ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            disabled={!item.isAvailable}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                              addedFeedback[item._id]
                                ? 'scale-105 bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                                : 'bg-green-600 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md'
                            }`}
                          >
                            {addedFeedback[item._id] ? <Check size={16} /> : <Plus size={16} />}
                            {addedFeedback[item._id]
                              ? `Added${cartLookup[item._id] ? ` (${cartLookup[item._id]})` : ''}`
                              : cartLookup[item._id]
                                ? `Add More (${cartLookup[item._id]})`
                                : 'Order Now'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full">
                <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 text-6xl">?</div>
                  <p className="mb-2 text-xl text-gray-600 dark:text-gray-400">No menu items found</p>
                  <p className="text-gray-500 dark:text-gray-500">
                    {search ? 'Try adjusting your search terms' : 'Start by adding your first menu item'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {isCustomer && (
            <div className="space-y-6">
              {cart.length > 0 && (
                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={20} className="text-green-600" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Cart</h2>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {cartCount} items
                    </span>
                  </div>

                  <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                    {cart.map((entry) => (
                      <div
                        key={entry._id}
                        className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatCurrency(entry.price)} each
                            </p>
                          </div>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(entry.subtotal)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(entry._id, entry.quantity - 1)}
                              className="rounded-lg border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-8 text-center font-medium text-gray-900 dark:text-white">
                              {entry.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(entry._id, entry.quantity + 1)}
                              className="rounded-lg border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => updateCartQuantity(entry._id, 0)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="mb-4 flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={submittingOrder}
                      className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {submittingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Recent Orders</h2>
                </div>

                {ordersLoading ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading orders...</div>
                ) : customerOrders.length ? (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Order #{order._id.slice(-8)}
                          </p>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(order.createdAt)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {(order.items || []).reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)} items
                          </p>
                          <p className="font-semibold text-green-700 dark:text-green-400">
                            {formatCurrency(order.totalAmount || 0)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {orderedItems.length > 0 && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                          Rate Your Food
                        </h3>
                        <div className="space-y-3">
                          {orderedItems.map((entry) => (
                            <div
                              key={entry.key}
                              className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {entry.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Ordered {entry.orderCount} time{entry.orderCount > 1 ? 's' : ''}
                                  </p>
                                </div>
                                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                  {ratings[entry.key] ? `${ratings[entry.key]}/5` : 'Not rated'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => saveRating(entry.key, entry.name, value)}
                                    className="rounded-md p-1 transition-transform hover:scale-110"
                                    title={`Rate ${value} out of 5`}
                                  >
                                    <Star
                                      size={18}
                                      className={
                                        value <= (ratings[entry.key] || 0)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    Your placed orders will appear here with status and total.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <MenuForm
            item={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}
