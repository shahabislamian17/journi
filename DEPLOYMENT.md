# Quick Deployment Guide

## 1. Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Setup for Vercel deployment with PostgreSQL"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 2. Set Up PostgreSQL Database

### Recommended: Vercel Postgres
1. In Vercel Dashboard > Your Project > Storage
2. Create Postgres database
3. Copy connection string

### Alternative: Supabase (Free)
1. Go to supabase.com
2. Create project
3. Settings > Database > Copy connection string

## 3. Deploy to Vercel

1. Go to vercel.com
2. Import your GitHub repository
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:

**Required Variables:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
JWT_SECRET=your-secret-key-min-32-chars
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
FRONTEND_URL=https://your-project.vercel.app
```

4. Deploy!

## 4. Run Database Migrations

After first deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
cd backend
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Important Notes

- Backend API runs as serverless functions in `/api` folder
- Database connection uses connection pooling in production
- Update CORS settings with your production domain
- Use production Stripe keys in production environment

