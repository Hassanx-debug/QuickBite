import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

// ─── Constants ─────────────────────────────────────────────────────────────────

const TAX_RATE = 0.08;              // 8% sales tax
const DELIVERY_FEE = 2.99;          // Standard delivery fee in dollars
const FREE_DELIVERY_THRESHOLD = 30; // Orders above this amount get free delivery

// ─── Validation Rules ──────────────────────────────────────────────────────────

export const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Each item must reference a menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').notEmpty().withMessage('Street is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.zip').notEmpty().withMessage('ZIP code is required'),
];

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 *
 * The server recalculates all prices from the database to prevent
 * price tampering from the client side.
 */
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { items, deliveryAddress, paymentMethod } = req.body;

    // Fetch all referenced menu items in one query for efficiency
    const menuItemIds = items.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    // Build a lookup map: menuItemId → menuItem document
    const menuItemMap = new Map(
      menuItems.map((mi) => [mi._id.toString(), mi])
    );

    // Validate and build order items with server-side prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItem.toString());

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${menuItem.name}" is currently unavailable`,
        });
      }

      const lineTotal = menuItem.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        image: menuItem.image,
      });
    }

    // Round to 2 decimal places to avoid floating-point issues
    subtotal = Math.round(subtotal * 100) / 100;

    // Calculate fees — free delivery for orders over the threshold
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    // Estimate delivery time based on the longest prep time + delivery buffer
    const maxPrepTime = Math.max(
      ...orderItems.map((oi) => {
        const mi = menuItemMap.get(oi.menuItem.toString());
        return mi ? mi.prepTime : 15;
      })
    );
    const estimatedDelivery = `${maxPrepTime + 15}-${maxPrepTime + 30} min`;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod: paymentMethod || 'cash-on-delivery',
      estimatedDelivery,
      statusHistory: [{ status: 'placed', timestamp: new Date() }],
    });

    res.status(201).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for the authenticated user
 * @route   GET /api/orders/my
 * @access  Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name price image category');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (owner or admin)
 */
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.menuItem',
      'name price image category'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only the order owner or an admin can view the order
    if (
      order.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'placed',
      'confirmed',
      'preparing',
      'out-for-delivery',
      'delivered',
      'cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update the current status and push to history for audit trail
    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });

    await order.save();

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price image category');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order statistics (admin only)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 *
 * Returns: total orders, total revenue, breakdown by status, recent 5 orders
 */
export const getOrderStats = async (req, res, next) => {
  try {
    // Run all aggregations in parallel
    const [ordersByStatus, revenueAgg, recentOrders] = await Promise.all([
      // Count orders grouped by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Total revenue and order count (exclude cancelled orders)
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' },
          },
        },
      ]),

      // 5 most recent orders for the dashboard
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
    ]);

    // Extract totals from the aggregation (handles empty DB gracefully)
    const revenue = revenueAgg[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalOrders: revenue.totalOrders,
        totalRevenue: Math.round(revenue.totalRevenue * 100) / 100,
        avgOrderValue: Math.round((revenue.avgOrderValue || 0) * 100) / 100,
        ordersByStatus: ordersByStatus.map((s) => ({
          status: s._id,
          count: s.count,
        })),
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
