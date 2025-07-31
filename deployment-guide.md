# NAMAS Architecture Website Deployment Guide

## Railway Deployment (Recommended)

### Prerequisites
- GitHub account with your code repository
- Railway account (sign up at railway.app)

### Step 1: Prepare Your Project

#### Frontend Configuration
1. Update your React app's API endpoint for production:

```javascript
// src/utils/config.js
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.railway.app'
    : 'http://localhost:5000'
};

export default config;
```

#### Backend Configuration
2. Update your Express server for production deployment:

```javascript
// server/server.js - Add this at the top
const path = require('path');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}
```

3. Create a root-level package.json for combined deployment:

```json
{
  "name": "namas-architecture-full",
  "version": "1.0.0",
  "scripts": {
    "build": "npm install && npm run build:client && npm run build:server",
    "build:client": "npm install && npm run build",
    "build:server": "cd server && npm install",
    "start": "cd server && npm start",
    "dev": "concurrently \"npm start\" \"cd server && npm run dev\""
  },
  "dependencies": {
    "concurrently": "^7.6.0"
  }
}
```

### Step 2: Deploy to Railway

1. **Connect Repository**
   - Go to railway.app and sign in with GitHub
   - Click "Deploy from GitHub repo"
   - Select your NAMAS Architecture repository

2. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   ALLOWED_ORIGINS=https://your-frontend-domain.railway.app
   PRODUCTION_URL=https://your-domain.railway.app
   ```

3. **Deploy Services**
   - Railway will automatically detect your Node.js application
   - It will run the build and start scripts
   - Your app will be available at a railway.app subdomain

### Step 3: Custom Domain (Optional)
1. In Railway dashboard, go to Settings > Networking
2. Add your custom domain
3. Update DNS records as instructed

### Step 4: Dashboard Access
Your dashboard will be accessible at:
```
https://your-domain.railway.app/dashboard
```

## Alternative: Vercel + Railway Separation

### Frontend on Vercel
1. Connect your GitHub repo to Vercel
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Backend on Railway
1. Create a separate Railway service for your server folder
2. Set environment variables for database and CORS origins

## Alternative: Netlify + Backend Hosting

### Frontend on Netlify
1. Connect GitHub repository
2. Build settings:
   - Base directory: `/`
   - Build command: `npm run build`
   - Publish directory: `build`

3. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

### Backend Options
- **Railway**: Best for Express.js apps
- **Render**: Good free tier
- **DigitalOcean App Platform**: Production-ready

## Database Upgrade Recommendation

Consider upgrading from file-based storage to a proper database:

### Railway PostgreSQL
```javascript
// Add to server/package.json
"dependencies": {
  "pg": "^8.8.0",
  "sequelize": "^6.25.0"
}
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Monitoring and Updates

### Automatic Updates
- Push to your main branch
- Railway/Vercel automatically rebuilds and deploys
- Zero downtime deployments

### Dashboard Features That Work Post-Deployment
✅ Project Management
✅ Team Member Updates  
✅ Blog Post Creation
✅ Media File Uploads
✅ Client Information Updates
✅ Hero Banner Management

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **File Uploads**: Configure proper file size limits
3. **Authentication**: Secure your dashboard with proper login
4. **HTTPS**: All platforms provide SSL certificates
5. **CORS**: Configure allowed origins properly

## Cost Breakdown

### Railway (Recommended)
- **Free Tier**: $0/month (hobby projects)
- **Pro Plan**: $5/month (production apps)
- **Team Plan**: $20/month (multiple developers)

### Vercel + Railway
- **Vercel Frontend**: Free for personal use
- **Railway Backend**: $5/month
- **Total**: ~$5/month

### Netlify + Railway
- **Netlify Frontend**: Free tier available
- **Railway Backend**: $5/month  
- **Total**: ~$5/month

## Support and Troubleshooting

### Common Issues
1. **CORS Errors**: Update `ALLOWED_ORIGINS` environment variable
2. **File Upload Issues**: Check disk space and file size limits
3. **Dashboard Not Loading**: Verify API endpoints and authentication

### Getting Help
- Railway: Discord community + documentation
- Vercel: GitHub discussions + documentation  
- Netlify: Community forums + support docs

## Next Steps After Deployment

1. **Set up monitoring** for uptime and performance
2. **Configure backup strategies** for your data files
3. **Set up domain and SSL** for professional appearance
4. **Test dashboard functionality** thoroughly
5. **Create deployment documentation** for your team

Your dashboard will allow you to update:
- Project portfolios
- Team member information
- Blog posts and news
- Client testimonials
- Media galleries
- Hero banners and content

All updates will be reflected immediately on your live website!