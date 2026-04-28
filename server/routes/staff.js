import express from 'express';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllStaff);
router.get('/:id', protect, authorize('admin'), getStaffById);

router.post('/', protect, authorize('admin'), createStaff);
router.put('/:id', protect, authorize('admin'), updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);

export default router;
