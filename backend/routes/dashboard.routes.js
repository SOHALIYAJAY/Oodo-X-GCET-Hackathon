import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import Employee from '../models/Employee.model.js';
import Attendance from '../models/Attendance.model.js';
import Leave from '../models/Leave.model.js';
import Payroll from '../models/Payroll.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard stats
// @access  Private
router.get('/employee', async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Attendance stats
    const attendanceRecords = await Attendance.find({
      employeeId: employee._id,
      date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
    });

    const presentDays = attendanceRecords.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const totalDays = Math.ceil((lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1;

    // Leave requests
    const leaveRequests = await Leave.find({ employeeId: employee._id })
      .sort({ appliedOn: -1 })
      .limit(5);

    // Recent attendance
    const recentAttendance = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(5);

    // Current month salary
    const payroll = await Payroll.findOne({
      employeeId: employee._id,
      month: currentMonth,
      year: currentYear
    });

    res.json({
      success: true,
      data: {
        workingDays: totalDays,
        presentDays,
        attendancePercentage: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0,
        currentMonthSalary: payroll ? payroll.net : 0,
        salaryStatus: payroll ? payroll.status : 'Pending',
        recentAttendance,
        leaveRequests
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/hr
// @desc    Get HR dashboard stats
// @access  Private (HR/Admin)
router.get('/hr', authorize('admin', 'hr'), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total employees
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });

    // Today's attendance
    const todayAttendance = await Attendance.find({ date: today })
      .populate('employeeId', 'name email employeeId');
    
    const presentToday = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;

    // Pending leaves
    const pendingLeaves = await Leave.find({ status: 'Pending' })
      .populate('employeeId', 'name email employeeId department')
      .sort({ appliedOn: -1 })
      .limit(5);

    // Recent activities (simplified - you can enhance this)
    const recentLeaves = await Leave.find()
      .populate('employeeId', 'name email employeeId')
      .sort({ appliedOn: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalEmployees,
        presentToday,
        attendancePercentage: totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0,
        pendingLeaves: pendingLeaves.length,
        todayAttendance,
        pendingLeaveRequests: pendingLeaves,
        recentActivities: recentLeaves
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
