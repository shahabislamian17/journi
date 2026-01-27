// Express app configuration - exported for use in Next.js API routes
// This file contains the Express app setup without the server startup code
// Used by both: backend/server.js (for local dev) and pages/api/[...route].js (for Vercel)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || process.env.ALLOWED_ORIGIN || '*'
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - mount with /api prefix
const backendPath = path.join(__dirname, 'routes');

app.use('/api/auth', require(path.join(backendPath, 'auth')));
app.use('/api/experiences', require(path.join(backendPath, 'experiences')));
app.use('/api/categories', require(path.join(backendPath, 'categories')));
app.use('/api/bookings', require(path.join(backendPath, 'bookings')));
app.use('/api/wishlist', require(path.join(backendPath, 'wishlist')));
app.use('/api/reviews', require(path.join(backendPath, 'reviews')));
app.use('/api/messages', require(path.join(backendPath, 'messages')));
app.use('/api/conversations', require(path.join(backendPath, 'conversations')));
app.use('/api/stays', require(path.join(backendPath, 'stays')));
app.use('/api/cars', require(path.join(backendPath, 'cars')));
app.use('/api/stripe', require(path.join(backendPath, 'stripe')));
app.use('/api/upload', require(path.join(backendPath, 'upload')));
app.use('/api/contact', require(path.join(backendPath, 'contact')));

// Health check
app.get('/api/health', (req, res) => {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlPreview = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL.substring(0, 30) + '...' + process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 20)
    : 'NOT SET';
  res.json({ 
    status: 'ok', 
    message: 'Journi API is running', 
    database: {
      hasUrl: hasDbUrl,
      urlPreview: dbUrlPreview,
      host: process.env.DATABASE_URL?.match(/@([^:]+)/)?.[1] || 'unknown'
    }
  });
});

// Debug route to check environment
app.get('/api/debug/env', (req, res) => {
  res.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlPreview: process.env.DATABASE_URL 
      ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@').substring(0, 100)
      : 'NOT SET',
    databaseHost: process.env.DATABASE_URL?.match(/@([^:]+)/)?.[1] || 'unknown',
    nodeEnv: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    allDbRelatedVars: Object.keys(process.env).filter(k => 
      k.includes('DATABASE') || k.includes('DB') || k.includes('PRISMA')
    )
  });
});

// Debug route to check routes
app.get('/api/debug/routes', (req, res) => {
  // Simple response - Express routing info
  res.json({ 
    message: 'Routes are loaded and managed by Express',
    status: 'ok'
  });
});

// 404 handler for API routes (specific to /api/* paths)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// Global catch-all handler - MUST be last, before error handler
// This ensures Express always returns JSON 404, not HTML
// Prevents Next.js from rendering its default HTML 404 page
app.use((req, res) => {
  console.log('[Express] Route not found:', {
    method: req.method,
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl
  });
  res.status(404).json({ 
    error: 'Route not found in Express', 
    method: req.method, 
    path: req.url,
    originalPath: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Express Error]:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;

