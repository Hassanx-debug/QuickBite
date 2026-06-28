import mongoose from 'mongoose';

/**
 * Sub-schema for individual items in an order.
 * We store name/price/image at order time so the order record is
 * self-contained even if the menu item is later modified or deleted.
 */
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    image: { type: String },
  },
  { _id: false }
);

/**
 * Sub-schema for delivery address — embedded for immutability.
 * Even if the user later changes their address, the order retains the
 * original delivery destination.
 */
const deliveryAddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Sub-schema for tracking status transitions over time.
 */
const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * Order Schema
 * Represents a customer's food order with full cost breakdown and status tracking.
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (v) => v.length > 0,
      message: 'Order must contain at least one item',
    },
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: [true, 'Delivery address is required'],
  },
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  paymentMethod: {
    type: String,
    default: 'cash-on-delivery',
  },
  estimatedDelivery: {
    type: String,
  },
  statusHistory: [statusHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast user-specific order lookups, sorted by most recent
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
