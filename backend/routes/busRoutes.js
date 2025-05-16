import express from 'express';
import { 
  getAllBuses,
  getAvailableBuses
} from '../controllers/BusController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin routes
router.get('/', authorize('admin'), getAllBuses);
router.get('/available', authorize('admin'), getAvailableBuses);

export default router;