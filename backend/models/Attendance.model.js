import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  workHours: {
    type: Number, // in minutes
    default: 0
  },
  extraHours: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'On Leave'],
    default: 'Absent'
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
