# Fix Check-in/Check-out Authentication Issue

## Problem
"Not authorized to access this route" error when trying to check in/check out.

## Solution

### Step 1: Make sure you're logged in

1. Go to the login page: `http://localhost:8080/auth`
2. Login with your credentials (or register if you haven't)
3. After successful login, you'll be redirected and the token will be stored

### Step 2: Verify Token is Stored

Open browser console (F12) and run:
```javascript
localStorage.getItem('token')
```

You should see a long string (JWT token). If it's `null`, you need to login again.

### Step 3: Test the Check-in

After logging in, go to the Attendance page and try checking in again.

## If Still Not Working

1. **Clear browser storage and login again:**
   - Open DevTools (F12)
   - Go to Application tab (Chrome) or Storage tab (Firefox)
   - Clear localStorage
   - Login again

2. **Check backend is running:**
   - Make sure backend server is running on port 5000
   - Test: `http://localhost:5000/api/health`

3. **Check browser console for errors:**
   - Look for any CORS errors
   - Look for network errors
   - Check the actual request being sent

4. **Verify token format:**
   - The token should start with something like: `eyJhbGc...`
   - If it looks different, there might be an issue with how it's stored
