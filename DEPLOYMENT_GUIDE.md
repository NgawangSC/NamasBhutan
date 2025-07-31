# cPanel Deployment Guide

## Problem Fixed
The "Unable to connect to server" error was caused by:
- Frontend trying to connect to `localhost:5000` in production
- Backend server not running on cPanel
- CORS configuration only allowing localhost

## Solution Overview
Updated the configuration to:
1. Use environment variables for API URLs
2. Automatically detect production vs development
3. Allow your production domain in CORS

## Deployment Steps

### Step 1: Update Environment Configuration
1. Open `.env.production` file
2. Replace `yourdomain.com` with your actual cPanel domain
   ```
   REACT_APP_API_URL=https://youractualsite.com/api
   REACT_APP_SERVER_URL=https://youractualsite.com
   PRODUCTION_URL=https://youractualsite.com
   ALLOWED_ORIGINS=https://youractualsite.com,https://www.youractualsite.com
   ```

### Step 2: Build for Production
```bash
# Install dependencies
npm install

# Build the React app for production
npm run build

# The build folder contains your production files
```

### Step 3: Deploy to cPanel

#### Option A: Static Frontend Only (Recommended for cPanel)
1. Upload the contents of the `build` folder to your cPanel public_html directory
2. The dashboard will work for viewing data, but editing won't work without a backend

#### Option B: Full Stack Deployment (If cPanel supports Node.js)
1. Check if your cPanel hosting supports Node.js applications
2. If yes:
   - Upload both frontend build files and server files
   - Install Node.js dependencies on the server
   - Configure the Node.js app to run on your domain
   - Set up the API endpoint routing

### Step 4: Alternative Backend Solutions

If cPanel doesn't support Node.js, consider these options:

1. **Use a separate backend service:**
   - Deploy the server to Heroku, Railway, or Vercel
   - Update `.env.production` with the backend URL
   
2. **Convert to serverless functions:**
   - Convert API endpoints to serverless functions
   - Use services like Netlify Functions or Vercel Functions

3. **Use a headless CMS:**
   - Replace the custom backend with Strapi, Sanity, or Contentful
   - Update the API service to connect to the CMS

### Step 5: Testing
1. After deployment, open your website dashboard
2. Try to save a project or make any change
3. Check browser developer tools (F12) for any errors
4. Verify the API calls are going to the correct URL

## Troubleshooting

### Common Issues:
1. **"Unable to connect to server"** - Backend not running or wrong URL
2. **CORS errors** - Domain not added to ALLOWED_ORIGINS
3. **404 errors on API calls** - API routes not properly configured

### Quick Fixes:
1. Verify your domain in environment files
2. Check if cPanel supports Node.js apps
3. Ensure API endpoints are accessible
4. Test API calls manually using browser developer tools

## Next Steps
Choose one of the deployment options above based on your cPanel hosting capabilities. Most shared hosting providers don't support Node.js, so you may need Option A or a separate backend service.