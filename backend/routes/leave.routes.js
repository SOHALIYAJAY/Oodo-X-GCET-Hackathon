import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.middleware.js';
import Leave from '../models/Leave.model.js';
import Employee from '../models/Employee.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/leaves
// @desc    Apply for leave
// @access  Private
router.post('/', [
  body('type').isIn(['Sick Leave', 'Paid Leave', 'Unpaid Leave', 'Personal Leave', 'Annual Leave']),
  body('from').isISO8601().withMessage('From date is required'),
  body('to').isISO8601().withMessage('To date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { type, from, to, reason } = req.body;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Calculate days
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employeeId: employee._id,
      type,
      from: fromDate,
      to: toDate,
      days,
      reason,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leaves/my-leaves
// @desc    Get current user's leaves
// @access  Private
router.get('/my-leaves', async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const leaves = await Leave.find({ employeeId: employee._id })
      .sort({ appliedOn: -1 });

    res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leaves
// @desc    Get all leave requests (HR/Admin)
// @access  Private (HR/Admin)
router.get('/', async (req, res, next) => {
  try {
    const { status, employeeId } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (employeeId) {
      query.employeeId = employeeId;
    }

    const leaves = await Leave.find(query)
      .populate('employeeId', 'name email employeeId department')
      .populate('reviewedBy', 'name email')
      .sort({ appliedOn: -1 });

    res.json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leaves/:id
// @desc    Get single leave request
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department')
      .populate('reviewedBy', 'name email');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/leaves/:id/approve
// @desc    Approve leave request
// @access  Private (HR/Admin)
router.put('/:id/approve', authorize('admin', 'hr'), async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    leave.status = 'Approved';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();

    res.json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/leaves/:id/reject
// @desc    Reject leave request
// @access  Private (HR/Admin)
router.put('/:id/reject', authorize('admin', 'hr'), [
  body('rejectionReason').optional().trim()
], async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    leave.status = 'Rejected';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    if (req.body.rejectionReason) {
      leave.rejectionReason = req.body.rejectionReason;
    }
    await leave.save();

    res.json({
      success: true,
      data: leave
    });
  } catch (error) {
    next(error);
  }
});

export default router;
