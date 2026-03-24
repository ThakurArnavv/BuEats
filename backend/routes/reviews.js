import express from 'express';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ALL ROUTES ARE PROTECTED
router.use(authMiddleware);

// Submit a review (student only, order must be completed, one per order)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit reviews' });
    }

    const { orderId, rating, comment, issues, addedToFavorites } = req.body;

    // Validate order exists and belongs to this student
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.studentId !== req.user.username) {
      return res.status(403).json({ error: 'You can only review your own orders' });
    }

    // Anti-fake: only allow review if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review delivered/completed orders' });
    }

    // Anti-fake: check if review already exists
    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ error: 'Review already submitted for this order' });
    }

    const review = new Review({
      orderId,
      studentId: req.user.username,
      shopId: order.shopId,
      rating,
      comment: comment || '',
      issues: issues || [],
      addedToFavorites: addedToFavorites || false,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Review submission error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Review already submitted for this order' });
    }
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Edit a review (within 24 hours only)
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can edit reviews' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.studentId !== req.user.username) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Anti-fake: 24 hour edit window
    const hoursSinceCreation = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(400).json({ error: 'Edit window has expired (24 hours)' });
    }

    const { rating, comment, issues } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (issues !== undefined) review.issues = issues;

    await review.save();
    res.json(review);
  } catch (error) {
    console.error('Review edit error:', error);
    res.status(500).json({ error: 'Failed to edit review' });
  }
});

// Get all reviews for a shop (accessible by both students and shop owners)
router.get('/shop/:shopId', async (req, res) => {
  try {
    const shopIdParam = req.params.shopId;
    const shopIdPrefix = shopIdParam.split('@')[0].toLowerCase();

    const reviews = await Review.find({
      $or: [
        { shopId: shopIdParam },
        { shopId: shopIdPrefix },
        { shopId: new RegExp(`^${shopIdPrefix}$`, 'i') }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('orderId', 'items total createdAt');
    res.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Check if a review exists for a specific order
router.get('/order/:orderId', async (req, res) => {
  try {
    const review = await Review.findOne({ orderId: req.params.orderId });
    res.json(review || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check review' });
  }
});

// Shop owner replies to a review
router.put('/:id/reply', async (req, res) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ error: 'Only shop owners can reply to reviews' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const shopIdPrefix = req.user.username.split('@')[0].toLowerCase();
    if (review.shopId !== req.user.username && review.shopId.toLowerCase() !== shopIdPrefix) {
      return res.status(403).json({ error: 'Not authorized to reply to this review' });
    }

    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Reply cannot be empty' });
    }

    review.shopReply = reply.trim();
    review.shopRepliedAt = new Date();
    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Failed to reply to review' });
  }
});

export default router;
