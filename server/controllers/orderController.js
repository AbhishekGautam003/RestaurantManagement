import mongoose from 'mongoose';
import Order from '../models/Order.js';
import {
  createMockOrder,
  deleteMockOrder,
  getMockOrders,
  isMockUser,
  updateMockOrder,
} from '../utils/mockStore.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockOrders(req.user));
    }

    let query = {};
    const userId = req.user?._id || req.user?.id;

    if (req.user.role === 'customer') {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(200).json([]);
      }
      query.customerId = userId;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('items.menuItemId', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(200).json([]);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('items.menuItemId', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryType, deliveryAddress, paymentMethod, notes } = req.body;

    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const order = createMockOrder(
        { items, totalAmount, deliveryType, deliveryAddress, paymentMethod, notes },
        req.user
      );
      return res.status(201).json(order);
    }

    const order = await Order.create({
      customerId: req.user._id,
      customerName: req.user.name,
      items,
      totalAmount,
      deliveryType,
      deliveryAddress,
      paymentMethod,
      notes,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin/Staff
export const updateOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const order = updateMockOrder(req.params.id, req.body);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const order = updateMockOrder(req.params.id, { status });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const deleted = deleteMockOrder(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order deleted successfully' });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
