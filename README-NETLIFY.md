# Netlify Deployment Guide

This frontend is configured for deployment on Netlify.

## Prerequisites

- A Netlify account
- Your backend API deployed (e.g., on Railway)
- GitHub repository connected to Netlify

## Environment Variables

Set the following environment variables in Netlify:

### Required
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app`)

### Optional
- `NODE_ENV` - Set to `production` for production deployments

## Deployment Steps

1. **Connect Repository to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository: `Prosper-Mapepa/talent-hub-front`
   - Select the repository

2. **Configure Build Settings:**
   - Netlify will auto-detect Next.js from `netlify.toml`
   - Build command: `npm run build` (already configured)
   - Publish directory: `.next` (already configured)

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - **Value:** `https://web-production-11221.up.railway.app`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend

## Post-Deployment

1. **Update CORS on Backend:**
   - Add your Netlify domain to the `CORS_ORIGINS` environment variable on Railway
   - Example: `https://your-site.netlify.app,https://www.your-site.netlify.app`

2. **Custom Domain (Optional):**
   - Go to Domain settings in Netlify
   - Add your custom domain
   - Update `CORS_ORIGINS` on backend to include your custom domain

## Build Configuration

The `netlify.toml` file includes:
- Next.js plugin for optimal Next.js support
- Build settings and environment variables
- Redirect rules for client-side routing
- Security headers
- Cache control for static assets

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20)
- Verify all environment variables are set
- Check build logs in Netlify dashboard

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is accessible from the internet

### Images Not Loading
- Verify backend URL is correct
- Check that image domains are allowed in `next.config.ts`
- Ensure backend serves images with proper CORS headers

## Notes

- The Next.js plugin (`@netlify/plugin-nextjs`) is automatically installed during build
- Static assets are cached for 1 year
- All routes redirect to `/index.html` for client-side routing
- Security headers are automatically applied

