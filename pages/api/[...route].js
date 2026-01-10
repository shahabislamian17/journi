// Next.js API route handler - catch-all for /api/*
// This routes all API requests to the backend Express app

const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app once (module-level, reused across requests)
let app;
if (!app) {
  app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Log request for debugging
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.path || req.url}`);
    next();
  });

  // Import routes from backend
  const backendPath = path.join(process.cwd(), 'backend', 'routes');

  // Routes - Mount at root since we'll reconstruct the path
  app.use('/auth', require(path.join(backendPath, 'auth')));
  app.use('/experiences', require(path.join(backendPath, 'experiences')));
  app.use('/categories', require(path.join(backendPath, 'categories')));
  app.use('/bookings', require(path.join(backendPath, 'bookings')));
  app.use('/wishlist', require(path.join(backendPath, 'wishlist')));
  app.use('/reviews', require(path.join(backendPath, 'reviews')));
  app.use('/messages', require(path.join(backendPath, 'messages')));
  app.use('/stays', require(path.join(backendPath, 'stays')));
  app.use('/cars', require(path.join(backendPath, 'cars')));
  app.use('/stripe', require(path.join(backendPath, 'stripe')));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Journi API is running', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req, res) => {
    console.error(`[API] 404 - Route not found: ${req.method} ${req.path || req.url}`);
    res.status(404).json({ error: 'API endpoint not found', path: req.path || req.url, method: req.method });
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error('API Error:', err.stack);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });
}

// Export handler for Next.js API route
// req.query.route is an array of path segments: /api/experiences/slug -> ['experiences', 'slug']
module.exports = function handler(req, res) {
  // Reconstruct the path from route segments
  const routeSegments = req.query.route || [];
  const apiPath = '/' + routeSegments.join('/');
  
  // Preserve query string if present
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  
  // Update req.url and req.path for Express routing
  req.url = apiPath + queryString;
  req.path = apiPath;
  
  console.log(`[API Handler] ${req.method} ${apiPath} (from route: [${routeSegments.join(', ')}])`);
  
  // Call Express app
  return app(req, res);
};

