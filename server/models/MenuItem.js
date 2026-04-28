import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a menu item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Starters', 'Main Course', 'Desserts', 'Beverages'],
    },
    dietaryType: {
      type: String,
      enum: ['veg', 'non-veg'],
      default: 'veg',
    },
    image: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 15, // in minutes
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
