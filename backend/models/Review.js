import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true, // One review per order
  },
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500,
  },
  issues: [{
    type: String,
    enum: ['Food quality', 'Late delivery', 'Wrong order', 'Packaging issue'],
  }],
  shopReply: {
    type: String,
    default: '',
    maxlength: 500,
  },
  shopRepliedAt: {
    type: Date,
  },
  addedToFavorites: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
