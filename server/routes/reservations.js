import express from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllReservations);
router.get('/:id', protect, getReservationById);

router.post('/', protect, createReservation);
router.put('/:id', protect, updateReservation);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateReservationStatus);
router.delete('/:id', protect, deleteReservation);

export default router;
