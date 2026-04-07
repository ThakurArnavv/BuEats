import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  outlet_id: {
    type: String,
    required: true,
  },
  complaint_type: {
    type: String,
    enum: [
      'Late delivery',
      'Wrong order',
      'Poor food quality',
      'Payment issue',
      'App/technical issue',
      'Other'
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  admin_remark: {
    type: String,
    default: '',
  },
  vendor_response: {
    type: String,
    default: '',
  }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
