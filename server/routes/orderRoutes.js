import express from 'express';
import { createOrder, getUserOrders, getOrder, updateOrderStatus, getAllOrders, getOrderStats } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

router.get('/admin/stats', protect, admin, getOrderStats);
router.get('/admin/all', protect, admin, getAllOrders);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
