// Vercel serverless function - catch-all route for /api/*
// This routes all API requests to the backend Express app

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

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
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Import routes from backend
const backendPath = path.join(__dirname, '..', 'backend', 'routes');

// Routes - In Vercel, /api/* requests are routed here, but the path doesn't include /api
// So /api/experiences/slug becomes /experiences/slug in this function
app.use('/api/auth', require(path.join(backendPath, 'auth')));
app.use('/api/experiences', require(path.join(backendPath, 'experiences')));
app.use('/api/categories', require(path.join(backendPath, 'categories')));
app.use('/api/bookings', require(path.join(backendPath, 'bookings')));
app.use('/api/wishlist', require(path.join(backendPath, 'wishlist')));
app.use('/api/reviews', require(path.join(backendPath, 'reviews')));
app.use('/api/messages', require(path.join(backendPath, 'messages')));
app.use('/api/stays', require(path.join(backendPath, 'stays')));
app.use('/api/cars', require(path.join(backendPath, 'cars')));
app.use('/api/stripe', require(path.join(backendPath, 'stripe')));

// Also mount without /api prefix (for Vercel catch-all behavior)
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Journi API is running', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Journi API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  console.error(`[API] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'API endpoint not found', path: req.path, method: req.method });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Export for Vercel
module.exports = app;

