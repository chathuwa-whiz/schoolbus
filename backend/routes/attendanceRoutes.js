import express from 'express';
import {
  getAttendanceHistory,
  getAttendanceStats,
  getTodayAttendance,
  reportAbsence,
  updateDailyAttendance,
  sendDriverNote
} from '../controllers/AttendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Parent routes
router.get('/child/:childId', authorize('parent'), getAttendanceHistory);
router.get('/child/:childId/stats', authorize('parent'), getAttendanceStats);
router.get('/child/:childId/today', authorize('parent'), getTodayAttendance);
router.post('/child/:childId/report', authorize('parent'), reportAbsence);
router.put('/child/:childId/daily', authorize('parent'), updateDailyAttendance);
router.post('/child/:childId/note', authorize('parent'), sendDriverNote);

export default router;