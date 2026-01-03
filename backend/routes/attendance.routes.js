import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import Attendance from '../models/Attendance.model.js';
import Employee from '../models/Employee.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/attendance/checkin
// @desc    Check in
// @access  Private
router.post('/checkin', async (req, res, next) => {
  try {
    // Get employee ID from user (you may need to adjust this based on your user model)
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    if (attendance) {
      attendance.checkIn = new Date();
      // Determine if late (assuming 9 AM is standard check-in time)
      const checkInHour = attendance.checkIn.getHours();
      attendance.status = checkInHour >= 9 ? (checkInHour > 9 ? 'Late' : 'Present') : 'Present';
    } else {
      const checkInTime = new Date();
      const checkInHour = checkInTime.getHours();
      attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: checkInTime,
        status: checkInHour >= 9 ? (checkInHour > 9 ? 'Late' : 'Present') : 'Present'
      });
    }

    await attendance.save();

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out
// @access  Private
router.post('/checkout', async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Please check in first'
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime;

    // Calculate work hours (in minutes)
    const workMinutes = Math.floor((checkOutTime - attendance.checkIn) / (1000 * 60));
    attendance.workHours = workMinutes;
    
    // Calculate extra hours (assuming 8 hours = 480 minutes is standard)
    const standardMinutes = 8 * 60;
    attendance.extraHours = Math.max(0, workMinutes - standardMinutes);

    await attendance.save();

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/attendance/my-attendance
// @desc    Get current user's attendance
// @access  Private
router.get('/my-attendance', async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { startDate, endDate } = req.query;
    const query = { employeeId: employee._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(50);

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/attendance
// @desc    Get all attendance records (HR/Admin)
// @access  Private (HR/Admin)
router.get('/', async (req, res, next) => {
  try {
    const { employeeId, date, startDate, endDate } = req.query;
    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(100);

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance record (HR/Admin)
// @access  Private (HR/Admin)
router.put('/:id', [
  body('status').optional().isIn(['Present', 'Late', 'Absent', 'On Leave'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId');

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
});

export default router;
