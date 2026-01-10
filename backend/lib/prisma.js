// Shared Prisma Client with environment variable validation for serverless
const { PrismaClient } = require('@prisma/client');

// Singleton pattern for serverless environments
// Use global variable to persist across function invocations
let prisma;

function getPrismaClient() {
  // Check global first (for serverless function reuse)
  if (global.__prisma) {
    return global.__prisma;
  }
  
  // Check local variable (for same execution context)
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

  // Validate DATABASE_URL format and handle different connection types
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  // Log DATABASE_URL info (masked for security)
  const urlMatch = dbUrl.match(/@([^:]+)/);
  const host = urlMatch ? urlMatch[1] : 'unknown';
  console.log('[Prisma] DATABASE_URL format check:', {
    hasPrisma: dbUrl.includes('prisma://'),
    hasPooler: dbUrl.includes('pooler'),
    hasDbPrisma: dbUrl.includes('db.prisma.io'),
    host: host,
    startsWith: dbUrl.substring(0, 20) + '...'
  });

  // For Prisma Accelerate/Data Proxy (db.prisma.io or prisma://), use as-is
  // For direct PostgreSQL connections, add connection pooling parameters
  let connectionUrl = dbUrl;
  
  if (!dbUrl.includes('prisma://') && !dbUrl.includes('pooler') && !dbUrl.includes('db.prisma.io')) {
    try {
      const url = new URL(dbUrl);
      // Add connection pooling parameters for serverless (direct PostgreSQL)
      url.searchParams.set('connection_limit', '1');
      url.searchParams.set('pool_timeout', '20');
      url.searchParams.set('connect_timeout', '10');
      connectionUrl = url.toString();
      console.log('[Prisma] Added connection pooling parameters for direct PostgreSQL connection');
    } catch (urlError) {
      console.warn('[Prisma] Could not parse DATABASE_URL as URL, using as-is:', urlError.message);
      // If URL parsing fails, use original connectionUrl
    }
  } else {
    console.log('[Prisma] Using Prisma Accelerate/Proxy connection (no pooling params needed)');
  }

  // Create Prisma Client with optimized settings for serverless
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: connectionUrl
      }
    },
    // Add transaction options for better serverless performance
    transactionOptions: {
      maxWait: 5000, // max time to wait for transaction
      timeout: 10000 // max time transaction can run
    }
  });

  // Log connection attempt (don't connect eagerly in serverless)
  console.log('[Prisma] Client initialized with DATABASE_URL:', 
    process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 
      'NOT SET'
  );

  // Store in global for serverless function reuse
  global.__prisma = prisma;
  
  // Graceful shutdown
  process.on('beforeExit', async () => {
    if (global.__prisma) {
      await global.__prisma.$disconnect();
      global.__prisma = null;
    }
  });

  return prisma;
}

// Export singleton instance
module.exports = getPrismaClient();
