// Express server entry point
// Used for both: local development and Vercel deployment
require('dotenv').config();
const app = require('./app');

// For Vercel: Always export the app (it's used as serverless function handler)
// For local: Start the server
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  // Local development - start server
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

// Export app for Vercel serverless function
// @vercel/node will use this as the handler
module.exports = app;

