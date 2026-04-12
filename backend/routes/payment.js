import express from 'express';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.use(authMiddleware);

// Initiate a Razorpay payment for an order
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

    // Create Razorpay Order
    const options = {
      amount: Math.round(order.total * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    res.json({
      orderId: order._id,
      amount: order.total,
      rzpOrderId: rzpOrder.id,
      status: 'initiated'
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  try {
    const { 
      orderId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentMethod 
    } = req.body;
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can verify payments' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.studentId !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Cash/Counter payment bypasses Razorpay verification
    if (paymentMethod === 'cash') {
      order.paymentStatus = 'completed';
      order.paymentMethod = 'cash';
      order.transactionId = razorpay_payment_id || 'COUNTER-' + Date.now().toString(36).toUpperCase();
      await order.save();
      return res.json({ success: true, order, message: 'Cash payment confirmed' });
    }

    // Verify signature for Razorpay payments
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      order.paymentStatus = 'completed';
      order.paymentMethod = 'online';
      order.transactionId = razorpay_payment_id;
      await order.save();

      res.json({
        success: true,
        order,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
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
