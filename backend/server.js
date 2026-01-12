// Express server entry point
// Used for both: local development and Vercel deployment
require('dotenv').config();

// Always export app for Vercel (it will be used as serverless function)
// For local development, check if we should start server
const app = require('./app');

// Check if running on Vercel or as serverless function
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME;

if (isVercel) {
  // Vercel deployment - export app for serverless function
  // Vercel will call this as a function handler
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

