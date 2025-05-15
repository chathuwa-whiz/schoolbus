import express from 'express';
import { 
  startTracking,
  updateLocation,
  endTracking,
  reportEmergency,
  getBusTracking,
  getChildBusTracking,
  getBusTrackingHistory,
  updateConnectionInfo
} from '../controllers/TrackingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Routes that require authentication
router.use(protect);

// Driver routes
router.post('/start', authorize('driver'), startTracking);
router.post('/update', authorize('driver'), updateLocation);
router.post('/end', authorize('driver'), endTracking);
router.post('/emergency', authorize('driver'), reportEmergency);
router.post('/connection', authorize('driver'), updateConnectionInfo);

// Driver and admin routes
router.get('/bus/:busId', authorize(['driver', 'admin']), getBusTracking);
router.get('/bus/:busId/history/:date', authorize(['driver', 'admin']), getBusTrackingHistory);

// Parent routes
router.get('/child/:childId', authorize('parent'), getChildBusTracking);

export default router;