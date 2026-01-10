// Next.js API route handler - catch-all for /api/*
// Routes all API requests to backend Express routes

const express = require('express');
const cors = require('cors');
const path = require('path');

// Create a simple Express app just for routing
const routerApp = express();
routerApp.use(express.json());
routerApp.use(express.urlencoded({ extended: true }));
routerApp.use(cors({
  origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import and mount backend routes
const backendPath = path.join(process.cwd(), 'backend', 'routes');
routerApp.use('/auth', require(path.join(backendPath, 'auth')));
routerApp.use('/experiences', require(path.join(backendPath, 'experiences')));
routerApp.use('/categories', require(path.join(backendPath, 'categories')));
routerApp.use('/bookings', require(path.join(backendPath, 'bookings')));
routerApp.use('/wishlist', require(path.join(backendPath, 'wishlist')));
routerApp.use('/reviews', require(path.join(backendPath, 'reviews')));
routerApp.use('/messages', require(path.join(backendPath, 'messages')));
routerApp.use('/stays', require(path.join(backendPath, 'stays')));
routerApp.use('/cars', require(path.join(backendPath, 'cars')));
routerApp.use('/stripe', require(path.join(backendPath, 'stripe')));

// 404 handler
routerApp.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// Error handler
routerApp.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Export Next.js API route handler
module.exports = async function handler(req, res) {
  // Handle OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Get route segments: /api/auth/login -> ['auth', 'login']
  const routeSegments = req.query.route || [];
  const apiPath = '/' + routeSegments.join('/');
  
  // Preserve query string
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const fullPath = apiPath + queryString;
  
  console.log(`[API] ${req.method} ${fullPath} (segments: [${routeSegments.join(', ')}])`);

  // Create request-like object for Express
  const expressReq = {
    method: req.method,
    url: fullPath,
    path: apiPath,
    originalUrl: fullPath,
    baseUrl: '',
    query: { ...req.query, route: undefined }, // Remove route from query
    body: req.body || {},
    headers: req.headers,
    params: {},
    user: req.user,
    get: (name) => req.headers[name?.toLowerCase()] || req.headers[name],
    // For path params, extract from segments if needed
  };

  // Extract path params for routes like /:slug or /:id
  if (routeSegments.length >= 2) {
    // e.g., ['experiences', 'some-slug'] -> params: { slug: 'some-slug' }
    expressReq.params.slug = routeSegments[1];
    expressReq.params.id = routeSegments[1];
  }

  // Create response-like object
  let statusCode = 200;
  const expressRes = {
    statusCode: 200,
    headersSent: false,
    status: function(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      if (this.headersSent) return this;
      this.headersSent = true;
      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode || 200);
      return res.json(data);
    },
    send: function(data) {
      if (this.headersSent) return this;
      this.headersSent = true;
      res.status(statusCode || 200);
      return res.send(data);
    },
    end: function(data) {
      if (this.headersSent) return this;
      this.headersSent = true;
      return res.end(data);
    },
    setHeader: function(name, value) {
      return res.setHeader(name, value);
    },
    getHeader: function(name) {
      return res.getHeader(name);
    },
  };

  // Call Express router
  return new Promise((resolve) => {
    routerApp(expressReq, expressRes, (err) => {
      if (err) {
        console.error('[Router Error]:', err);
        if (!expressRes.headersSent) {
          res.status(500).json({ error: err.message || 'Internal server error' });
        }
      }
      resolve();
    });
  });
}
