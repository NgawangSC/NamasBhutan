#!/bin/bash

echo "🚀 Deploying to Railway..."

# Add all changes
git add .

# Commit with a clear message
git commit -m "Fixed Railway deployment - removed cd commands and synced dependencies

- Removed Dockerfile (was causing cd executable error)
- Created server-main.js at root level
- Fixed package.json dependencies and engines
- Regenerated package-lock.json
- Server tested and working locally"

# Push to trigger Railway deployment
git push

echo "✅ Changes pushed to GitHub!"
echo "🔍 Check Railway dashboard for deployment status"
echo "📋 Set these environment variables in Railway:"
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo "   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com"
echo "   PRODUCTION_URL=https://yourdomain.com"