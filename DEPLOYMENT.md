# Deployment Instructions

## Backend Deployment (Railway)

1. **Deploy to Railway:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect your Node.js app
   - Set the start command to: `cd server && npm start`

2. **Set Environment Variables in Railway:**
   ```
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   PRODUCTION_URL=https://yourdomain.com
   ```

3. **Get Your Railway URL:**
   - After deployment, Railway will provide a URL like: `https://yourapp-production.railway.app`
   - Note this URL for frontend configuration

## Frontend Deployment (cPanel)

1. **Update Environment Variables:**
   - Edit `.env.production` file
   - Replace `https://your-railway-app.railway.app` with your actual Railway URL

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Upload to cPanel:**
   - Upload the contents of the `build` folder to your cPanel public_html directory
   - Ensure all files including `.htaccess` are uploaded

4. **Create .htaccess file** (if not exists):
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## Dashboard Functionality

✅ **YES, your dashboard will work!** Here's what you need to ensure:

1. **API Endpoints:** Your backend has all necessary endpoints for:
   - Projects management (`/api/projects`)
   - Team management (`/api/team`)
   - Blog management (`/api/blogs`)
   - Client management (`/api/clients`)
   - File uploads (`/api/upload`)

2. **CORS Configuration:** Updated to allow cross-origin requests from your cPanel domain

3. **Image Handling:** The system will properly serve images from Railway backend

## Testing the Connection

1. **Check API Connection:**
   - Open browser developer tools
   - Navigate to your website
   - Check Network tab for API calls
   - Verify 200 status codes from Railway backend

2. **Test Dashboard Features:**
   - Login to dashboard
   - Try adding/editing a project
   - Upload an image
   - Verify changes appear on main website

## Troubleshooting

If you encounter CORS errors:
1. Ensure your domain is in RAILWAY_ALLOWED_ORIGINS
2. Check Railway logs for CORS blocking messages
3. Verify your frontend is using HTTPS (not HTTP)

If images don't load:
1. Check that Railway URL is correct in environment variables
2. Verify uploads folder is created on Railway
3. Check file permissions on uploaded images