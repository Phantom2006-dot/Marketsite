# Frontend Deployment Guide

This guide explains how to deploy the frontend separately from the backend and connect it to a remote backend API.

## Overview

The frontend is built with React and Vite, and can be deployed independently to a static hosting service while connecting to your backend API hosted elsewhere.

## Prerequisites

- Node.js 20+
- npm or yarn
- A backend API running (can be Replit or any other service)
- A static hosting provider (Vercel, Netlify, GitHub Pages, AWS S3, etc.)

## Setup

### 1. Configure Backend API URL

The frontend needs to know where your backend API is located. Update the API base URL:

**For Development:**
```bash
# In your .env.local file (create if it doesn't exist)
VITE_API_URL=http://localhost:5000
```

**For Production:**
```bash
# In your deployment platform's environment variables
VITE_API_URL=https://your-backend-api.com
```

### 2. Build the Frontend

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Deployment Options

### Option A: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-api.com
   VITE_ADMIN_PASSWORD=your-admin-password
   ```
3. Vercel automatically detects the build command and deploys

### Option B: Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Option C: GitHub Pages

```bash
# Build the project
npm run build

# Deploy the dist folder to GitHub Pages
npm install -g gh-pages
gh-pages -d dist
```

### Option D: Static Hosting (AWS S3, CloudFlare, etc.)

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your static host
3. Configure your hosting to serve `index.html` for all routes (required for client-side routing)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com` |
| `VITE_ADMIN_PASSWORD` | Admin login password | `YourSecurePassword` |

## API Connection Details

The frontend makes API requests to your backend at:
- `/api/settings`
- `/api/products`
- `/api/categories`
- `/api/hero-images`
- `/login` (for admin authentication)

Ensure your backend CORS settings allow requests from your frontend domain.

## Backend CORS Configuration

If your backend is on a different domain, ensure it allows cross-origin requests:

```typescript
// In your Express server
app.use(cors({
  origin: "https://your-frontend-domain.com",
  credentials: true
}));
```

## Admin Login Credentials

- **Username:** `admin`
- **Password:** Use the value set in `VITE_ADMIN_PASSWORD` environment variable

## Troubleshooting

### API requests failing
- Check that `VITE_API_URL` is correct
- Verify backend CORS settings
- Check browser console for error messages

### Environment variables not loading
- Ensure variables start with `VITE_` prefix
- Rebuild the project after changing env vars
- Clear browser cache

### 404 on page refresh
- Configure your hosting to serve `index.html` for all routes
- This is required for client-side routing with wouter

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173`
