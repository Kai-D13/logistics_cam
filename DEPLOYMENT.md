# 🚀 DEPLOYMENT GUIDE - Vercel

## 📋 Prerequisites

- GitHub repository: https://github.com/Kai-D13/logistics_cam.git
- Vercel account (free tier works)
- Mapbox access token

---

## 🔧 DEPLOYMENT STEPS

### **Step 1: Prepare Vercel Account**

1. Go to https://vercel.com/
2. Sign up / Login with GitHub
3. Authorize Vercel to access your GitHub repositories

---

### **Step 2: Import Project**

1. Click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Find and select: `Kai-D13/logistics_cam`
4. Click **"Import"**

---

### **Step 3: Configure Build Settings**

Vercel should auto-detect Vite, but verify:

**Framework Preset:** `Vite`

**Build Settings:**
```
Build Command:       cd frontend && npm install && npm run build
Output Directory:    frontend/dist
Install Command:     npm install
```

**Root Directory:** Leave empty (or set to `/`)

---

### **Step 4: Environment Variables**

Add environment variable for Mapbox:

**Key:** `VITE_MAPBOX_TOKEN`  
**Value:** `pk.eyJ1IjoibmFtbmhmcmVlbGFuY2VyIiwiYSI6ImNtNGdqNGJhNzBhNGsyanNjdGJqNGRqNGgifQ.Ql_Uw_Ql_Uw_Ql_Uw_Ql_Uw`

*(Replace with your actual Mapbox token)*

**How to add:**
1. In project settings
2. Go to **"Environment Variables"**
3. Add variable
4. Click **"Save"**

---

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a URL: `https://logistics-cam-xxx.vercel.app`

---

## ✅ VERIFICATION

### **After Deployment:**

1. Visit the Vercel URL
2. Check that map loads correctly
3. Verify all features work:
   - [ ] Map displays
   - [ ] Hubs visible
   - [ ] Hub selection works
   - [ ] Destinations load
   - [ ] Popups show correct data
   - [ ] Marker sizes scale correctly
   - [ ] Distance calculation works
   - [ ] Routes display

---

## 🐛 TROUBLESHOOTING

### **Issue: Map doesn't load**

**Cause:** Mapbox token not set or invalid

**Solution:**
1. Check Environment Variables in Vercel
2. Verify token is correct
3. Redeploy after adding token

---

### **Issue: Build fails**

**Common causes:**
1. Missing dependencies
2. Build command incorrect
3. Output directory wrong

**Solution:**
```bash
# Check build locally first
cd frontend
npm install
npm run build

# Should create frontend/dist folder
```

---

### **Issue: 404 on routes**

**Cause:** SPA routing not configured

**Solution:**
Verify `vercel.json` has rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### **Issue: Data files not loading**

**Cause:** Public files not in correct location

**Solution:**
Verify files are in `frontend/public/`:
- `frontend/public/destinations.json`
- `frontend/public/hubs.json`
- `frontend/public/markers.json`

---

## 🔄 CONTINUOUS DEPLOYMENT

**Auto-deploy on push:**

Vercel automatically deploys when you push to `main` branch:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel will:
1. Detect the push
2. Build automatically
3. Deploy to production
4. Update the URL

**Preview deployments:**

Every branch/PR gets a preview URL:
- Push to feature branch
- Vercel creates preview deployment
- Test before merging to main

---

## 📊 MONITORING

### **Vercel Dashboard:**

Monitor:
- Build logs
- Deployment status
- Performance metrics
- Error logs

**Access:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. View deployments and analytics

---

## 🔐 SECURITY

### **Environment Variables:**

**Never commit:**
- Mapbox tokens
- API keys
- Secrets

**Always use:**
- Vercel Environment Variables
- `.env` files (gitignored)

---

## 📁 PROJECT STRUCTURE

```
logistics_cam/
├── frontend/
│   ├── public/
│   │   ├── destinations.json  ✅ Deployed
│   │   ├── hubs.json          ✅ Deployed
│   │   └── markers.json       ✅ Deployed
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── geocode-mapbox.js      ❌ Not deployed (dev only)
│   └── package.json
├── vercel.json                 ✅ Vercel config
└── README.md
```

---

## 🎯 DEPLOYMENT CHECKLIST

Before deploying:

- [x] Code pushed to GitHub
- [x] `vercel.json` created
- [x] Data files in `frontend/public/`
- [x] Build tested locally
- [ ] Mapbox token ready
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Environment variables set
- [ ] Deploy button clicked

After deployment:

- [ ] URL accessible
- [ ] Map loads
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable

---

## 🚀 QUICK START

**Fastest way to deploy:**

1. **Login to Vercel:** https://vercel.com/login
2. **Import project:** Click "Add New" → "Project"
3. **Select repo:** `Kai-D13/logistics_cam`
4. **Configure:**
   - Framework: Vite
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
5. **Add env var:** `VITE_MAPBOX_TOKEN`
6. **Deploy:** Click "Deploy"
7. **Wait:** ~2-3 minutes
8. **Done:** Visit your URL!

---

## 📞 SUPPORT

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/vite

**Common Issues:**
- Build errors: Check build logs in Vercel dashboard
- Runtime errors: Check browser console (F12)
- Data loading: Verify public files are deployed

**Need help?**
- Vercel Discord: https://vercel.com/discord
- Vercel Support: https://vercel.com/support

---

## 🎉 SUCCESS!

**Your app is now live at:**
```
https://logistics-cam-xxx.vercel.app
```

**Share with users for testing!**

**Features available:**
- ✅ Interactive map with Mapbox
- ✅ Hub and destination visualization
- ✅ Dynamic marker sizing
- ✅ Distance calculation
- ✅ Route visualization
- ✅ Cross-hub mode
- ✅ Filters by province/district/ward
- ✅ Carrier type differentiation (2PL/3PL)

---

**Date:** 2025-10-25  
**Repository:** https://github.com/Kai-D13/logistics_cam.git  
**Status:** ✅ Ready for deployment

