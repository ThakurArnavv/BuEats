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
    index: true,
  },
  shopId: {
    type: String,
    required: true,
    index: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  expectedPreparationTime: {
    type: Number,
    min: 0
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
