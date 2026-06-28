import express from 'express';
import { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, getCategoryStats } from '../controllers/menuController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/categories/stats', getCategoryStats);
router.route('/')
  .get(getMenuItems)
  .post(protect, admin, createMenuItem);

router.route('/:id')
  .get(getMenuItem)
  .put(protect, admin, updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

export default router;
