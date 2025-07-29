# 🔧 Nodemon Restart Loop - FIXED!

## ❌ **The Problem:**
When running `npm run dev`, nodemon was restarting continuously because:

1. Server creates `data/projects.json` → nodemon detects file change → restarts
2. Server creates backup in `backups/` → nodemon detects file change → restarts  
3. **Infinite restart loop** 🔄

## ✅ **The Solution:**

### 1. Created `nodemon.json` config file:
```json
{
  "watch": ["*.js", "*.json"],
  "ignore": [
    "data/**/*",      ← Ignore data files
    "backups/**/*",   ← Ignore backup files
    "uploads/**/*",   ← Ignore uploaded files
    "node_modules/**/*",
    "*.log"
  ],
  "ext": "js,json",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

### 2. Updated package.json scripts:
```json
{
  "scripts": {
    "dev": "npx nodemon --config nodemon.json server.js",
    "dev:verbose": "npx nodemon --config nodemon.json --verbose server.js"
  }
}
```

### 3. Modified backup frequency for development:
- **Development**: Backup every 10 minutes (less frequent)
- **Production**: Backup every hour

## 🧪 **Test it:**

```bash
cd server
npm run dev
```

**Expected behavior:**
- ✅ Server starts once
- ✅ No restart loops
- ✅ Only restarts when you modify `.js` files
- ✅ Ignores data/backup file changes

## 🎯 **What nodemon now watches:**
- ✅ `server.js` - main server file
- ✅ `data-backup.js` - backup utility
- ✅ `*.js` files - your code changes

## 🚫 **What nodemon ignores:**
- ❌ `data/projects.json` - data files
- ❌ `backups/` - backup directories  
- ❌ `uploads/` - uploaded images
- ❌ `node_modules/` - dependencies

## 🔧 **Commands available:**
```bash
npm run dev          # Normal development with nodemon
npm run dev:verbose  # Verbose output for debugging
npm start           # Production mode (no nodemon)
```

**Result: Clean development experience with no restart loops!** ✨