import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyToken
} from '../controllers/authController.js';

const router = express.Router();

// Registrazione e login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Verifica token
router.get('/verify', verifyToken);

// Profilo utente (protetto)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
