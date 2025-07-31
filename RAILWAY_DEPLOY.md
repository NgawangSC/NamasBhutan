# Railway Deployment Guide

## Fixed: "cd executable not found" Error

The issue was that Railway couldn't execute shell commands like `cd`. I've restructured the project to work with Railway's deployment system.

## What Changed:

1. **Moved server to root level**: Created `server-main.js` in the root directory
2. **Updated package.json**: Added server dependencies to the main package.json
3. **Fixed file paths**: Updated all paths to work from the root directory
4. **Simplified Procfile**: Now just uses `npm start`

## Deploy to Railway:

1. **Push these changes to your GitHub repository**
2. **In Railway Dashboard:**
   - Connect your GitHub repo
   - Railway will auto-detect it's a Node.js project
   - It will use the `Procfile` to start the server

3. **Set Environment Variables in Railway:**
   ```
   NODE_ENV=production
   PORT=5000
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   PRODUCTION_URL=https://yourdomain.com
   ```

4. **Deploy**: Railway will automatically:
   - Install dependencies from package.json
   - Run `npm start` which executes `node server-main.js`
   - Your server will be available at `https://yourapp-production.railway.app`

## For Frontend (cPanel):

Update your `.env.production` with the Railway URL:
```
REACT_APP_API_URL=https://yourapp-production.railway.app/api
REACT_APP_SERVER_URL=https://yourapp-production.railway.app
```

Then build and upload to cPanel:
```bash
npm run build
# Upload contents of 'build' folder to cPanel
```

## Verification:

After deployment, test:
- `https://yourapp-production.railway.app/` (should show API info)
- `https://yourapp-production.railway.app/api/projects` (should return projects data)

Your dashboard will now work seamlessly between cPanel frontend and Railway backend!