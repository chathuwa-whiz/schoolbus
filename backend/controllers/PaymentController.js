import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Child from '../models/Child.js';
import Invoice from '../models/Invoice.js';
import Receipt from '../models/Receipt.js';
import Route from '../models/Route.js'; // Import Route model
import mongoose from 'mongoose';
import Stripe from 'stripe';

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get all invoices for a parent
export async function getParentInvoices(req, res) {
  try {
    const parentId = req.user._id;

    const invoices = await Invoice.find({
      parentId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Get parent invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get invoice details
export async function getInvoiceDetails(req, res) {
  try {
    const { invoiceId } = req.params;
    const parentId = req.user._id;

    // Validate invoiceId
    if (!invoiceId || invoiceId === "undefined") {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID provided'
      });
    }

    // Validate that invoiceId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID format'
      });
    }

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      parentId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Get children details
    const children = await Child.find({
      parent: parentId
    }).select('firstName lastName route');

    // Format response with child details
    const childDetails = children.map(child => ({
      name: `${child.firstName} ${child.lastName}`,
      busRoute: `Route #${child.route?.routeNumber || 'N/A'}`,
      fee: invoice.amount / children.length
    }));

    res.status(200).json({
      success: true,
      invoiceId: invoice._id,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      period: invoice.period,
      children: childDetails,
      status: invoice.status
    });
  } catch (error) {
    console.error('Get invoice details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Process credit card payment
export async function processCardPayment(req, res) {
  try {
    const { invoiceId, paymentMethodId, amount } = req.body;
    const parentId = req.user._id;

    // Verify invoice
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      parentId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Payment for Invoice #${invoice._id}`, // Using invoice._id for clarity
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Instruct Stripe not to redirect
      },
    });

    if (paymentIntent.status === 'succeeded') {
      // Update invoice status
      invoice.status = 'paid';
      invoice.paymentDate = new Date();
      await invoice.save();

      // Create payment record
      const payment = await Payment.create({
        amount,
        paymentMethod: 'credit_card',
        status: 'completed',
        transactionId: paymentIntent.id,
        description: `Payment for Invoice #${invoice._id}`, // Consistent description
        parentId,
        invoiceId: invoice._id, // Ensure this is the MongoDB ObjectId
        childrenIds: invoice.childrenIds 
      });

      // Create receipt
      const receipt = await Receipt.create({
        invoiceId: invoice._id,
        parentId,
        amount,
        paymentMethod: 'credit_card',
        transactionId: paymentIntent.id,
        paymentGateway: 'stripe',
        paymentDate: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        receiptId: receipt._id
      });
    } else {
      // If not 'succeeded' (e.g., 'requires_payment_method' because redirect was disallowed but needed, or other failure)
      // The specific message from Stripe is often in last_payment_error
      const errorMessage = paymentIntent.last_payment_error?.message || 'Payment processing failed or requires action not permitted.';
      res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  } catch (error) {
    console.error('Process card payment error:', error);
    // Provide more specific Stripe error messages if available
    let errorMessage = 'Payment processing failed';
    if (error.type === 'StripeCardError') {
      errorMessage = error.message;
    } else if (error.type && error.message) { // Broader Stripe errors
        errorMessage = error.message;
    } else if (error.message) {
        errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}

// Create PayPal order
export async function createPaypalOrder(req, res) {
  try {
    const { invoiceId, amount } = req.body;
    const parentId = req.user._id;

    // Verify invoice
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      parentId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Here you'd integrate with PayPal SDK
    // For demonstration, returning a mock orderId
    res.status(200).json({
      success: true,
      orderId: 'MOCK-PAYPAL-ORDER-ID'
    });

  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order'
    });
  }
}

