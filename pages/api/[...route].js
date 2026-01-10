// Next.js API route handler - catch-all for /api/*
// Reuses the Express app setup from backend/server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Readable } = require('stream');

// Create Express app (same setup as backend/server.js but without listening)
let app;
if (!global.__expressApp) {
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

  // Routes - mount with /api prefix since we'll strip it
  const backendPath = path.join(process.cwd(), 'backend', 'routes');
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

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Journi API is running' });
  });

  // 404 handler
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found', path: req.path });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('[Express Error]:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  global.__expressApp = app;
} else {
  app = global.__expressApp;
}

// Helper to convert Next.js request to Node.js IncomingMessage-like object
function createNodeRequest(nextReq, fullPath) {
  const stream = new Readable();
  stream._read = () => {};
  
  if (nextReq.body) {
    const bodyStr = typeof nextReq.body === 'string' ? nextReq.body : JSON.stringify(nextReq.body);
    stream.push(bodyStr);
  }
  stream.push(null);

  const nodeReq = Object.create(stream);
  nodeReq.method = nextReq.method;
  nodeReq.url = fullPath + (nextReq.url.includes('?') ? nextReq.url.substring(nextReq.url.indexOf('?')) : '');
  nodeReq.path = fullPath;
  nodeReq.originalUrl = fullPath;
  nodeReq.headers = nextReq.headers || {};
  nodeReq.query = nextReq.query || {};
  nodeReq.body = nextReq.body || {};
  nodeReq.params = {};
  nodeReq.get = function(name) {
    return this.headers[name?.toLowerCase()] || this.headers[name];
  };
  
  return nodeReq;
}

module.exports = async function handler(req, res) {
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Get route segments and reconstruct full path
  const routeSegments = req.query.route || [];
  const fullPath = '/api/' + routeSegments.join('/');
  
  // Extract params
  if (routeSegments.length >= 2) {
    // This will be handled by Express routing
  }

  console.log(`[API Handler] ${req.method} ${fullPath}`);

  // Create Node.js-like request
  const nodeReq = createNodeRequest(req, fullPath);

  // Create response wrapper
  let statusCode = 200;
  let headersSent = false;
  const nodeRes = {
    statusCode: 200,
    headersSent: false,
    _headers: {},
    status: function(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode);
      res.json(data);
      return this;
    },
    send: function(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      res.status(statusCode);
      res.send(data);
      return this;
    },
    end: function(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      if (data) res.write(data);
      res.end();
      return this;
    },
    setHeader: function(name, value) {
      this._headers[name] = value;
      res.setHeader(name, value);
      return this;
    },
    getHeader: function(name) {
      return this._headers[name] || res.getHeader(name);
    },
    write: function(chunk) {
      res.write(chunk);
      return this;
    },
    writeHead: function(code, headers) {
      statusCode = code;
      this.statusCode = code;
      if (headers) {
        Object.entries(headers).forEach(([k, v]) => {
          this._headers[k] = v;
          res.setHeader(k, v);
        });
      }
      res.statusCode = code;
      return this;
    }
  };

  // Call Express app
  return new Promise((resolve) => {
    app(nodeReq, nodeRes, (err) => {
      if (err) {
        console.error('[App Error]:', err);
        if (!headersSent && !res.headersSent) {
          res.status(500).json({ error: err.message || 'Internal server error' });
        }
      } else if (!headersSent && !res.headersSent) {
        res.status(404).json({ error: 'Route not found', path: fullPath });
      }
      resolve();
    });
  });
};
