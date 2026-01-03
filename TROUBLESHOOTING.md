# Troubleshooting "Route not found" Error

## Quick Checks

### 1. Is the backend server running?

Check if the backend is running on port 5000:

```bash
cd backend
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

### 2. Test the Health Endpoint

Open in browser or use curl:
```
http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

### 3. Check Available Routes

The backend has these routes:

- `/api/health` - Health check (no auth)
- `/api/auth/register` - Register (POST)
- `/api/auth/login` - Login (POST)
- `/api/auth/me` - Get current user (GET, requires auth)
- `/api/employees` - Employee management (requires auth)
- `/api/attendance` - Attendance tracking (requires auth)
- `/api/leaves` - Leave management (requires auth)
- `/api/payroll` - Payroll management (requires auth)
- `/api/dashboard/employee` - Employee dashboard (requires auth)
- `/api/dashboard/hr` - HR dashboard (requires auth, HR/Admin only)

### 4. Common Issues

#### Issue: Backend not running
**Solution:** Start the backend server
```bash
cd backend
npm run dev
```

#### Issue: Wrong URL
**Solution:** Make sure you're calling the full URL:
- Frontend calls: `/auth/login` 
- Full URL: `http://localhost:5000/api/auth/login`
- The `/api` prefix is added by the API_BASE_URL

#### Issue: Missing Authentication
**Solution:** Some routes require authentication. Make sure you:
1. Login first to get a token
2. Token is stored in localStorage
3. Token is included in Authorization header

#### Issue: Route doesn't exist
**Solution:** Check if the route exists in the backend routes files

### 5. Debug Steps

1. **Check browser console** - Look for the exact URL being called
2. **Check Network tab** - See the full request/response
3. **Check backend logs** - See if request reaches the backend
4. **Test with Postman/curl** - Test the route directly

### 6. Test Routes Manually

#### Test Registration (no auth needed):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test","name":"Test User","email":"test@test.com","phone":"1234567890","password":"password123"}'
```

#### Test Login (no auth needed):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

#### Test Health Check:
```bash
curl http://localhost:5000/api/health
```

### 7. Check Environment Variables

Make sure `.env` file exists in backend:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow-hr
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

Make sure `.env` file exists in frontend root:
```
VITE_API_URL=http://localhost:5000/api
```

### 8. CORS Issues

If you see CORS errors, the backend should handle this automatically. If not, check `backend/server.js` has:
```javascript
app.use(cors());
```

## Still Having Issues?

1. Check which exact route is failing (look in browser Network tab)
2. Verify backend server is running and connected to MongoDB
3. Check backend console for any error messages
4. Verify the route exists in the backend routes files
