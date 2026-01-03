# Next Steps - Backend is Running! ✅

Since you can see `{"status":"OK","message":"Server is running"}` at `http://localhost:5000/api/health`, your backend is working perfectly!

## Step 1: Start the Frontend Server

Open a **new terminal window** (keep the backend running) and run:

```bash
npm run dev
```

Or if you're using a different package manager:
```bash
npm install  # If you haven't installed dependencies yet
npm run dev
```

The frontend should start on `http://localhost:8080` (or check the terminal for the exact port)

## Step 2: Access the Application

1. Open your browser
2. Go to: `http://localhost:8080` (or the port shown in terminal)
3. You should see the Dayflow HR application

## Step 3: Register Your First User

1. Click on "Sign Up" tab
2. Fill in the registration form:
   - Company Name
   - Full Name
   - Email
   - Phone
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create Account"

**Note:** The first user registered becomes an **admin** automatically.

## Step 4: Login

1. After registration, you'll be automatically logged in
2. Or use the "Login" tab to login with your credentials

## Step 5: Explore the Application

Once logged in, you can:

### As Admin (First User):
- **HR Dashboard** - View all employee statistics
- **Employee Management** - Add, edit, delete employees
- **Attendance Management** - View and manage attendance
- **Leave Approval** - Approve/reject leave requests
- **Payroll Management** - Manage salaries

### Employee Features:
- **Employee Dashboard** - View your stats
- **Attendance** - Check in/Check out
- **Apply Leave** - Request leave
- **Salary** - View your salary information
- **Profile** - View your profile

## Step 6: Test the Integration

1. **Test Check-in/Check-out:**
   - Go to Employee → Attendance
   - Click "Check In"
   - Later, click "Check Out"

2. **Test Leave Application:**
   - Go to Employee → Leave
   - Click "Apply Leave"
   - Fill the form and submit

3. **Test Employee Management (Admin):**
   - Go to HR → Employees
   - Click "Add Employee"
   - Fill the form and create an employee

## Troubleshooting

### Frontend won't start?
- Make sure you're in the root directory (not in `backend/`)
- Run `npm install` first if needed
- Check if port 8080 is already in use

### Can't see the application?
- Check the terminal for the correct port number
- Make sure the frontend server is running
- Check browser console for errors

### API calls failing?
- Make sure backend is still running on port 5000
- Check browser console (F12) for errors
- Verify `.env` file exists in root with: `VITE_API_URL=http://localhost:5000/api`

### Login/Registration not working?
- Check browser console for error messages
- Verify backend is running and connected to MongoDB
- Check network tab in browser DevTools to see API calls

## Quick Checklist

- [x] Backend server running on port 5000 ✅
- [x] Health endpoint working ✅
- [ ] Frontend server running on port 8080 (or other)
- [ ] Registered first user
- [ ] Logged in successfully
- [ ] Can see dashboard
- [ ] Can use features (check-in, apply leave, etc.)

## You're All Set!

Your backend and frontend are now integrated. Start the frontend and begin using the application! 🎉
