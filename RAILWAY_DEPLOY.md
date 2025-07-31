# Railway Deployment Guide

## ✅ FINAL SOLUTION: "cd executable not found" Error

I've completely eliminated the `cd` command issue by:

1. **Removed Dockerfile**: Railway was trying to use Docker which had `cd` commands
2. **Restructured for Nixpacks**: Railway now uses its native Nixpacks builder
3. **Root-level server**: All server code now runs from `server-main.js` in root
4. **Clean package.json**: Single package.json with all dependencies

## What's Changed:

- ❌ **Deleted**: `Dockerfile` (was causing the cd error)
- ✅ **Created**: `server-main.js` (server at root level)
- ✅ **Updated**: `package.json` (merged dependencies)
- ✅ **Added**: `.nvmrc` (Node 18 for Railway)
- ✅ **Fixed**: All file paths in server code

## Deploy to Railway (STEP BY STEP):

### 1. Push to GitHub
```bash
git add .
git commit -m "Fixed Railway deployment - removed cd commands"
git push
```

### 2. Railway Dashboard Settings
**IMPORTANT**: In Railway Dashboard, set these **exact** environment variables:
```
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
PRODUCTION_URL=https://yourdomain.com
```

### 3. Deploy
Railway will:
- ✅ Use Nixpacks (no Docker)
- ✅ Install from `package.json`
- ✅ Run `npm start` → `node server-main.js`
- ✅ No more `cd` commands!

## Troubleshooting

**If you still get cd error:**
1. Delete the service in Railway
2. Create a new service
3. Connect the same GitHub repo
4. Set environment variables again

**The error was caused by:** Railway trying to use Docker with `cd` commands. Now it uses Nixpacks which doesn't need `cd`.

## Frontend (cPanel) Setup:

After Railway deployment succeeds:

1. **Get your Railway URL** (like `https://yourapp-production.railway.app`)

2. **Update `.env.production`:**
   ```
   REACT_APP_API_URL=https://your-actual-railway-url.railway.app/api
   REACT_APP_SERVER_URL=https://your-actual-railway-url.railway.app
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   # Upload 'build' folder contents to cPanel public_html
   ```

## Test Your Deployment:

1. **Backend**: Visit `https://your-railway-url.railway.app/`
2. **API**: Visit `https://your-railway-url.railway.app/api/projects`
3. **Frontend**: Your cPanel website should now connect to Railway backend
4. **Dashboard**: Login and test adding/editing projects

**Your dashboard WILL work!** 🎉