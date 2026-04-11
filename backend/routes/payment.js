import express from 'express';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// Initiate a UPI payment for an order
router.post('/initiate', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can make payments' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (order.studentId !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ error: 'Payment already completed' });
    }

    // Generate a simulated transaction ID
    const transactionId = 'BU' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    // In production, this would integrate with a real UPI gateway (Razorpay, PhonePe, etc.)
    // For now, we simulate the payment initiation
    res.json({
      orderId: order._id,
      amount: order.total,
      transactionId,
      upiDeepLink: `upi://pay?pa=bueats@upi&pn=BuEats&am=${order.total}&tr=${transactionId}&tn=Order%20${order._id.toString().substring(order._id.toString().length - 4)}&cu=INR`,
      status: 'initiated'
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Verify/confirm payment (simulated)
router.post('/verify', async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod } = req.body;
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can verify payments' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.studentId !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // In production, verify with the UPI gateway
    // For simulation, mark as completed
    order.paymentStatus = 'completed';
    order.paymentMethod = paymentMethod || 'upi';
    order.transactionId = transactionId || '';
    await order.save();

    res.json({
      success: true,
      order,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get payment status for an order
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
      amount: order.total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

export default router;
