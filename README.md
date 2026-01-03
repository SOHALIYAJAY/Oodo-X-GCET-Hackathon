# Dayflow HR Suite

A full-stack HR management system built with React (Vite), TypeScript, Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Employee management
- Attendance tracking
- Leave management
- Payroll management
- Dashboard with role-based access (Employee, HR Admin)

## Prerequisites

- Node.js (v18+)
- MongoDB (running on localhost:27017)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd dayflow-hr-suite-main
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ..
   npm install
   ```

## Running the Application

1. Ensure MongoDB is running:
   ```bash
   # On Windows (if installed as service)
   net start MongoDB

   # Or start manually
   mongod --dbpath C:\data\db
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run start  # Production
   # or
   npm run dev    # Development with nodemon
   ```
   Backend runs on http://localhost:5000

3. Start the frontend:
   ```bash
   cd ..
   npm run dev
   ```
   Frontend runs on http://localhost:8082 (or next available port)

4. Open http://localhost:8082 in your browser.

## Usage

- Go to /auth to register a new account or login.
- After login, you'll be redirected to the dashboard based on your role.
- First user registered becomes admin (HR role).

## API Endpoints

- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user (requires Bearer token)
- GET /api/health - Health check

## Project Structure

- `backend/` - Node.js/Express API
- `src/` - React frontend
- `public/` - Static assets

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS, Shadcn/ui
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Authentication: JWT tokens stored in localStorage

## License

ISC
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
