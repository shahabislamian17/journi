// Next.js API route handler - catch-all for /api/*
// Routes all API requests to backend Express routes using http.createServer

const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app (singleton)
let expressApp;
let httpServer;

function getExpressApp() {
  if (!expressApp) {
    expressApp = express();
    
    // Middleware
    expressApp.use(cors({
      origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    // Log request for debugging
    expressApp.use((req, res, next) => {
      console.log(`[Express] ${req.method} ${req.path || req.url}`);
      next();
    });

    // Import routes from backend
    const backendPath = path.join(process.cwd(), 'backend', 'routes');
    
    // Mount routes
    expressApp.use('/auth', require(path.join(backendPath, 'auth')));
    expressApp.use('/experiences', require(path.join(backendPath, 'experiences')));
    expressApp.use('/categories', require(path.join(backendPath, 'categories')));
    expressApp.use('/bookings', require(path.join(backendPath, 'bookings')));
    expressApp.use('/wishlist', require(path.join(backendPath, 'wishlist')));
    expressApp.use('/reviews', require(path.join(backendPath, 'reviews')));
    expressApp.use('/messages', require(path.join(backendPath, 'messages')));
    expressApp.use('/stays', require(path.join(backendPath, 'stays')));
    expressApp.use('/cars', require(path.join(backendPath, 'cars')));
    expressApp.use('/stripe', require(path.join(backendPath, 'stripe')));

    // Health check
    expressApp.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Journi API is running', timestamp: new Date().toISOString() });
    });

    // 404 handler
    expressApp.use((req, res) => {
      console.error(`[Express] 404 - Route not found: ${req.method} ${req.path || req.url}`);
      res.status(404).json({ error: 'API endpoint not found', path: req.path || req.url, method: req.method });
    });

    // Error handling
    expressApp.use((err, req, res, next) => {
      console.error('[Express] Error:', err.stack);
      res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
      });
    });
  }
  return expressApp;
}

// Export handler for Next.js API route
module.exports = async function handler(req, res) {
  // Get route segments: /api/auth/login -> ['auth', 'login']
  const routeSegments = req.query.route || [];
  const apiPath = '/' + routeSegments.join('/');
  
  console.log(`[Next.js Handler] ${req.method} /api${apiPath} (segments: [${routeSegments.join(', ')}])`);

  // Create a Node.js IncomingMessage-like object for Express
  const IncomingMessage = http.IncomingMessage;
  const ServerResponse = http.ServerResponse;
  
  // Convert Next.js request to Node.js request
  const nodeReq = Object.create(IncomingMessage.prototype);
  Object.assign(nodeReq, {
    method: req.method,
    url: apiPath + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''),
    headers: req.headers,
    body: req.body,
    query: req.query,
    // Add body if POST/PUT
    on: (event, callback) => {
      if (event === 'data' && req.body) {
        // Body already parsed by Next.js
        setImmediate(() => callback(Buffer.from(JSON.stringify(req.body))));
      } else if (event === 'end') {
        setImmediate(callback);
      }
      return nodeReq;
    },
    read: () => {
      if (req.body) {
        return Buffer.from(JSON.stringify(req.body));
      }
      return null;
    },
  });

  // Convert Next.js response to Node.js response
  const nodeRes = Object.create(ServerResponse.prototype);
  Object.assign(nodeRes, {
    statusCode: 200,
    headers: {},
    setHeader: function(name, value) {
      this.headers[name] = value;
      return res.setHeader(name, value);
    },
    getHeader: function(name) {
      return this.headers[name] || res.getHeader(name);
    },
    writeHead: function(statusCode, headers) {
      this.statusCode = statusCode;
      if (headers) {
        Object.assign(this.headers, headers);
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
      }
      res.statusCode = statusCode;
      return this;
    },
    write: function(chunk) {
      return res.write(chunk);
    },
    end: function(chunk, encoding, callback) {
      if (chunk) res.write(chunk);
      res.end(callback);
      return this;
    },
    on: function(event, callback) {
      return res.on(event, callback);
    },
    json: function(data) {
      res.setHeader('Content-Type', 'application/json');
      res.status(this.statusCode || 200);
      return res.json(data);
    },
    send: function(data) {
      res.setHeader('Content-Type', 'text/html');
      res.status(this.statusCode || 200);
      return res.send(data);
    },
    status: function(code) {
      this.statusCode = code;
      res.statusCode = code;
      return this;
    },
  });

  // Get Express app and handle request
  const app = getExpressApp();
  
  // Handle the request with Express
  return new Promise((resolve) => {
    // Parse body if not already parsed
    if (req.method === 'POST' || req.method === 'PUT') {
      if (!req.body && req.body !== '') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            nodeReq.body = JSON.parse(body);
          } catch {
            nodeReq.body = body;
          }
          app(nodeReq, nodeRes);
          resolve();
        });
        return;
      } else {
        nodeReq.body = req.body;
      }
    }
    
    // Handle request immediately
    app(nodeReq, nodeRes);
    resolve();
  });
};
