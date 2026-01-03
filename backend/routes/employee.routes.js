import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.middleware.js';
import Employee from '../models/Employee.model.js';
import User from '../models/User.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find().populate('userId', 'name email phone');
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'name email phone');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (HR/Admin only)
router.post('/', authorize('admin', 'hr'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, department, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate employee ID
    const employeeId = `EMP${Date.now()}`;

    // Create user account with default password if not provided
    const defaultPassword = password || 'password123'; // In production, generate secure random password
    const user = await User.create({
      companyName: req.user.companyName || 'Company',
      name,
      email,
      phone: phone || '',
      password: defaultPassword,
      role: 'employee'
    });

    // Create employee record
    const employee = await Employee.create({
      employeeId,
      userId: user._id,
      name,
      email,
      phone: phone || '',
      department,
      role,
      status: 'Active',
      joinDate: new Date()
    });

    res.status(201).json({
      success: true,
      data: employee,
      message: password ? 'Employee created successfully' : 'Employee created with default password. Please change it on first login.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (HR/Admin only)
router.put('/:id', authorize('admin', 'hr'), [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('department').optional().trim().notEmpty(),
  body('role').optional().trim().notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (HR/Admin only)
router.delete('/:id', authorize('admin', 'hr'), async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
