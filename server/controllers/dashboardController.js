import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import {
  getMockDashboardStats,
  getMockReservationStats,
  getMockSalesData,
  isMockUser,
} from '../utils/mockStore.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json({
        success: true,
        data: getMockDashboardStats(),
      });
    }

    let totalOrders, totalReservations, totalCustomers, totalSales, ordersByStatus, topDishes;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      totalOrders = await Order.countDocuments();
      totalReservations = await Reservation.countDocuments();
      totalCustomers = await User.countDocuments({ role: 'customer' });

      totalSales = await Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);

      ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      topDishes = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            orders: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.subtotal' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            name: '$_id',
            orders: 1,
            revenue: 1,
          },
        },
      ]);
    } catch (dbError) {
      // Mock data if DB fails
      totalOrders = 25;
      totalReservations = 10;
      totalCustomers = 15;
      totalSales = [{ total: 1250.50 }];
      ordersByStatus = [
        { _id: 'Pending', count: 5 },
        { _id: 'Preparing', count: 8 },
        { _id: 'Completed', count: 12 },
      ];
      topDishes = [
        { name: 'Grilled Salmon', orders: 15, revenue: 364.95 },
        { name: 'Caesar Salad', orders: 12, revenue: 143.88 },
        { name: 'Chocolate Lava Cake', orders: 10, revenue: 99.90 },
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalReservations,
        totalCustomers,
        totalSales: totalSales[0]?.total || 0,
        ordersByStatus,
        topDishes,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales data
// @route   GET /api/dashboard/sales
// @access  Private/Admin
export const getSalesData = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json({ data: getMockSalesData() });
    }

    let sales;

    try {
      const { period = 'week' } = req.query;
      const today = new Date();
      let startDate = new Date();

      switch (period) {
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate.setDate(today.getDate() - 7);
      }

      sales = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, paymentStatus: 'Completed' } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: '$_id',
            sales: 1,
            orders: 1,
            _id: 0,
          },
        },
      ]);
    } catch (dbError) {
      // Mock sales data
      sales = [
        { date: '2024-04-15', sales: 150.50, orders: 3 },
        { date: '2024-04-16', sales: 200.75, orders: 4 },
        { date: '2024-04-17', sales: 175.25, orders: 3 },
        { date: '2024-04-18', sales: 220.00, orders: 5 },
        { date: '2024-04-19', sales: 180.90, orders: 4 },
        { date: '2024-04-20', sales: 250.30, orders: 6 },
        { date: '2024-04-21', sales: 190.45, orders: 4 },
      ];
    }

    res.status(200).json({ data: sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reservations statistics
// @route   GET /api/dashboard/reservations
// @access  Private/Admin
export const getReservationStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockReservationStats());
    }

    const reservationsByStatus = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const upcomingReservations = await Reservation.find({
      reservationDate: { $gte: new Date() },
    })
      .limit(5)
      .sort({ reservationDate: 1 });

    res.status(200).json({
      byStatus: reservationsByStatus,
      upcoming: upcomingReservations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top dishes
// @route   GET /api/dashboard/top-dishes
// @access  Private/Admin
export const getTopDishes = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockDashboardStats().topDishes);
    }

    const topDishes = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          orders: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          orders: 1,
          revenue: 1,
        },
      },
    ]);

    res.status(200).json(topDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
