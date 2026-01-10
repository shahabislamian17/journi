// Shared Prisma Client instance for serverless environments
const { PrismaClient } = require('@prisma/client');

// Ensure DATABASE_URL is available (for serverless environments)
// In Vercel, environment variables are automatically available, but we log for debugging
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Make sure DATABASE_URL is configured in Vercel Dashboard > Settings > Environment Variables');
} else {
  // Validate URL format (log partial info for debugging, not the full URL)
  const isValid = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  if (!isValid) {
    console.error('❌ DATABASE_URL must start with postgres:// or postgresql://');
    console.error('Current value type:', typeof dbUrl, 'Length:', dbUrl?.length || 0);
  } else {
    console.log('✅ DATABASE_URL is set and valid (length:', dbUrl.length, 'chars)');
  }
}

// Create Prisma Client
// Prisma automatically reads DATABASE_URL from process.env, no need to pass it explicitly
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle connection errors (don't fail fast - let individual queries handle errors)
// This is important for serverless functions where we want lazy connections
prisma.$connect().catch((error) => {
  console.error('⚠️  Prisma connection warning (this is normal in serverless):', error.message);
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set. Set it in Vercel Dashboard > Settings > Environment Variables');
  }
});

// Graceful shutdown for long-running processes
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

module.exports = prisma;

