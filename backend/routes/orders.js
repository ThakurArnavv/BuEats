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
      status: 'placed'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders for the current student
router.get('/student', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Unauthorized' });
    
    // Sort by newest first
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

    // Shop owners ID is their username in this architecture
    const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
    
    // Match exact username or the prefix before @ in lowercase
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

// Update an order's status
router.put('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['placed', 'preparing', 'ready', 'completed'];

      if (!validStatuses.includes(status)) {
         return res.status(400).json({ error: 'Invalid status string' });
      }

      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // Assuming we only let shop owners update order statuses for their own shop
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
