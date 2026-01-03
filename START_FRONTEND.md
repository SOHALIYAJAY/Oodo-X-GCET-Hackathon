# How to Start the Frontend Server

## The Error You're Seeing

"ERR_CONNECTION_REFUSED" means the frontend server is not running. You need to start it first!

## Step 1: Open a Terminal

**Important:** Open a NEW terminal window/tab (keep the backend terminal running)

## Step 2: Navigate to Project Root

Make sure you're in the root directory (not in `backend/` folder):

```bash
cd C:\dayflow-hr-suite-main\dayflow-hr-suite-main
```

Or if you're already in the project folder, make sure you're in the root (where `package.json` is located).

## Step 3: Start the Frontend Server

Run this command:

```bash
npm run dev
```

## Step 4: Wait for Server to Start

You should see output like:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## Step 5: Open in Browser

Once you see the "ready" message, open:
```
http://localhost:8080
```

## If You Get Errors

### Error: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Error: "Cannot find module"
**Solution:** Install dependencies first:
```bash
npm install
```

### Error: Port 8080 already in use
**Solution:** Either:
- Close the application using port 8080, OR
- The terminal will show a different port (like 8081, 8082, etc.) - use that port instead

### Nothing happens when running `npm run dev`
**Solution:** 
- Make sure you're in the correct directory (root, not backend)
- Check if Node.js is installed: `node --version`
- Check if npm is installed: `npm --version`

## Quick Checklist

- [ ] Backend is running (in a separate terminal)
- [ ] You're in the root directory (not `backend/`)
- [ ] Dependencies are installed (`npm install`)
- [ ] Run `npm run dev`
- [ ] Wait for "ready" message
- [ ] Open `http://localhost:8080` in browser

## You Need TWO Terminals Running

1. **Terminal 1:** Backend server (`cd backend && npm run dev`)
2. **Terminal 2:** Frontend server (`npm run dev` in root directory)

Both need to be running at the same time!
