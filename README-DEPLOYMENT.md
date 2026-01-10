# Deployment Guide for Vercel + PostgreSQL

This guide will help you deploy your Journi application to Vercel with PostgreSQL database.

## Prerequisites

1. GitHub account with repository created
2. Vercel account (free tier works)
3. PostgreSQL database (Vercel Postgres, Supabase, or Railway)

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to Storage > Create Database
3. Select "Postgres"
4. Create database and note the connection string

### Option B: Supabase (Free PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy the connection string

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Vercel deployment"

# Add your remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method 1: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Method 2: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables in Vercel

In Vercel Dashboard > Your Project > Settings > Environment Variables, add:

### Frontend Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

### Backend Variables (if deploying backend separately):
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=4000
```

## Step 5: Deploy Backend API

The backend needs to be deployed separately. You have two options:

### Option A: Deploy Backend as Separate Vercel Project
1. Create a new Vercel project for the backend
2. Root Directory: `backend/`
3. Build Command: `npm install && npx prisma generate`
4. Output Directory: (leave empty, it's a serverless function)
5. Add all backend environment variables

### Option B: Use Vercel Serverless Functions
Create `api/` folder in root and convert backend routes to serverless functions.

### Option C: Deploy Backend to Railway/Render
1. Connect your GitHub repo
2. Set root directory to `backend/`
3. Build command: `npm install && npx prisma generate`
4. Start command: `node server.js`
5. Add environment variables

## Step 6: Run Database Migrations

After deployment, run migrations:

```bash
# In your backend directory
cd backend
npx prisma migrate deploy
```

Or via Vercel CLI:
```bash
vercel env pull .env.local
cd backend
npx prisma migrate deploy
```

## Step 7: Seed Database (Optional)

```bash
cd backend
npx prisma db seed
```

## Important Notes

1. **Database Connection**: Use connection pooling for production (e.g., `?pgbouncer=true` or `?connection_limit=1`)
2. **CORS**: Update `FRONTEND_URL` in backend to your Vercel frontend URL
3. **Stripe**: Use production keys in production environment
4. **JWT Secret**: Use a strong, random secret (32+ characters)

## Troubleshooting

- **Database connection errors**: Check connection string format and ensure database is accessible
- **Build errors**: Check that all dependencies are in package.json
- **API errors**: Verify environment variables are set correctly
- **CORS errors**: Update FRONTEND_URL in backend environment variables

## Production Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] CORS settings updated for production domain
- [ ] Stripe keys updated (production keys)
- [ ] JWT secret is strong and secure
- [ ] Frontend API URL points to production backend
- [ ] Database is backed up
- [ ] Error logging is configured

