# Vercel Deployment Guide

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Import Project to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Environment Variables (if needed):**
   - Add any environment variables in the Vercel dashboard
   - Currently, no environment variables are required

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **For Production:**
   ```bash
   vercel --prod
   ```

## Important Notes

### Function Timeout
- The audit API route has a 60-second timeout configured in `vercel.json`
- If audits take longer, consider optimizing or using a different approach

### Dependencies
- Puppeteer and Lighthouse are included but may not work in serverless functions
- The current implementation uses axios and cheerio which work fine on Vercel
- If you need Puppeteer, consider using Vercel's Edge Functions or external services

### Build Optimization
- The project is configured for optimal Next.js builds
- Static assets (logo) are in the `public` folder
- All dependencies are properly configured

## Post-Deployment

1. **Test your deployment:**
   - Visit your Vercel URL
   - Test the audit functionality
   - Check console for any errors

2. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed

3. **Monitor:**
   - Check Vercel Analytics
   - Monitor function execution times
   - Review error logs if any issues occur

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Review build logs in Vercel dashboard
- Ensure all dependencies are in package.json

### Function Timeout
- Increase timeout in vercel.json (max 60s for Hobby plan)
- Optimize audit engine performance
- Consider breaking audits into smaller chunks

### Puppeteer Issues
- Puppeteer may not work in Vercel's serverless environment
- Consider using @sparticuz/chromium or external services
- Current implementation doesn't require Puppeteer

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **This Project**: Review the codebase and error logs

