// Shared Prisma Client with environment variable validation for serverless
const { PrismaClient } = require('@prisma/client');

// Singleton pattern for serverless environments
let prisma;

function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  // Validate DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    const error = new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set it in Vercel Dashboard > Settings > Environment Variables. ' +
      'Current env vars: ' + Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB')).join(', ')
    );
    console.error('[Prisma Error]', error.message);
    throw error;
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
    console.warn('[Prisma Warning] DATABASE_URL should start with postgres:// or postgresql://. Got:', dbUrl.substring(0, 30) + '...');
  }

  // Create Prisma Client with connection pooling for serverless
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  // Log connection attempt (don't connect eagerly in serverless)
  console.log('[Prisma] Client initialized with DATABASE_URL:', 
    process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 
      'NOT SET'
  );

  // Graceful shutdown
  process.on('beforeExit', async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  return prisma;
}

// Export singleton instance
module.exports = getPrismaClient();
