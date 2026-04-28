import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide customer email'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide customer phone'],
    },
    partySize: {
      type: Number,
      required: [true, 'Please provide party size'],
      min: 1,
    },
    reservationDate: {
      type: Date,
      required: [true, 'Please provide reservation date'],
    },
    reservationTime: {
      type: String,
      required: [true, 'Please provide reservation time'],
    },
    tableNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
    },
    approvedBy: {
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

export default mongoose.model('Reservation', reservationSchema);
