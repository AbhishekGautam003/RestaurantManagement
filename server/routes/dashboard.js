import express from 'express';
import {
  getDashboardStats,
  getSalesData,
  getReservationStats,
  getTopDishes,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'staff'), getDashboardStats);
router.get('/sales', protect, authorize('admin', 'staff'), getSalesData);
router.get('/reservations', protect, authorize('admin', 'staff'), getReservationStats);
router.get('/top-dishes', protect, authorize('admin', 'staff'), getTopDishes);

export default router;
