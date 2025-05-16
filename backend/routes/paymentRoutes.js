import express from 'express';
import { 
  getParentInvoices, 
  getInvoiceDetails, 
  processCardPayment,
  createPaypalOrder,
  capturePaypalOrder,
  getDriverSalary,
  getDriverPaymentHistory,
  getRouteIncome,
  getParentPaymentStatus
} from '../controllers/PaymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Parent payment routes
router.get('/parent/invoices', authorize('parent'), getParentInvoices);
router.get('/parent/invoices/:invoiceId', authorize('parent'), getInvoiceDetails);
router.post('/parent/process-card', authorize('parent'), processCardPayment);
router.post('/parent/create-paypal-order', authorize('parent'), createPaypalOrder);
router.post('/parent/capture-paypal-order', authorize('parent'), capturePaypalOrder);

// Driver payment routes
router.get('/driver/salary', authorize('driver'), getDriverSalary);
router.get('/driver/history', authorize('driver'), getDriverPaymentHistory);
router.get('/driver/route-income', authorize('driver'), getRouteIncome);
router.get('/driver/parent-payments', authorize('driver'), getParentPaymentStatus);

export default router;