import Staff from '../models/Staff.js';
import mongoose from 'mongoose';
import {
  createMockStaff,
  deleteMockStaff,
  getMockStaff,
  isMockUser,
  updateMockStaff,
} from '../utils/mockStore.js';

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private/Admin
export const getAllStaff = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockStaff());
    }

    const staff = await Staff.find().populate('userId', 'name email');
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error fetching staff members:', error.message);
    res.status(200).json(getMockStaff());
  }
};

// @desc    Get staff member by ID
// @route   GET /api/staff/:id
// @access  Private/Admin
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('userId', 'name email');

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private/Admin
export const createStaff = async (req, res) => {
  try {
    const { name, email, phone, position, shift, joinDate, salary } = req.body;

    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const staff = createMockStaff({ name, email, phone, position, shift, joinDate, salary });
      return res.status(201).json(staff);
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      position,
      shift,
      joinDate,
      salary,
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
export const updateStaff = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const staff = updateMockStaff(req.params.id, req.body);

      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      return res.status(200).json(staff);
    }

    let staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
export const deleteStaff = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const deleted = deleteMockStaff(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      return res.status(200).json({ message: 'Staff member deleted successfully' });
    }

    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
