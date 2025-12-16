# Quick Deploy to Vercel

## Fastest Method (5 minutes)

### Step 1: Push to GitHub
```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository
4. Click "Deploy" (settings are auto-detected)
5. Wait 2-3 minutes
6. Done! Your app is live 🎉

## Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

## What's Configured

✅ `vercel.json` - Function timeout settings
✅ `next.config.js` - Optimized for Vercel
✅ `.vercelignore` - Excludes unnecessary files
✅ Build scripts ready in `package.json`

## After Deployment

Your app will be available at:
- `https://your-project-name.vercel.app`

You can:
- Add a custom domain in Vercel dashboard
- Monitor performance in Vercel Analytics
- View logs in Vercel dashboard

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.

