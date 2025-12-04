# Netlify Deployment - Quick Start Guide

## Your Backend URL
**Backend API:** `https://web-production-11221.up.railway.app`

## Step-by-Step Deployment

### 1. Connect Repository to Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account if not already connected
4. Select repository: **`Prosper-Mapepa/talent-hub-front`**
5. Click **"Import"**

### 2. Configure Build Settings
Netlify should auto-detect Next.js from `netlify.toml`. Verify:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `20` (should be auto-detected)

### 3. Set Environment Variable
**Before deploying**, set the environment variable:

1. In the deployment setup page, click **"Show advanced"** or go to **"Site settings"** → **"Environment variables"**
2. Click **"Add variable"**
3. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://web-production-11221.up.railway.app`
4. Click **"Save"**

### 4. Deploy
1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be live at: `https://[random-name].netlify.app`

### 5. Update Backend CORS (IMPORTANT!)
After deployment, you'll get a Netlify URL like `https://your-site-123.netlify.app`

**Update your Railway backend:**
1. Go to Railway → Your Backend Service → Variables tab
2. Find or add `CORS_ORIGINS`
3. Set value to: `https://your-site-123.netlify.app,https://www.your-site-123.netlify.app`
   - Replace `your-site-123` with your actual Netlify site name
4. Railway will automatically redeploy

**Or add multiple origins:**
```
https://your-site-123.netlify.app,https://www.your-site-123.netlify.app,http://localhost:3000
```

## Verify Deployment

1. **Check Frontend:**
   - Visit your Netlify URL
   - Should see your frontend loading

2. **Check API Connection:**
   - Open browser DevTools → Network tab
   - Try logging in or making an API call
   - Should see requests to `https://web-production-11221.up.railway.app`

3. **Check CORS:**
   - If you see CORS errors in console, make sure `CORS_ORIGINS` is set correctly in Railway

## Custom Domain (Optional)

1. Go to Netlify → Your Site → **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions to add your domain
4. **Don't forget** to update `CORS_ORIGINS` in Railway to include your custom domain!

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify Node.js version is 20
- Check that all dependencies are in `package.json`

### API Calls Fail / CORS Errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Netlify
- Check that `CORS_ORIGINS` in Railway includes your Netlify URL
- Make sure backend is accessible: https://web-production-11221.up.railway.app

### Images Not Loading
- Check that image URLs are using the correct backend URL
- Verify CORS headers on backend allow image requests

## Quick Checklist

- [ ] Repository connected to Netlify
- [ ] `NEXT_PUBLIC_API_URL` environment variable set to `https://web-production-11221.up.railway.app`
- [ ] Site deployed successfully
- [ ] Got Netlify URL (e.g., `https://your-site.netlify.app`)
- [ ] Updated `CORS_ORIGINS` in Railway with Netlify URL
- [ ] Tested frontend → backend connection
- [ ] No CORS errors in browser console

## Your URLs

- **Backend API:** https://web-production-11221.up.railway.app
- **Frontend:** https://[your-netlify-site].netlify.app (after deployment)

