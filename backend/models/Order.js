import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  quantity: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'ready', 'completed'],
    default: 'placed'
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
