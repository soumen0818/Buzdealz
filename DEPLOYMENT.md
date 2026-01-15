# Deployment Guide - Render (Backend) + Vercel (Frontend)

## Overview

This guide explains how to deploy:

- **Backend (API)** to Render (Free tier with persistent hosting)
- **Frontend (React)** to Vercel (Free tier with CDN)

---

## Prerequisites

1. GitHub account with code pushed to repository
2. Render account (sign up at https://render.com)
3. Vercel account (sign up at https://vercel.com)
4. Supabase database configured and active

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click "New +" button → Select "Web Service"
2. Connect your GitHub repository
3. Select the repository containing your code

### Step 4: Configure Service

Fill in the following settings:

**Basic Configuration:**

- **Name:** `buzdealz-backend` (or your preferred name)
- **Region:** Select closest to your target users
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Instance Type:**

- Select **Free** tier

### Step 5: Add Environment Variables

In the "Environment Variables" section, add these:

```
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
```

**Important:**

- Replace `DATABASE_URL` with your Supabase connection string
- Generate `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `FRONTEND_URL` will be updated after frontend deployment
- `PORT=10000` is Render's default port

### Step 6: Deploy

1. Click "Create Web Service"
2. Wait for initial build (5-10 minutes)
3. Once deployed, note your backend URL: `https://your-app-name.onrender.com`

### Step 7: Run Database Migration

After first successful deployment:

1. Go to your service dashboard on Render
2. Click the "Shell" tab
3. Run migration command:

   ```bash
   npm run db:migrate
   ```

4. (Optional) Seed test data:
   ```bash
   npm run db:seed
   ```

### Step 8: Test Backend

Test the health endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-15T..."
}
```

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update API URL

Edit `client/.env.production` file with your Render backend URL:

```env
VITE_API_URL=https://your-app-name.onrender.com
```

Replace `your-app-name` with your actual Render service name.

### Step 2: Commit Changes

```bash
git add client/.env.production
git commit -m "Update production API URL"
git push origin main
```

### Step 3: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:

   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variable:

   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-app-name.onrender.com`
   - **Environment:** Production

6. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to client directory
cd client

# Deploy
vercel --prod

# Follow prompts and select settings
```

### Step 4: Update Backend CORS

After frontend is deployed:

1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Use your actual Vercel URL)
5. Click "Save Changes"
6. Service will automatically redeploy

### Step 5: Test Deployment

1. Visit your Vercel URL
2. Test all features:
   - User registration
   - Login
   - Browse deals
   - Add to wishlist
   - Toggle alerts (as subscriber)
3. Check browser console for errors
4. Verify API calls are successful

---

## Post-Deployment Configuration

### Configure Logging and Monitoring

**Render Logs:**

1. Go to your Render service dashboard
2. Click "Logs" tab
3. View real-time logs
4. Filter by log level or search terms

**Vercel Logs:**

1. Go to your Vercel project
2. Click on deployment
3. View "Deployment Logs" for build process
4. View "Function Logs" for runtime errors (if using serverless)

### Security Checklist

- [ ] All sensitive credentials in environment variables (not in code)
- [ ] `.env` files added to `.gitignore`
- [ ] JWT_SECRET is strong random string (minimum 32 characters)
- [ ] DATABASE_URL uses SSL connection
- [ ] CORS configured with specific frontend URL
- [ ] API rate limiting enabled (if implemented)
- [ ] HTTPS enforced on both platforms

---

## Troubleshooting

### Backend Issues (Render)

**Build Fails:**

- Check Node.js version compatibility in `package.json`
- Verify all dependencies are in `package.json` (not just devDependencies for production code)
- Check build logs for specific error messages

**Database Connection Fails:**

- Verify DATABASE_URL is correct in environment variables
- Ensure Supabase allows connections from Render IP addresses
- Check SSL configuration in `server/src/db/index.ts`
- Test connection string locally first

**Service Won't Start:**

- Verify `PORT` environment variable is set to 10000
- Check start command is `npm start`
- Ensure `dist/server.js` exists after build
- View logs in Render dashboard

**CORS Errors:**

- Verify FRONTEND_URL environment variable matches Vercel URL
- Check server.ts CORS configuration allows `.vercel.app` domains
- Test with both production URL and preview URLs

### Frontend Issues (Vercel)

**Build Fails:**

- Check all dependencies are installed
- Verify TypeScript has no compilation errors
- Run `npm run build` locally to test
- Check Vercel build logs for specific errors

**API Calls Fail:**

- Verify VITE_API_URL environment variable is set correctly
- Check browser network tab for request URLs
- Ensure backend is deployed and accessible
- Test backend URL directly with curl

**404 on Page Refresh:**

- Verify `vercel.json` has SPA rewrite rules
- Check `client/vercel.json` exists with proper configuration
- Redeploy if configuration was changed

**Environment Variable Not Working:**

- Environment variables must start with `VITE_` prefix
- Redeploy after adding/changing environment variables
- Clear browser cache and hard refresh
- Check variable name doesn't have typos

### Database Issues

**Migration Fails:**

- Ensure DATABASE_URL is accessible from Render
- Check migration files syntax
- Run locally first to verify migrations work
- Check Render Shell logs for specific errors

**Data Not Persisting:**

- Verify database connection is not timing out
- Check connection pool settings
- Ensure transactions are committed
- Review database logs in Supabase dashboard

---

## Performance Optimization

### Render Backend

**Cold Starts (Free Tier):**

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier ($7/month) for always-on
- Use cron job or uptime monitor to keep service warm

**Recommendations:**

- Add request caching where appropriate
- Optimize database queries
- Use connection pooling (already configured)
- Enable compression for responses

### Vercel Frontend

**Already Optimized:**

- Static files served from global CDN
- Automatic code splitting
- Image optimization (if using next/image)
- Compression enabled by default

**Additional Optimizations:**

- Use lazy loading for routes
- Optimize bundle size (analyze with `npm run build`)
- Add service worker for offline capability
- Enable React Query caching (already configured)

---

## Cost Estimates

### Free Tier Limits

**Render Free Tier:**

- 750 hours/month (single service can run 24/7)
- Spins down after 15 minutes inactivity
- Automatic SSL certificates
- No credit card required

**Vercel Free Tier:**

- 100 GB bandwidth/month
- 100 deployments/day
- Automatic SSL certificates
- Unlimited static sites
- No credit card required

**Supabase Free Tier:**

- 500 MB database storage
- 2 GB bandwidth/month
- 50 MB file storage
- Automatic backups (7 days)

### When to Upgrade

**Render:**

- Upgrade to $7/month if you need:
  - Always-on service (no cold starts)
  - More RAM/CPU
  - Faster builds
  - Custom domains (requires paid plan)

**Vercel:**

- Upgrade to $20/month if you exceed:
  - 100 GB bandwidth
  - Need team collaboration
  - Need password protection
  - Advanced analytics

---

## Continuous Deployment

### Automatic Deployments

**Both platforms support automatic deployments from GitHub:**

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Build:**

   - Render: Automatically builds and deploys backend
   - Vercel: Automatically builds and deploys frontend

3. **Preview Deployments (Vercel):**
   - Every pull request gets preview URL
   - Test changes before merging
   - Automatic cleanup after PR closes

### Deployment Best Practices

1. **Use Git Branches:**

   - `main` branch for production
   - `develop` branch for testing
   - Feature branches for new work

2. **Environment Separation:**

   - Create separate services for staging
   - Use different environment variables
   - Test thoroughly before production

3. **Version Control:**

   - Tag releases in Git
   - Keep changelog updated
   - Document breaking changes

4. **Rollback Strategy:**
   - Render: Redeploy previous commit from dashboard
   - Vercel: Promote previous deployment from dashboard
   - Keep backups of database

---

## Maintenance

### Regular Tasks

**Weekly:**

- [ ] Check error logs on both platforms
- [ ] Monitor database usage in Supabase
- [ ] Review security alerts from GitHub
- [ ] Test critical user flows

**Monthly:**

- [ ] Update dependencies (`npm update`)
- [ ] Review and clean up unused code
- [ ] Analyze performance metrics
- [ ] Backup database manually (beyond Supabase auto-backup)

**Quarterly:**

- [ ] Review security best practices
- [ ] Audit third-party packages for vulnerabilities
- [ ] Performance optimization review
- [ ] Cost analysis and optimization

### Database Backups

**Automated Backups (Supabase Free Tier):**

- Daily backups retained for 7 days
- Automatic point-in-time recovery

**Manual Backup:**

```bash
# Using pg_dump (requires PostgreSQL client)
pg_dump -h db.pvhvkuwecszpepbvdjzd.supabase.co -U postgres -d postgres > backup.sql

# Restore from backup
psql -h db.pvhvkuwecszpepbvdjzd.supabase.co -U postgres -d postgres < backup.sql
```

---

## Support Resources

### Documentation

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs

### Community

- **Render Community:** https://community.render.com
- **Vercel Discord:** https://vercel.com/discord
- **Supabase Discord:** https://discord.supabase.com

### Getting Help

1. Check documentation first
2. Search GitHub issues
3. Ask in community forums
4. Contact platform support (paid plans have faster response)

---

## Next Steps

After successful deployment:

1. **Set up monitoring:**

   - Add uptime monitoring (UptimeRobot, Pingdom)
   - Configure error tracking (Sentry)
   - Set up analytics (Google Analytics, Plausible)

2. **Configure custom domain:**

   - Add domain to Vercel (frontend)
   - Add domain to Render (backend)
   - Update CORS and environment variables

3. **Enhance security:**

   - Add rate limiting
   - Implement request validation
   - Set up WAF rules
   - Enable 2FA on all accounts

4. **Optimize performance:**
   - Add Redis caching
   - Implement CDN for assets
   - Optimize database indexes
   - Add query caching

---

## Deployment Checklist

Before going live:

- [ ] All environment variables configured on both platforms
- [ ] Database migrations run successfully
- [ ] Backend health endpoint returns 200 OK
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Deals display correctly
- [ ] Wishlist functionality works
- [ ] Price alerts work for subscribers
- [ ] CORS configured correctly
- [ ] SSL certificates active on both platforms
- [ ] No sensitive data in codebase
- [ ] Error handling tested
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place
- [ ] Documentation updated with production URLs

---

## Production URLs

After deployment, update this section:

- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-app-name.onrender.com
- **Database:** Supabase (connection string in environment variables)

---

## Conclusion

Your Buzdealz application is now deployed across two platforms:

- **Render** provides reliable backend hosting with free tier
- **Vercel** delivers fast frontend with global CDN

Both platforms offer excellent developer experience with automatic deployments, easy scaling, and comprehensive logging. Monitor your logs regularly and upgrade to paid tiers as your traffic grows.

For questions or issues, refer to the troubleshooting section or consult platform documentation.

6. **Redeploy after adding env variables:**

   ```bash
   vercel --prod
   ```

7. **Note your API URL:**
   Example: `https://buzdealz-api.vercel.app`

---

## Frontend Deployment

### Step 1: Update API Base URL

Update `client/src/lib/axios.ts` to use your deployed backend URL:

```typescript
const api = axios.create({
  baseURL: "https://your-api-url.vercel.app/api", // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Step 2: Deploy Frontend to Vercel

1. **Navigate to client directory:**

   ```bash
   cd ../client
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Follow prompts:**

   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **buzdealz-app** (or your choice)
   - Directory? **./client**
   - Override settings? **N**

4. **Configure build settings (if prompted):**

   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy to production:**

   ```bash
   vercel --prod
   ```

6. **Access your app:**
   Example: `https://buzdealz-app.vercel.app`

---

## Alternative: Deploy via Vercel Dashboard (Recommended)

### Backend Deployment

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the **server** folder as root directory
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Click "Deploy"

### Frontend Deployment

1. Go to https://vercel.com/new
2. Import your GitHub repository again (or create new project)
3. Select the **client** folder as root directory
4. Build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable (if needed):
   - `VITE_API_URL=https://your-backend-url.vercel.app`
6. Click "Deploy"

---

## Update Frontend to Use Environment Variable (Optional)

### Option 1: Use Environment Variable

Create `client/.env.production`:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

Update `client/src/lib/axios.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

Then add `VITE_API_URL` in Vercel dashboard environment variables.

### Option 2: Hardcode API URL (Simpler)

Just update `client/src/lib/axios.ts` with your backend URL:

```typescript
const api = axios.create({
  baseURL: "https://buzdealz-api.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Post-Deployment Steps

### 1. Run Database Migrations

Since Vercel is serverless, run migrations locally or use a CI/CD pipeline:

```bash
cd server
npm run db:migrate
```

### 2. Test Your Deployment

1. Visit your frontend URL
2. Try logging in with test account: `user@example.com` / `password123`
3. Test adding deals to wishlist
4. Verify all features work

### 3. Update CORS Settings (If Needed)

If you encounter CORS errors, update `server/src/server.ts`:

```typescript
app.use(
  cors({
    origin: [
      "https://your-frontend-url.vercel.app",
      "http://localhost:5173", // Keep for local development
    ],
    credentials: true,
  })
);
```

---

## Troubleshooting

### Backend Issues

**"Cannot find module" errors:**

- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Run `npm install --production` locally to test

**Database connection timeout:**

- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check Supabase connection pooling settings
- Increase `connectionTimeoutMillis` in `server/src/db/index.ts`

**API routes not working:**

- Verify `vercel.json` is in server root
- Check Vercel function logs in dashboard
- Ensure `src/server.ts` exports the Express app

### Frontend Issues

**API calls failing:**

- Verify `baseURL` in axios config points to deployed backend
- Check CORS configuration in backend
- Inspect browser console for errors

**Blank page after deployment:**

- Check Vercel build logs for errors
- Verify build output directory is `dist`
- Ensure all environment variables are set

**404 on page refresh:**

- Verify `vercel.json` has rewrite rules
- Check framework preset is set to "Vite"

---

## Environment Variables Reference

### Backend (Required)

| Variable       | Description                  | Example                               |
| -------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`   | Secret for JWT signing       | `random-32-char-string`               |
| `NODE_ENV`     | Environment mode             | `production`                          |

### Frontend (Optional)

| Variable       | Description     | Example                  |
| -------------- | --------------- | ------------------------ |
| `VITE_API_URL` | Backend API URL | `https://api.vercel.app` |

---

## Automatic Deployments

Once connected to GitHub:

1. **Push to `main` branch** → Auto-deploys to production
2. **Push to other branches** → Creates preview deployments
3. **Pull requests** → Automatic preview URLs

Configure in Vercel dashboard: Settings > Git

---

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Settings > Domains
3. Add your custom domain (e.g., `buzdealz.com`)
4. Follow DNS configuration instructions
5. SSL certificate auto-generated

---

## Monitoring & Logs

### View Logs:

1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Select a deployment
5. View "Runtime Logs" and "Build Logs"

### Performance Monitoring:

- Vercel Analytics (enable in dashboard)
- Function execution times
- Error tracking

---

## Cost Considerations

**Vercel Free Tier includes:**

- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions (100 GB-hours)
- Automatic HTTPS

**Supabase Free Tier includes:**

- 500 MB database
- Unlimited API requests
- 2 GB bandwidth

Monitor usage in respective dashboards.

---

## Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured in Vercel
- [ ] API URL updated in frontend
- [ ] CORS configured for production domain
- [ ] Test user authentication
- [ ] Test all CRUD operations
- [ ] Verify wishlist functionality
- [ ] Test responsive design
- [ ] Check error handling
- [ ] Monitor initial logs for issues

---

## Support

For Vercel-specific issues, refer to:

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

For application issues, check application logs and database connectivity.
