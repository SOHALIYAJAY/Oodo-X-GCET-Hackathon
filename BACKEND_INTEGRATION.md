# Backend Integration Guide

This document provides instructions for integrating the backend API with the frontend pages that haven't been updated yet.

## Already Integrated Pages

✅ **Auth.tsx** - Login and Registration
✅ **EmployeeDashboard.tsx** - Employee dashboard with stats
✅ **EmployeeAttendance.tsx** - Check-in/Check-out functionality
✅ **ApplyLeave.tsx** - Leave application and history

## Pages That Need Integration

### 1. Employee Profile (`src/pages/employee/EmployeeProfile.tsx`)
- Use `authService.getCurrentUser()` to get current user info
- Use `employeeService.getById()` if needed

### 2. Salary Page (`src/pages/employee/SalaryPage.tsx`)
- Use `payrollService.getMySalary(month, year)` to fetch salary
- Display salary information from the API response

### 3. HR Dashboard (`src/pages/hr/HRDashboard.tsx`)
- Use `dashboardService.getHRDashboard()` to get HR dashboard data
- Similar pattern to EmployeeDashboard but using HR endpoint

### 4. Employee Management (`src/pages/hr/EmployeeManagement.tsx`)
- Use `employeeService.getAll()` to fetch employees
- Use `employeeService.create()` to add new employees
- Use `employeeService.update()` to update employees
- Use `employeeService.delete()` to delete employees
- Use React Query for data fetching and mutations

### 5. Attendance Management (`src/pages/hr/AttendanceManagement.tsx`)
- Use `attendanceService.getAll()` to fetch all attendance records
- Use `attendanceService.update()` to update attendance records
- Filter by date, employee, etc.

### 6. Leave Approval (`src/pages/hr/LeaveApproval.tsx`)
- Use `leaveService.getAll()` to fetch all leave requests
- Use `leaveService.approve(id)` to approve leaves
- Use `leaveService.reject(id, rejectionReason)` to reject leaves
- Filter by status (Pending, Approved, Rejected)

### 7. Payroll Management (`src/pages/hr/PayrollManagement.tsx`)
- Use `payrollService.getAll()` to fetch all payroll records
- Use `payrollService.create()` to create payroll records
- Use `payrollService.update()` to update payroll
- Use `payrollService.markAsPaid(id)` to mark as paid

## Integration Pattern

All pages should follow this pattern:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceName } from "@/services/serviceName.service";

// In component:
const queryClient = useQueryClient();

// For fetching data:
const { data, isLoading, error } = useQuery({
  queryKey: ['query-key'],
  queryFn: () => serviceName.method(),
});

// For mutations (create, update, delete):
const mutation = useMutation({
  mutationFn: (data) => serviceName.method(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['query-key'] });
    // Show success toast
  },
  onError: (error) => {
    // Show error toast
  },
});
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Authentication

The API automatically includes the JWT token from localStorage in requests. Make sure users are logged in before accessing protected routes.

## Error Handling

All API errors are caught and displayed via toast notifications. The API service functions throw errors that should be caught in the mutation's `onError` callback.

## Testing

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Register a new user or login
4. Test all features

## Notes

- All API responses follow the pattern: `{ success: boolean, data: T }` or `{ success: boolean, data: T[], count: number }`
- Dates are handled as ISO strings - use `date-fns` format function to display
- The backend returns employee IDs as `_id` (MongoDB ObjectId)
- Employee IDs are also stored as `employeeId` (string like "EMP001")
