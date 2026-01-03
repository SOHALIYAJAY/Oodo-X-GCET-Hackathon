# Dayflow HR Suite Backend API

Backend API for the Dayflow HR Management System built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT-based)
- Employee management (CRUD operations)
- Attendance tracking (check-in/check-out)
- Leave management (apply, approve, reject)
- Payroll management
- Dashboard statistics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow-hr
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Make sure MongoDB is running on your system or update `MONGODB_URI` to point to your MongoDB instance.

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee (HR/Admin)
- `PUT /api/employees/:id` - Update employee (HR/Admin)
- `DELETE /api/employees/:id` - Delete employee (HR/Admin)

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-attendance` - Get user's attendance
- `GET /api/attendance` - Get all attendance (HR/Admin)
- `PUT /api/attendance/:id` - Update attendance (HR/Admin)

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-leaves` - Get user's leaves
- `GET /api/leaves` - Get all leaves (HR/Admin)
- `GET /api/leaves/:id` - Get single leave
- `PUT /api/leaves/:id/approve` - Approve leave (HR/Admin)
- `PUT /api/leaves/:id/reject` - Reject leave (HR/Admin)

### Payroll
- `GET /api/payroll/my-salary` - Get user's salary
- `GET /api/payroll` - Get all payroll (HR/Admin)
- `POST /api/payroll` - Create payroll (HR/Admin)
- `PUT /api/payroll/:id` - Update payroll (HR/Admin)
- `PUT /api/payroll/:id/mark-paid` - Mark as paid (HR/Admin)

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/hr` - HR dashboard stats

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns errors in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Models

- **User** - User accounts with authentication
- **Employee** - Employee information
- **Attendance** - Attendance records
- **Leave** - Leave requests
- **Payroll** - Salary and payroll records

## Notes

- The first registered user is automatically assigned the 'admin' role
- Employee IDs are auto-generated (EMP001, EMP002, etc.)
- Attendance records are unique per employee per day
- Payroll records are unique per employee per month/year
