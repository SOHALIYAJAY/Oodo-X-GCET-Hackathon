# Solution: Check-in/Check-out Not Working

## The Problem
You're seeing "Not authorized to access this route" error. This means you need to **login first**.

## Quick Fix

### Step 1: Login to the Application

1. **Go to the login page:**
   - URL: `http://localhost:8080/auth`
   - Or click "Login" if there's a link

2. **Login with your credentials:**
   - If you haven't registered yet, click "Sign Up" first
   - Fill in the registration form
   - After registration, you'll be automatically logged in

3. **After successful login:**
   - You'll be redirected to the dashboard
   - Your authentication token will be saved in browser storage
   - Now you can use check-in/check-out

### Step 2: Try Check-in Again

1. Go to: Employee → Attendance (or `/employee/attendance`)
2. Click the red "Check In" button
3. It should work now!

## Verify You're Logged In

Open browser console (F12) and run:
```javascript
localStorage.getItem('token')
```

**If you see a long string** (like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`): ✅ You're logged in
**If you see `null`**: ❌ You need to login

## If You Already Logged In But Still Getting Error

1. **Clear browser storage and login again:**
   - Open DevTools (F12)
   - Application tab → Local Storage → Clear all
   - Login again

2. **Check backend is running:**
   - Make sure backend server is running
   - Test: `http://localhost:5000/api/health`

3. **Check browser console:**
   - Look for any errors in the console
   - Check Network tab to see if the request is being sent

## Expected Behavior

1. ✅ Login/Register → Token saved
2. ✅ Go to Attendance page
3. ✅ Click "Check In" → Success!
4. ✅ Later, click "Check Out" → Success!

The check-in/check-out functionality requires you to be authenticated (logged in).
