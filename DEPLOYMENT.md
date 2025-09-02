# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository with your code
- Vercel account (free)

## Quick Deploy to Vercel

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Click "New Project"
- Import your repository
- Click "Deploy"

## Environment Variables (Optional)

If you need to set environment variables in Vercel:
- Go to your project settings
- Add these variables:
  - `DATABASE_URL`: `./school_management.db`
  - `NEXTAUTH_SECRET`: Generate a random string

## Database Setup

The SQLite database will be automatically created on first run.

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Database errors**: Ensure SQLite is supported in your hosting plan
- **Image uploads**: Make sure the upload directory is writable

## Alternative Hosting

- **Netlify**: Similar to Vercel, good for static sites
- **Railway**: Good for full-stack apps with databases
- **Render**: Good alternative with free tier
