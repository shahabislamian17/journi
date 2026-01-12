// Express server entry point
// Used for both: local development and Vercel deployment
require('dotenv').config();
const app = require('./app');

// For Vercel serverless functions, export the app
// For local development, start the server
if (process.env.VERCEL) {
  // Vercel deployment - export app for serverless function
  module.exports = app;
} else {
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

