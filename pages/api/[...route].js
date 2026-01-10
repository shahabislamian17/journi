// Next.js API route handler - catch-all for /api/*
// Uses Express Router directly with proper request handling

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

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
  
  // Body parsing middleware - apply conditionally
  app.use((req, res, next) => {
    // If body is already parsed (from Next.js), skip parsing
    if (req.body !== undefined) {
      return next();
    }
    // Otherwise parse it
    express.json()(req, res, next);
  });
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

  // Next.js already parses JSON body, so use it directly
  // Create request object with body already set
  const mockReq = {
    method: req.method,
    url: fullPath + queryString,
    path: fullPath,
    originalUrl: fullPath + queryString,
    baseUrl: '',
    query: cleanQuery,
    headers: req.headers || {},
    params: {},
    body: req.body || {}, // Body is already parsed by Next.js
    user: null,
    get: function(name) {
      return this.headers[name?.toLowerCase()] || this.headers[name];
    },
    is: function(type) {
      const contentType = this.headers['content-type'] || '';
      if (type === 'application/json' || type.includes('json')) {
        return contentType.includes('json');
      }
      return contentType.includes(type);
    }
  };
  
  // Ensure Content-Type header is set for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && !mockReq.headers['content-type']) {
    mockReq.headers['content-type'] = 'application/json';
  }

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

  // Direct route matching - call Express router.handle() method
  return new Promise((resolve) => {
    let responseEnded = false;
    
    // Create mock request object compatible with Express
    const expressReq = {
      method: req.method,
      url: fullPath + queryString,
      path: fullPath,
      originalUrl: fullPath + queryString,
      baseUrl: '',
      query: cleanQuery,
      headers: { ...req.headers },
      params: {},
      body: req.body || {},
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1',
      get: function(name) {
        return this.headers[name?.toLowerCase()] || this.headers[name] || null;
      },
      is: function(type) {
        const ct = (this.headers['content-type'] || '').toLowerCase();
        return ct.includes(type.toLowerCase());
      }
    };
    
    // Extract path params
    const pathParts = fullPath.split('/').filter(Boolean);
    if (pathParts.length >= 4) {
      expressReq.params.slug = pathParts[3];
      expressReq.params.id = pathParts[3];
    }
    if (pathParts.length >= 5) {
      expressReq.params.id = pathParts[4];
    }
    
    // Create mock response object
    const expressRes = {
      statusCode: 200,
      headersSent: false,
      _headers: {},
      req: expressReq,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        if (responseEnded) return this;
        responseEnded = true;
        this.headersSent = true;
        res.setHeader('Content-Type', 'application/json');
        res.status(this.statusCode || 200);
        res.json(data);
        resolve();
        return this;
      },
      send: function(data) {
        if (responseEnded) return this;
        responseEnded = true;
        this.headersSent = true;
        res.status(this.statusCode || 200);
        if (typeof data === 'object' && !Buffer.isBuffer(data)) {
          res.setHeader('Content-Type', 'application/json');
          res.json(data);
        } else {
          res.send(data);
        }
        resolve();
        return this;
      },
      end: function(data) {
        if (responseEnded) return this;
        responseEnded = true;
        this.headersSent = true;
        if (data) res.write(data);
        res.end();
        resolve();
        return this;
      },
      setHeader: function(name, value) {
        this._headers[name.toLowerCase()] = value;
        res.setHeader(name, value);
        return this;
      },
      getHeader: function(name) {
        return this._headers[name.toLowerCase()] || res.getHeader(name);
      }
    };

    const next = (err) => {
      if (responseEnded) return;
      responseEnded = true;
      
      if (err) {
        console.error(`[Express Error] ${req.method} ${fullPath}:`, err);
        if (!res.headersSent) {
          res.status(err.status || 500).json({ 
            error: err.message || 'Internal server error'
          });
        }
      } else if (!res.headersSent) {
        console.error(`[Express] Route not handled: ${req.method} ${fullPath}`);
        res.status(405).json({ 
          error: 'Method not allowed', 
          path: fullPath, 
          method: req.method 
        });
      }
      resolve();
    };

    // Call Express app - it's a function that processes requests
    try {
      // Express app is callable as app(req, res, next)
      // This will process all middleware and route handlers
      app(expressReq, expressRes, next);
    } catch (error) {
      console.error('[Handler Error]:', error);
      if (!responseEnded && !res.headersSent) {
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
      resolve();
    }
  });
};
