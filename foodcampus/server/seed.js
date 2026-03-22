require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('./models/Menu');

const initialMenus = {
  snapeats: [
    { name: 'Loaded Pizza', price: 150 },
    { name: 'Burger', price: 90 },
    { name: 'Fries', price: 70 }
  ],
  houseofchow: [
    { name: 'Hakka Noodles', price: 140 },
    { name: 'Fried Rice', price: 130 }
  ],
  kaathi: [
    { name: 'Chicken Roll', price: 120 },
    { name: 'Paneer Roll', price: 100 }
  ],
  tuckshop: [
    { name: 'Veg Sandwich', price: 40 },
    { name: 'Maggi', price: 50 }
  ]
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert seed data
    const docs = [];
    for (const [shopId, items] of Object.entries(initialMenus)) {
      for (const item of items) {
        docs.push({ shopId, name: item.name, price: item.price });
      }
    }

    await Menu.insertMany(docs);
    console.log(`🌱 Seeded ${docs.length} menu items`);

    await mongoose.disconnect();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
