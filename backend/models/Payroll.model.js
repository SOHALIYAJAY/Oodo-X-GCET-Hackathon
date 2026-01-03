import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basic: {
    type: Number,
    required: true,
    default: 0
  },
  allowance: {
    type: Number,
    default: 0
  },
  deduction: {
    type: Number,
    default: 0
  },
  net: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);
