import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide staff name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
    },
    position: {
      type: String,
      enum: ['Chef', 'Waiter', 'Cashier', 'Manager', 'Kitchen Staff', 'Cleaner'],
      required: true,
    },
    shift: {
      type: String,
      enum: ['Morning (6-2)', 'Afternoon (2-10)', 'Night (10-6)'],
      default: 'Morning (6-2)',
    },
    joinDate: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
