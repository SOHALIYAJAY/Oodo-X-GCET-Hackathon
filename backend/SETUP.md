# Backend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   Create a file named `.env` in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dayflow-hr
   JWT_SECRET=your-secret-key-change-this-in-production-make-it-long-and-random
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - If using MongoDB Atlas, update the `MONGODB_URI` in the `.env` file

4. **Run the Server**
   ```bash
   npm run dev    # Development mode (with auto-reload)
   # or
   npm start      # Production mode
   ```

5. **Test the API**
   - Server should be running on `http://localhost:5000`
   - Test health endpoint: `GET http://localhost:5000/api/health`
   - You should see: `{"status":"OK","message":"Server is running"}`

## API Base URL
- Development: `http://localhost:5000/api`
- Production: Update according to your deployment

## First User Registration
The first user to register will be assigned the 'admin' role. Use the `/api/auth/register` endpoint to create your first admin account.

## Important Notes
- Change `JWT_SECRET` to a strong, random string in production
- Never commit the `.env` file to version control
- The `.env` file is already included in `.gitignore`
