import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrderById);

router.post('/', protect, createOrder);
router.put('/:id', protect, updateOrder);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

export default router;
