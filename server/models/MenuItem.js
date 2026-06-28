import mongoose from 'mongoose';

/**
 * MenuItem Schema
 * Represents a food item available on the QuickBite platform.
 * Supports full-text search, filtering by category/cuisine, and sorting.
 */
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['burgers', 'pizza', 'sushi', 'salads', 'desserts', 'drinks', 'sides'],
      message: '{VALUE} is not a valid category',
    },
  },
  cuisine: {
    type: String,
    enum: {
      values: ['american', 'italian', 'japanese', 'indian', 'mexican', 'thai', 'chinese', 'mediterranean'],
      message: '{VALUE} is not a valid cuisine',
    },
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  rating: {
    type: Number,
    default: 4.0,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  calories: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Text index on name and description enables MongoDB $text search.
 * Weights make name matches rank higher than description matches.
 */
menuItemSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 3, description: 1 } }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
