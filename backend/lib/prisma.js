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

  // Create Prisma Client with proper connection handling for serverless
  // Use connection pooling URL if available (Prisma Accelerate/Proxy)
  let connectionUrl = process.env.DATABASE_URL;
  
  console.log('[Prisma] DATABASE_URL format check:', {
    hasPrisma: connectionUrl.includes('prisma://'),
    hasPooler: connectionUrl.includes('pooler'),
    startsWith: connectionUrl.substring(0, 20),
    host: connectionUrl.match(/@([^:]+)/)?.[1] || 'unknown'
  });

  // If using Prisma Data Proxy/Accelerate (prisma://), use as-is
  // Otherwise, add connection parameters for direct PostgreSQL connections
  if (!connectionUrl.includes('prisma://') && !connectionUrl.includes('pooler')) {
    try {
      const url = new URL(connectionUrl);
      // Add connection pooling parameters for serverless
      url.searchParams.set('connection_limit', '1');
      url.searchParams.set('pool_timeout', '20');
      url.searchParams.set('connect_timeout', '10');
      connectionUrl = url.toString();
      console.log('[Prisma] Added connection parameters for direct connection');
    } catch (urlError) {
      console.warn('[Prisma] Could not parse DATABASE_URL as URL, using as-is:', urlError.message);
      // If URL parsing fails, use original connectionUrl
    }
  }

  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: connectionUrl
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
