import { body, validationResult } from 'express-validator';
import MenuItem from '../models/MenuItem.js';

// ─── Validation Rules ──────────────────────────────────────────────────────────

export const menuItemValidation = [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(['burgers', 'pizza', 'sushi', 'salads', 'desserts', 'drinks', 'sides'])
    .withMessage('Invalid category'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('prepTime').isInt({ min: 1 }).withMessage('Prep time must be a positive integer'),
];

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * @desc    Get menu items with filtering, search, sorting, and pagination
 * @route   GET /api/menu
 * @access  Public
 *
 * Query params:
 *   search    — full-text search on name & description
 *   category  — filter by category
 *   cuisine   — filter by cuisine type
 *   isVeg     — filter vegetarian items (true/false)
 *   minPrice  — minimum price filter
 *   maxPrice  — maximum price filter
 *   sort      — sort field: price, -price, rating, -rating, prepTime, -prepTime
 *   page      — page number (default: 1)
 *   limit     — items per page (default: 12)
 */
export const getMenuItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      cuisine,
      isVeg,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build the filter object dynamically based on provided query params
    const filter = { isAvailable: true };

    // Full-text search using the text index on name + description
    if (search) {
      filter.$text = { $search: search };
    }

    if (category) filter.category = category.toLowerCase();
    if (cuisine) filter.cuisine = cuisine.toLowerCase();
    if (isVeg !== undefined) filter.isVeg = isVeg === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Determine sort order — prefix with "-" for descending
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }
    // When using text search, sort by relevance score first
    if (search) {
      sortOption = { score: { $meta: 'textScore' }, ...sortOption };
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10))); // Cap at 50
    const skip = (pageNum - 1) * limitNum;

    // Execute query and count in parallel for performance
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .select(search ? { score: { $meta: 'textScore' } } : {})
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      MenuItem.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
export const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu
 * @access  Private/Admin
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const item = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a menu item
 * @route   PUT /api/menu/:id
 * @access  Private/Admin
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menu/:id
 * @access  Private/Admin
 */
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get count of items per category (aggregation)
 * @route   GET /api/menu/stats/categories
 * @access  Public
 */
export const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await MenuItem.aggregate([
      // Only count available items
      { $match: { isAvailable: true } },
      // Group by category and count
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
        },
      },
      // Sort alphabetically by category
      { $sort: { _id: 1 } },
      // Rename _id to category for clarity
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          avgRating: { $round: ['$avgRating', 1] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
