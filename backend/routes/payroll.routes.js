import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.middleware.js';
import Payroll from '../models/Payroll.model.js';
import Employee from '../models/Employee.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/payroll/my-salary
// @desc    Get current user's salary
// @access  Private
router.get('/my-salary', async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { month, year } = req.query;
    const currentDate = new Date();
    const queryMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();

    const payroll = await Payroll.findOne({
      employeeId: employee._id,
      month: queryMonth,
      year: queryYear
    });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found for this month'
      });
    }

    res.json({
      success: true,
      data: payroll
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/payroll
// @desc    Get all payroll records (HR/Admin)
// @access  Private (HR/Admin)
router.get('/', async (req, res, next) => {
  try {
    const { month, year, employeeId, status } = req.query;
    const query = {};

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    const payroll = await Payroll.find(query)
      .populate('employeeId', 'name email employeeId department')
      .sort({ year: -1, month: -1 });

    res.json({
      success: true,
      count: payroll.length,
      data: payroll
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payroll
// @desc    Create payroll record (HR/Admin)
// @access  Private (HR/Admin)
router.post('/', authorize('admin', 'hr'), [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt().withMessage('Year is required'),
  body('basic').isNumeric().withMessage('Basic salary is required'),
  body('allowance').optional().isNumeric(),
  body('deduction').optional().isNumeric()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { employeeId, month, year, basic, allowance = 0, deduction = 0 } = req.body;
    const net = basic + allowance - deduction;

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      employeeId,
      month,
      year
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: 'Payroll record already exists for this month'
      });
    }

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basic,
      allowance,
      deduction,
      net,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/payroll/:id
// @desc    Update payroll record (HR/Admin)
// @access  Private (HR/Admin)
router.put('/:id', authorize('admin', 'hr'), [
  body('basic').optional().isNumeric(),
  body('allowance').optional().isNumeric(),
  body('deduction').optional().isNumeric()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    // Recalculate net if basic, allowance, or deduction changed
    if (req.body.basic !== undefined || req.body.allowance !== undefined || req.body.deduction !== undefined) {
      const basic = req.body.basic !== undefined ? req.body.basic : payroll.basic;
      const allowance = req.body.allowance !== undefined ? req.body.allowance : payroll.allowance;
      const deduction = req.body.deduction !== undefined ? req.body.deduction : payroll.deduction;
      req.body.net = basic + allowance - deduction;
    }

    payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department');

    res.json({
      success: true,
      data: payroll
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/payroll/:id/mark-paid
// @desc    Mark payroll as paid (HR/Admin)
// @access  Private (HR/Admin)
router.put('/:id/mark-paid', authorize('admin', 'hr'), async (req, res, next) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    payroll.status = 'Paid';
    payroll.paidAt = new Date();
    await payroll.save();

    res.json({
      success: true,
      data: payroll
    });
  } catch (error) {
    next(error);
  }
});

export default router;
