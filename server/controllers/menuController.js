import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';
import {
  createMockMenuItem,
  deleteMockMenuItem,
  getMockMenuItemById,
  getMockMenuItems,
  isMockUser,
  updateMockMenuItem,
} from '../utils/mockStore.js';

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getAllMenuItems = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      return res.status(200).json(getMockMenuItems());
    }

    const items = await MenuItem.find().populate('createdBy', 'name');
    res.status(200).json(items);
  } catch (error) {
    console.log('Database error, returning mock menu items:', error.message);
    res.status(200).json(getMockMenuItems());
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
export const getMenuByCategory = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const filtered = getMockMenuItems().filter((item) => item.category === req.params.category);
      return res.status(200).json(filtered);
    }

    const items = await MenuItem.find({ category: req.params.category });
    res.status(200).json(items);
  } catch (error) {
    console.log('Database error, returning mock menu items');
    const filtered = getMockMenuItems().filter((item) => item.category === req.params.category);
    res.status(200).json(filtered);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const mockItem = getMockMenuItemById(req.params.id);
      if (mockItem) {
        return res.status(200).json(mockItem);
      }
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const item = await MenuItem.findById(req.params.id).populate('createdBy', 'name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.log('Database error, checking mock menu items');
    const mockItem = getMockMenuItemById(req.params.id);
    if (mockItem) {
      return res.status(200).json(mockItem);
    }
    res.status(404).json({ message: 'Menu item not found' });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const item = createMockMenuItem(req.body);
      return res.status(201).json(item);
    }

    req.body.createdBy = req.user._id;
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.log('Database error, creating mock item');
    const mockItem = createMockMenuItem(req.body);
    res.status(201).json(mockItem);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const item = updateMockMenuItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.status(200).json(item);
    }

    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(item);
  } catch (error) {
    console.log('Database error, returning mock updated item');
    const mockItem = updateMockMenuItem(req.params.id, req.body);
    if (mockItem) {
      return res.status(200).json(mockItem);
    }
    res.status(404).json({ message: 'Menu item not found' });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || isMockUser(req.user)) {
      const deleted = deleteMockMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.status(200).json({ message: 'Menu item deleted successfully' });
    }

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.log('Database error, returning mock delete success');
    deleteMockMenuItem(req.params.id);
    res.status(200).json({ message: 'Menu item deleted successfully' });
  }
};
