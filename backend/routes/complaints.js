import express from 'express';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Create a new complaint (Student)
router.post('/', async (req, res) => {
  try {
    const { user_id, order_id, outlet_id, complaint_type, description, image_url } = req.body;
    const newComplaint = new Complaint({
      user_id,
      order_id,
      outlet_id,
      complaint_type,
      description,
      image_url,
    });
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's complaints (Student)
router.get('/user/:userId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.params.userId }).populate('order_id').sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get outlet's complaints (Vendor)
router.get('/outlet/:outletId', async (req, res) => {
  try {
    const shopIdPrefix = req.params.outletId.split('@')[0].toLowerCase();
    const complaints = await Complaint.find({
      $or: [
        { outlet_id: req.params.outletId },
        { outlet_id: shopIdPrefix },
        { outlet_id: new RegExp(`^${shopIdPrefix}$`, 'i') }
      ]
    }).populate('order_id').sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all complaints (Admin)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('order_id').sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status (Admin/Vendor)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add vendor or admin response
router.put('/:id/response', async (req, res) => {
  try {
    const { vendor_response, admin_remark } = req.body;
    const updateData = {};
    if (vendor_response !== undefined) updateData.vendor_response = vendor_response;
    if (admin_remark !== undefined) updateData.admin_remark = admin_remark;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
