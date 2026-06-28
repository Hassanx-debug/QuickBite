import express from 'express';
import { register, login, getMe, updateProfile, addAddress, getAllUsers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/address', protect, addAddress);
router.get('/users', protect, admin, getAllUsers);

export default router;
