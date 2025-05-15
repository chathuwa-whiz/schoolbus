import express from 'express';
import { getActiveRoutes, getRouteById } from '../controllers/RouteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/active', protect, getActiveRoutes);
router.get('/:id', protect, getRouteById);

export default router;