import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Menu from './models/Menu.js';

dotenv.config();

const initialMenus = {
  snapeats: [
    { name: 'Loaded Pizza', description: 'Cheesy loaded pizza with fresh toppings', price: 150 },
    { name: 'Burger', description: 'Classic grilled burger', price: 90 },
    { name: 'Fries', description: 'Crispy golden fries', price: 70 }
  ],
  houseofchow: [
    { name: 'Hakka Noodles', description: 'Spicy Indo-Chinese hakka noodles', price: 140 },
    { name: 'Fried Rice', description: 'Wok-tossed vegetable fried rice', price: 130 }
  ],
  kaathi: [
    { name: 'Chicken Roll', description: 'Juicy chicken kathi roll', price: 120 },
    { name: 'Paneer Roll', description: 'Spiced paneer kathi roll', price: 100 }
  ],
  tuckshop: [
    { name: 'Veg Sandwich', description: 'Fresh grilled veg sandwich', price: 40 },
    { name: 'Maggi', description: 'Classic 2-minute Maggi', price: 50 }
  ]
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Menu.deleteMany({});
    console.log('Cleared existing menu items');

    const docs = [];
    for (const [shopId, items] of Object.entries(initialMenus)) {
      for (const item of items) {
        docs.push({ shopId, name: item.name, description: item.description, price: item.price, isAvailable: true });
      }
    }

    await Menu.insertMany(docs);
    console.log(`Seeded ${docs.length} menu items`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
