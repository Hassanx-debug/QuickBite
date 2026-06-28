import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: '../.env' }); // Make sure we load the env if run directly

const menuItems = [
  {
    name: 'Truffle Mushroom Burger',
    description: 'Juicy beef patty topped with sautéed wild mushrooms, Swiss cheese, and truffle aioli on a brioche bun.',
    price: 14.99,
    category: 'burgers',
    cuisine: 'american',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    prepTime: 15,
    isVeg: false,
    tags: ['bestseller', 'popular']
  },
  {
    name: 'Margherita Classica Pizza',
    description: 'Traditional Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil.',
    price: 16.99,
    category: 'pizza',
    cuisine: 'italian',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 89,
    prepTime: 20,
    isVeg: true,
    tags: ['bestseller']
  },
  {
    name: 'Spicy Tuna Roll',
    description: 'Fresh yellowfin tuna mixed with spicy mayo, wrapped in sushi rice and nori.',
    price: 12.99,
    category: 'sushi',
    cuisine: 'japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 215,
    prepTime: 10,
    isVeg: false,
    tags: ['spicy', 'popular']
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and classic Caesar dressing.',
    price: 9.99,
    category: 'salads',
    cuisine: 'american',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 65,
    prepTime: 5,
    isVeg: true,
    tags: ['healthy']
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla bean ice cream.',
    price: 8.99,
    category: 'desserts',
    cuisine: 'american',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 310,
    prepTime: 12,
    isVeg: true,
    tags: ['bestseller', 'new']
  },
  {
    name: 'Iced Matcha Latte',
    description: 'Premium ceremonial grade matcha blended with milk and served over ice.',
    price: 5.49,
    category: 'drinks',
    cuisine: 'japanese',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 45,
    prepTime: 3,
    isVeg: true,
    tags: ['popular']
  },
  {
    name: 'Sweet Potato Fries',
    description: 'Crispy cut sweet potatoes served with a side of spicy aioli.',
    price: 4.99,
    category: 'sides',
    cuisine: 'american',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 112,
    prepTime: 8,
    isVeg: true,
    tags: []
  }
];

const importData = async () => {
  try {
    // We connect to DB manually if running this standalone
    if(mongoose.connection.readyState !== 1) {
       await mongoose.connect(process.env.MONGODB_URI);
    }

    await Order.deleteMany();
    await MenuItem.deleteMany();
    await User.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@quickbite.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Test Customer',
        email: 'user@quickbite.com',
        password: userPassword,
        role: 'customer',
      }
    ];

    await User.insertMany(users);
    await MenuItem.insertMany(menuItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