// Capture PayPal payment
export async function capturePaypalOrder(req, res) {
  try {
    const { invoiceId, orderId } = req.body;
    const parentId = req.user._id;

    // Verify invoice
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      parentId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Here you'd integrate with PayPal SDK to capture payment
    // For demonstration, we'll just update the status

    // Update invoice status
    invoice.status = 'paid';
    invoice.paymentDate = new Date();
    await invoice.save();

    // Create receipt
    const receipt = await Receipt.create({
      invoiceId: invoice._id,
      parentId,
      amount: invoice.amount,
      paymentMethod: 'paypal',
      transactionId: orderId,
      paymentDate: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'PayPal payment captured successfully',
      receiptId: receipt._id
    });
  } catch (error) {
    console.error('Capture PayPal order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal payment'
    });
  }
}

// Get driver salary data
export async function getDriverSalary(req, res) {
  try {
    const driverId = req.user._id;
    const { month } = req.query;
    
    // Here you'd query your database for the driver's salary information
    // For demonstration, returning mock data
    
    res.status(200).json({
      success: true,
      grossAmount: 2800.00,
      netAmount: 2140.00,
      nextPaymentDate: 'August 31, 2023',
      paymentMethod: 'Direct Deposit',
      accountEnding: '****6789',
      deductions: {
        incomeTax: 420.00,
        insurance: 180.00,
        retirement: 210.00
      },
      totalDeductions: 810.00,
      bonuses: [
        { description: 'Perfect Attendance Bonus', amount: 150.00, date: 'July 31, 2023' },
        { description: 'Safety Record Bonus', amount: 100.00, date: 'June 30, 2023' }
      ]
    });
  } catch (error) {
    console.error('Get driver salary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get driver payment history
export async function getDriverPaymentHistory(req, res) {
  try {
    const driverId = req.user._id;

    // For demonstration, returning mock data
    res.status(200).json({
      success: true,
      payments: [
        { id: 1, period: 'July 2023', payDate: 'July 31, 2023', grossAmount: 2800.00, netAmount: 2140.00, status: 'Paid' },
        { id: 2, period: 'June 2023', payDate: 'June 30, 2023', grossAmount: 2800.00, netAmount: 2140.00, status: 'Paid' },
        { id: 3, period: 'May 2023', payDate: 'May 31, 2023', grossAmount: 2800.00, netAmount: 2140.00, status: 'Paid' },
        { id: 4, period: 'April 2023', payDate: 'April 30, 2023', grossAmount: 2650.00, netAmount: 2026.00, status: 'Paid' }
      ]
    });
  } catch (error) {
    console.error('Get driver payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get route income data
export async function getRouteIncome(req, res) {
  try {
    const driverId = req.user._id;
    const { month } = req.query;

    // For demonstration, returning mock data
    res.status(200).json({
      success: true,
      totalStudents: 14,
      ratePerStudent: 45.00,
      totalIncome: 630.00,
      routes: [
        { name: 'Northeast District Route', students: 7, ratePerStudent: 45.00, total: 315.00 },
        { name: 'Northwest District Route', students: 7, ratePerStudent: 45.00, total: 315.00 }
      ],
      notes: 'Paid per student transported, calculated monthly'
    });
  } catch (error) {
    console.error('Get route income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get parent payment status
export async function getParentPaymentStatus(req, res) {
  try {
    const driverId = req.user._id;

    // For demonstration, returning mock data
    res.status(200).json({
      success: true,
      total: 14,
      paid: 12,
      pending: 1,
      overdue: 1,
      recentActivity: [
        { parent: 'Sarah Johnson', student: 'Alex Johnson', date: 'August 2, 2023', amount: 45.00, status: 'Paid' },
        { parent: 'Robert Wilson', student: 'Emma Wilson', date: 'August 1, 2023', amount: 45.00, status: 'Paid' },
        { parent: 'Miguel Garcia', student: 'Sophia Garcia', date: 'July 29, 2023', amount: 45.00, status: 'Paid' },
        { parent: 'Jennifer Smith', student: 'Jacob Smith', date: 'July 15, 2023', amount: 45.00, status: 'Overdue' },
        { parent: 'Ana Martinez', student: 'Ethan Martinez', date: 'August 5, 2023', amount: 45.00, status: 'Pending' }
      ]
    });
  } catch (error) {
    console.error('Get parent payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Get children on driver's routes for invoicing
export async function getDriverRouteChildren(req, res) {
  try {
    const driverId = req.user._id;
    
    // Get routes assigned to this driver
    const routes = await Route.find({ driver: driverId });
    
    if (!routes.length) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    const routeIds = routes.map(route => route._id);
    
    // Find all children on these routes with their parent info
    const children = await Child.find({ route: { $in: routeIds } })
      .populate('parent', 'firstName lastName')
      .populate('route', 'name');
    
    // Get recent invoice/payment data for each child
    const childrenWithPaymentInfo = await Promise.all(children.map(async child => {
      // Find most recent invoice for this child
      const recentInvoice = await Invoice.findOne({
        childrenIds: child._id
      }).sort({ createdAt: -1 });
      
      return {
        _id: child._id,
        firstName: child.firstName,
        lastName: child.lastName,
        grade: child.grade,
        parentName: child.parent ? `${child.parent.firstName} ${child.parent.lastName}` : null,
        parentId: child.parent?._id,
        routeName: child.route?.name,
        routeId: child.route?._id,
        lastInvoice: recentInvoice ? {
          id: recentInvoice._id,
          amount: recentInvoice.amount,
          date: recentInvoice.issueDate,
          status: recentInvoice.status
        } : null,
        paymentStatus: recentInvoice?.status
      };
    }));
    
    res.status(200).json({
      success: true,
      data: childrenWithPaymentInfo
    });
  } catch (error) {
    console.error('Get driver route children error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// Generate invoice for selected children
export async function generateInvoice(req, res) {
  try {
    const driverId = req.user._id;
    const { childrenIds, amount, dueDate, period, notes } = req.body;
    
    if (!childrenIds || !childrenIds.length) {
      return res.status(400).json({
        success: false,
        message: 'No children selected'
      });
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Due date is required'
      });
    }
    
    if (!period) {
      return res.status(400).json({
        success: false,
        message: 'Invoice period is required'
      });
    }
    
    // Verify that these children are on the driver's routes
    const routes = await Route.find({ driver: driverId });
    const routeIds = routes.map(route => route._id);
    
    const eligibleChildren = await Child.find({
      _id: { $in: childrenIds },
      route: { $in: routeIds }
    }).populate('parent');
    
    if (!eligibleChildren.length) {
      return res.status(400).json({
        success: false,
        message: 'No eligible children found'
      });
    }
    
    // Group children by parent
    const parentMap = {};
    eligibleChildren.forEach(child => {
      if (!child.parent) return;
      
      const parentId = child.parent._id.toString();
      if (!parentMap[parentId]) {
        parentMap[parentId] = {
          parent: child.parent,
          children: []
        };
      }
      parentMap[parentId].children.push(child);
    });
    
    // Create an invoice for each parent
    const invoicePromises = Object.values(parentMap).map(async ({ parent, children }) => {
      const childrenIds = children.map(child => child._id);
      
      // Calculate amount per child (this could be more complex based on your requirements)
      const totalAmount = amount * children.length;
      
      const invoice = new Invoice({
        parentId: parent._id,
        amount: totalAmount,
        dueDate: new Date(dueDate),
        period,
        childrenIds,
        notes,
        items: children.map(child => ({
          description: `Transportation for ${child.firstName} ${child.lastName}`,
          amount,
          quantity: 1
        }))
      });
      
      await invoice.save();
      return invoice;
    });
    
    const invoices = await Promise.all(invoicePromises);
    
    res.status(201).json({
      success: true,
      message: `${invoices.length} invoices generated successfully`,
      invoices
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}