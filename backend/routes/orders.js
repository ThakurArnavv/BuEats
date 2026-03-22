import express from 'express';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ALL ROUTES ARE PROTECTED
router.use(authMiddleware);

// Place a new order
router.post('/', async (req, res) => {
  try {
    const { shopId, items, total } = req.body;
    
    // Safety check: only students can order
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Only students can place orders' });
    }

    const newOrder = new Order({
      studentId: req.user.username,
      shopId,
      items,
      total,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders for the current student (order history, sorted newest first)
router.get('/student', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Unauthorized' });
    
    const orders = await Order.find({ studentId: req.user.username }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student orders' });
  }
});

// Get all incoming orders for the current shop
router.get('/shop', async (req, res) => {
  try {
    if (req.user.role !== 'shop') return res.status(403).json({ error: 'Unauthorized' });

    const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
    
    const orders = await Order.find({ 
      $or: [
        { shopId: req.user.username }, 
        { shopId: shopIdPrefix },
        { shopId: new RegExp(`^${shopIdPrefix}$`, 'i') } 
      ] 
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shop orders' });
  }
});

// Accept an order and set expected time
router.put('/:id/accept', async (req, res) => {
    try {
        if (req.user.role !== 'shop') return res.status(403).json({ error: 'Unauthorized. Only shops can accept orders.' });
        
        const { expectedPreparationTime } = req.body;
        if (expectedPreparationTime === undefined || expectedPreparationTime < 0) {
            return res.status(400).json({ error: 'Valid expectedPreparationTime (in minutes) is required to accept an order' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
        if (order.shopId !== req.user.username && order.shopId.toLowerCase() !== shopIdPrefix) {
           return res.status(403).json({ error: 'Not authorized to edit this order' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Can only accept pending orders' });
        }

        order.status = 'accepted';
        order.expectedPreparationTime = expectedPreparationTime;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to accept order' });
    }
});

// Reject an order
router.put('/:id/reject', async (req, res) => {
    try {
        if (req.user.role !== 'shop') return res.status(403).json({ error: 'Unauthorized. Only shops can reject orders.' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
        if (order.shopId !== req.user.username && order.shopId.toLowerCase() !== shopIdPrefix) {
           return res.status(403).json({ error: 'Not authorized to edit this order' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Can only reject pending orders' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reject order' });
    }
});

// Update an order's status
router.put('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];

      if (!validStatuses.includes(status)) {
         return res.status(400).json({ error: 'Invalid status string' });
      }

      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
      if (req.user.role === 'shop' && 
          order.shopId !== req.user.username && 
          order.shopId.toLowerCase() !== shopIdPrefix) {
         return res.status(403).json({ error: 'Not authorized to edit this order' });
      }

      order.status = status;
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
});

export default router;
