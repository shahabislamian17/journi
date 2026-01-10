// Next.js API route handler - catch-all for /api/*
// Uses Express Router directly with proper request handling

const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app (singleton)
let app;
if (!global.__expressApp) {
  app = express();
  
  // Middleware - must be applied before routes
  app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes - mount with /api prefix
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

module.exports = async function handler(req, res) {
  // Handle OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Reconstruct full path: /api/auth/login
  const routeSegments = req.query.route || [];
  const fullPath = '/api/' + routeSegments.join('/');
  
  // Clean query params
  const cleanQuery = { ...req.query };
  delete cleanQuery.route;
  const queryString = Object.keys(cleanQuery).length > 0 
    ? '?' + new URLSearchParams(cleanQuery).toString() 
    : '';

  console.log(`[API Handler] ${req.method} ${fullPath}`, { 
    body: req.method === 'POST' || req.method === 'PUT' ? '(present)' : undefined,
    query: cleanQuery 
  });

  // For POST/PUT requests, ensure body is available
  // Next.js already parses JSON body, but we need to make it available to Express middleware
  let bodyData = req.body;
  
  // Create a request-like object that Express can process
  // The key is to make it look like a proper HTTP request so Express middleware works
  const mockReq = {
    method: req.method,
    url: fullPath + queryString,
    path: fullPath,
    originalUrl: fullPath + queryString,
    baseUrl: '',
    query: cleanQuery,
    headers: req.headers || {},
    params: {},
    user: null,
    get: function(name) {
      return this.headers[name?.toLowerCase()] || this.headers[name];
    },
    // For body parsing middleware - if body already exists, use it
    // Otherwise create a stream-like object
    body: bodyData || {},
    // Add properties that express.json() middleware might check
    is: function(type) {
      if (type === 'application/json' || type.includes('json')) {
        return this.headers['content-type']?.includes('json');
      }
      return false;
    }
  };

  // Extract path params
  const pathParts = fullPath.split('/').filter(Boolean);
  if (pathParts.length >= 4) {
    mockReq.params.slug = pathParts[3];
    mockReq.params.id = pathParts[3];
  }
  if (pathParts.length >= 5) {
    mockReq.params.id = pathParts[4];
  }

  // Create response wrapper
  let statusCode = 200;
  let headersSent = false;
  const mockRes = {
    statusCode: 200,
    headersSent: false,
    _headers: {},
    status: function(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      if (headersSent) {
        console.warn('[Response] Attempted to send JSON after headers sent');
        return this;
      }
      headersSent = true;
      this.headersSent = true;
      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode || 200);
      res.json(data);
      return this;
    },
    send: function(data) {
      if (headersSent) {
        console.warn('[Response] Attempted to send after headers sent');
        return this;
      }
      headersSent = true;
      this.headersSent = true;
      res.status(statusCode || 200);
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

  // Call Express app with proper error handling
  return new Promise((resolve) => {
    let handled = false;
    
    const next = (err) => {
      if (handled) return;
      handled = true;
      
      if (err) {
        console.error(`[Express Error] ${req.method} ${fullPath}:`, err);
        if (!headersSent && !res.headersSent) {
          res.status(err.status || 500).json({ 
            error: err.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
          });
        }
      } else if (!headersSent && !res.headersSent) {
        console.error(`[Express] Route not handled: ${req.method} ${fullPath}`);
        res.status(404).json({ 
          error: 'Route not found', 
          path: fullPath, 
          method: req.method 
        });
      }
      resolve();
    };

    // Call Express app - it will process middleware and routes
    try {
      // Since body is already parsed by Next.js, we can pass it directly
      // But Express middleware still needs to run, so we call app() as a function
      app(mockReq, mockRes, next);
    } catch (error) {
      console.error('[Handler Error]:', error);
      if (!headersSent && !res.headersSent) {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
      resolve();
    }
  });
};
