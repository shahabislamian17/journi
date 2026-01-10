# Quick Start - Deploy to Vercel

## Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Setup for Vercel deployment"

# Push (your repo is already connected)
git push origin main
```

## Step 2: Set Up PostgreSQL

### Option 1: Vercel Postgres (Easiest)
1. Go to vercel.com > Your Project
2. Storage > Create Database > Postgres
3. Copy the connection string

### Option 2: Supabase (Free)
1. Go to supabase.com
2. Create project
3. Settings > Database > Connection string (URI)

## Step 3: Deploy to Vercel

1. Go to vercel.com
2. Import GitHub repository: `shahabislamian17/journi`
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
JWT_SECRET=your-secret-key-min-32-characters-long
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
FRONTEND_URL=https://your-project.vercel.app
NODE_ENV=production
```

5. Deploy!

## Step 4: Run Migrations

After deployment, in Vercel Dashboard:
1. Go to your project
2. Settings > Environment Variables
3. Copy DATABASE_URL
4. Run locally:
```bash
cd backend
DATABASE_URL="your-connection-string" npx prisma migrate deploy
DATABASE_URL="your-connection-string" npx prisma db seed
```

## Important Notes

- Backend API runs as serverless functions in `/api` folder
- Update `NEXT_PUBLIC_API_URL` to your Vercel domain after first deploy
- Use connection pooling for production: add `?pgbouncer=true` to DATABASE_URL
- Stripe keys: Use test keys for now, production keys later

