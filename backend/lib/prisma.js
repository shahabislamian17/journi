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
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
    const dbRelatedVars = Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || k.includes('DB') || k.includes('PRISMA')
    );
    const error = new Error(
      'DATABASE_URL environment variable is NOT SET or is EMPTY. ' +
      'This is REQUIRED for the application to work. ' +
      'Please set it in Vercel Dashboard > Settings > Environment Variables. ' +
      'Current database-related env vars found: ' + (dbRelatedVars.length > 0 ? dbRelatedVars.join(', ') : 'NONE')
    );
    console.error('[Prisma FATAL Error]', error.message);
    console.error('[Prisma] All environment variables starting with DATABASE/DB/PRISMA:', dbRelatedVars);
    throw error;
  }

  // Validate DATABASE_URL format and handle different connection types
  const dbUrl = process.env.DATABASE_URL.trim();
  
  // Check if it's a placeholder or invalid value
  if (dbUrl === 'your-database-url-here' || dbUrl.length < 10) {
    throw new Error(
      'DATABASE_URL appears to be a placeholder or invalid. ' +
      'Please set a valid PostgreSQL connection string in Vercel environment variables.'
    );
  }

  // Validate URL starts with postgres:// or postgresql://
  if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
    console.error('[Prisma] Invalid DATABASE_URL format:', {
      urlLength: dbUrl.length,
      urlPreview: dbUrl.substring(0, 50) + '...',
      startsWithPostgres: dbUrl.startsWith('postgres'),
      startsWithPostgresql: dbUrl.startsWith('postgresql')
    });
    throw new Error(
      'DATABASE_URL must start with "postgres://" or "postgresql://". ' +
      'Current value appears to be invalid. ' +
      'Please check your Vercel environment variables.'
    );
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
    },
    // Connection pool settings for serverless
    __internal: {
      engine: {
        connectTimeout: 10000, // 10 second connection timeout
        queryTimeout: 20000 // 20 second query timeout
      }
    }
  });
  
  // Test connection on first initialization (in serverless, this is OK as it's cached)
  // But don't await - let it connect lazily
  if (process.env.NODE_ENV === 'production') {
    // In production, test connection but don't block
    prisma.$connect().catch(err => {
      console.error('[Prisma] Connection test failed (this is OK in serverless):', err.message);
    });
  }

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
