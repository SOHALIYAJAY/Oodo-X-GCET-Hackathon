import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Employee from './models/Employee.model.js';

dotenv.config();

const dummyEmployees = [
  {
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91-9876543210',
    department: 'Engineering',
    role: 'Software Developer',
    password: 'password123'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91-9876543211',
    department: 'Marketing',
    role: 'Marketing Specialist',
    password: 'password123'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91-9876543212',
    department: 'HR',
    role: 'HR Manager',
    password: 'password123'
  },
  {
    name: 'Sunita Singh',
    email: 'sunita.singh@example.com',
    phone: '+91-9876543213',
    department: 'Finance',
    role: 'Financial Analyst',
    password: 'password123'
  },
  {
    name: 'Vikram Gupta',
    email: 'vikram.gupta@example.com',
    phone: '+91-9876543214',
    department: 'Engineering',
    role: 'Senior Developer',
    password: 'password123'
  },
  {
    name: 'Anjali Reddy',
    email: 'anjali.reddy@example.com',
    phone: '+91-9876543215',
    department: 'Design',
    role: 'UI/UX Designer',
    password: 'password123'
  },
  {
    name: 'Karan Mehta',
    email: 'karan.mehta@example.com',
    phone: '+91-9876543216',
    department: 'Sales',
    role: 'Sales Executive',
    password: 'password123'
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    phone: '+91-9876543217',
    department: 'Engineering',
    role: 'DevOps Engineer',
    password: 'password123'
  }
];

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dayflow-hr');
    console.log('Connected to MongoDB');

    for (const emp of dummyEmployees) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: emp.email });
      if (existingUser) {
        console.log(`User ${emp.email} already exists, skipping...`);
        continue;
      }

      // Generate employee ID
      const employeeCount = await Employee.countDocuments();
      const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

      // Create user
      const user = await User.create({
        companyName: 'Dayflow HR',
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        password: emp.password,
        role: 'employee'
      });

      // Create employee
      await Employee.create({
        employeeId,
        userId: user._id,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        role: emp.role,
        status: 'Active',
        joinDate: new Date()
      });

      console.log(`Created employee: ${emp.name} (${employeeId})`);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedEmployees();