import express from 'express';
import Menu from '../models/Menu.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is shop owner
const isShopOwner = (req, res, next) => {
  if (req.user.role !== 'shop') {
    return res.status(403).json({ error: 'Only shop owners can manage menus' });
  }
  next();
};

// Get menus — PUBLIC (no auth required so students can browse)
router.get('/:shopId', async (req, res) => {
    try {
        const { shopId } = req.params;
        const prefix = shopId.split('@')[0].toLowerCase();
        // Fuzzy match: exact shopId, prefix before @, or case-insensitive
        const items = await Menu.find({
          $or: [
            { shopId: shopId },
            { shopId: prefix },
            { shopId: new RegExp(`^${prefix}`, 'i') }
          ]
        });
        res.json(items);
    } catch (error) {
        console.error('Fetch menu error:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// --- PROTECTED ROUTES BELOW ---

// Add new menu item
router.post('/', authMiddleware, isShopOwner, async (req, res) => {
  try {
    const { shopId, name, description, price, isAvailable } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newItem = new Menu({
      shopId: shopId || req.user.username,
      name,
      description,
      price,
      isAvailable
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Update existing menu item
router.put('/:id', authMiddleware, isShopOwner, async (req, res) => {
  try {
    const { name, description, price, isAvailable } = req.body;
    
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    if (name !== undefined) menuItem.name = name;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
router.delete('/:id', authMiddleware, isShopOwner, async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;
