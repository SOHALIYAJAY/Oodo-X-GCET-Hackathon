# Quick Fix for "Route not found" Error

## ✅ FIXED: Backend .env File Created

The backend `.env` file has been created. Now follow these steps:

## Step 1: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

## Step 2: Verify Backend is Running

Open in browser:
```
http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

## Step 3: Common Causes of "Route not found"

### Cause 1: Backend Server Not Running
**Fix:** Start the backend server (Step 1 above)

### Cause 2: Wrong Route Path
**Fix:** Make sure you're calling the correct route. Check:
- Frontend service files use: `/auth/login`
- Backend routes are: `/api/auth/login`
- The `/api` prefix is automatically added by `API_BASE_URL`

### Cause 3: Route Requires Authentication
**Fix:** Login first to get a token, then the route will work

### Cause 4: MongoDB Not Running
**Fix:** Start MongoDB or update `MONGODB_URI` in `backend/.env` to point to your MongoDB instance

## Step 4: Test the Routes

### Test Health (No auth needed):
```
GET http://localhost:5000/api/health
```

### Test Registration (No auth needed):
```
POST http://localhost:5000/api/auth/register
Body:
{
  "companyName": "Test Company",
  "name": "Test User",
  "email": "test@test.com",
  "phone": "1234567890",
  "password": "password123"
}
```

### Test Login (No auth needed):
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "test@test.com",
  "password": "password123"
}
```

## Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make the request that's failing
4. Check:
   - What URL is being called
   - What status code you get
   - What the response is

## Step 6: Check Backend Console

Look at the terminal where the backend is running:
- Are there any error messages?
- Does the request reach the backend?
- Is MongoDB connected?

## Still Not Working?

1. **Make sure backend is running** - Check terminal
2. **Check MongoDB** - Make sure MongoDB is running
3. **Check the exact route** - Look in browser Network tab
4. **Check backend logs** - Look for errors in backend terminal

## Quick Checklist

- [ ] Backend `.env` file exists (✅ Created)
- [ ] MongoDB is running
- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend `.env` file exists (✅ Already exists)
- [ ] Test `/api/health` endpoint works
- [ ] Check browser Network tab for the exact URL being called
