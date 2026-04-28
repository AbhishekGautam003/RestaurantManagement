import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import {
  createMockReservation,
  deleteMockReservation,
  getMockReservations,
  isMockUser,
  updateMockReservation,
} from '../utils/mockStore.js';

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
export const getAllReservations = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockReservations(req.user));
    }

    let query = {};
    const userId = req.user?._id || req.user?.id;

    if (req.user.role === 'customer') {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(200).json([]);
      }
      query.customerId = userId;
    }

    const reservations = await Reservation.find(query)
      .populate('customerId', 'name email')
      .populate('approvedBy', 'name')
      .sort({ reservationDate: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error.message);
    res.status(200).json([]);
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('approvedBy', 'name');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private/Customer
export const createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, partySize, reservationDate, reservationTime, notes } = req.body;

    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const reservation = createMockReservation(
        { customerName, customerEmail, customerPhone, partySize, reservationDate, reservationTime, notes },
        req.user
      );
      return res.status(201).json(reservation);
    }

    const reservation = await Reservation.create({
      customerId: req.user._id,
      customerName,
      customerEmail,
      customerPhone,
      partySize,
      reservationDate,
      reservationTime,
      notes,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
export const updateReservation = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const reservation = updateMockReservation(req.params.id, req.body);

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      return res.status(200).json(reservation);
    }

    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Customer can only update their own reservations (if pending)
    if (req.user.role === 'customer' && req.user._id.toString() !== reservation.customerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin/Staff
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const reservation = updateMockReservation(req.params.id, { status });

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      return res.status(200).json(reservation);
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
export const deleteReservation = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const deleted = deleteMockReservation(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      return res.status(200).json({ message: 'Reservation deleted successfully' });
    }

    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
