# Frontend-Backend Integration Complete

The backend has been successfully integrated with the frontend application.

## What's Been Integrated

### ✅ Completed Integrations

1. **API Service Layer** (`src/services/`)
   - `auth.service.ts` - Authentication (login, register, getCurrentUser)
   - `employee.service.ts` - Employee CRUD operations
   - `attendance.service.ts` - Attendance tracking (check-in/check-out)
   - `leave.service.ts` - Leave management
   - `payroll.service.ts` - Payroll management
   - `dashboard.service.ts` - Dashboard statistics

2. **API Configuration** (`src/lib/api.ts`)
   - API base URL configuration
   - JWT token management (localStorage)
   - Request/response helpers
   - Error handling

3. **Updated Pages**
   - ✅ `Auth.tsx` - Login and Registration
   - ✅ `EmployeeDashboard.tsx` - Employee dashboard with real data
   - ✅ `EmployeeAttendance.tsx` - Check-in/Check-out functionality
   - ✅ `ApplyLeave.tsx` - Leave application and history

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env file (see backend/SETUP.md)
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
npm install
npm run dev
```

Frontend runs on: `http://localhost:8080` (or check terminal output)

## Usage

1. **Register a new user** (first user becomes admin)
2. **Login** with your credentials
3. **Use the application** - all integrated pages now use real backend data

## API Services Usage Examples

### Authentication
```typescript
import { authService } from '@/services/auth.service';

// Login
await authService.login({ email, password });

// Register
await authService.register({ companyName, name, email, phone, password });

// Get current user
const user = await authService.getCurrentUser();
```

### Employee Management
```typescript
import { employeeService } from '@/services/employee.service';

// Get all employees
const employees = await employeeService.getAll();

// Create employee
await employeeService.create({ name, email, department, role });

// Update employee
await employeeService.update(id, { name, email });

// Delete employee
await employeeService.delete(id);
```

### Attendance
```typescript
import { attendanceService } from '@/services/attendance.service';

// Check in
await attendanceService.checkIn();

// Check out
await attendanceService.checkOut();

// Get my attendance
const records = await attendanceService.getMyAttendance();
```

### Leaves
```typescript
import { leaveService } from '@/services/leave.service';

// Apply for leave
await leaveService.create({ type, from, to, reason });

// Get my leaves
const leaves = await leaveService.getMyLeaves();

// Approve leave (HR)
await leaveService.approve(leaveId);

// Reject leave (HR)
await leaveService.reject(leaveId, rejectionReason);
```

### Payroll
```typescript
import { payrollService } from '@/services/payroll.service';

// Get my salary
const salary = await payrollService.getMySalary(month, year);

// Get all payroll (HR)
const payroll = await payrollService.getAll(month, year);

// Mark as paid (HR)
await payrollService.markAsPaid(payrollId);
```

## React Query Integration

All data fetching uses React Query for caching and state management:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['my-data'],
  queryFn: () => service.getData(),
});

// Mutate data
const mutation = useMutation({
  mutationFn: (data) => service.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['my-data'] });
  },
});
```

## Remaining Pages to Integrate

The following pages still need backend integration (see `BACKEND_INTEGRATION.md` for details):

- Employee Profile
- Salary Page  
- HR Dashboard
- Employee Management (HR)
- Attendance Management (HR)
- Leave Approval (HR)
- Payroll Management (HR)

These can be integrated following the same patterns used in the completed pages.

## Troubleshooting

### CORS Errors
Make sure the backend CORS is enabled (already configured in `backend/server.js`)

### Authentication Errors
- Check if token is stored in localStorage
- Verify JWT_SECRET in backend .env matches
- Check if token expired (default: 7 days)

### API Connection Errors
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for detailed error messages

## Next Steps

1. Complete integration of remaining HR pages
2. Add error boundaries for better error handling
3. Add loading states to all pages
4. Implement route protection based on user roles
5. Add form validation using zod (already installed)
6. Add optimistic updates for better UX
