const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET /api/menu/:shopId — Return all menu items for a specific shop
router.get('/:shopId', async (req, res) => {
  try {
    const items = await Menu.find({ shopId: req.params.shopId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu — Add a new menu item
router.post('/', async (req, res) => {
  try {
    const { shopId, name, price } = req.body;
    const item = await Menu.create({ shopId, name, price });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/menu/:id — Update a menu item
router.put('/:id', async (req, res) => {
  try {
    const { name, price } = req.body;
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/menu/:id — Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
