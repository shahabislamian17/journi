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
  
  // Body parsing middleware - Next.js already parses JSON, so we skip Express parsing
  // But we still need to ensure req.body is available
  app.use((req, res, next) => {
    // Body will be set manually before calling Express
    next();
  });

  // Routes - mount with /api prefix
  const backendPath = path.join(process.cwd(), 'backend', 'routes');
  
  // Load and mount all routes
  const authRouter = require(path.join(backendPath, 'auth'));
  const experiencesRouter = require(path.join(backendPath, 'experiences'));
  const categoriesRouter = require(path.join(backendPath, 'categories'));
  const bookingsRouter = require(path.join(backendPath, 'bookings'));
  const wishlistRouter = require(path.join(backendPath, 'wishlist'));
  const reviewsRouter = require(path.join(backendPath, 'reviews'));
  const messagesRouter = require(path.join(backendPath, 'messages'));
  const staysRouter = require(path.join(backendPath, 'stays'));
  const carsRouter = require(path.join(backendPath, 'cars'));
  const stripeRouter = require(path.join(backendPath, 'stripe'));
  
  app.use('/api/auth', authRouter);
  app.use('/api/experiences', experiencesRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/stays', staysRouter);
  app.use('/api/cars', carsRouter);
  app.use('/api/stripe', stripeRouter);
  
  // Store route map for manual matching if needed (in singleton)
  global.__routeMap = {
    '/api/auth': authRouter,
    '/api/experiences': experiencesRouter,
    '/api/categories': categoriesRouter,
    '/api/bookings': bookingsRouter,
    '/api/wishlist': wishlistRouter,
    '/api/reviews': reviewsRouter,
    '/api/messages': messagesRouter,
    '/api/stays': staysRouter,
    '/api/cars': carsRouter,
    '/api/stripe': stripeRouter
  };

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

  // Reconstruct full path from Next.js catch-all route
  // For /api/categories, req.query.route = ['categories']
  // For /api/auth/register, req.query.route = ['auth', 'register']
  const routeSegments = req.query.route;
  
  // Handle both array and single value
  let segments = [];
  if (Array.isArray(routeSegments)) {
    segments = routeSegments.filter(Boolean); // Remove any empty values
  } else if (routeSegments) {
    segments = [routeSegments];
  }
  
  // Validate we have route segments
  if (segments.length === 0) {
    console.error('[API Handler] No route segments found', { 
      query: req.query, 
      url: req.url,
      path: req.url 
    });
    return res.status(404).json({ 
      error: 'Invalid API route',
      path: req.url,
      query: req.query
    });
  }
  
  // Reconstruct full path
  const fullPath = '/api/' + segments.join('/');
  
  // Clean query params - remove the route parameter
  const cleanQuery = { ...req.query };
  delete cleanQuery.route;
  const queryString = Object.keys(cleanQuery).length > 0 
    ? '?' + new URLSearchParams(cleanQuery).toString() 
    : '';

  console.log(`[API Handler] ${req.method} ${fullPath}`, { 
    routeSegments: segments,
    query: cleanQuery,
    body: req.method === 'POST' || req.method === 'PUT' ? (req.body ? Object.keys(req.body) : 'missing') : undefined,
    originalUrl: req.url,
    originalQuery: req.query
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
    // IMPORTANT: Set body BEFORE creating the object so Express can access it
    const requestBody = req.body || {};
    
    // Create a minimal socket-like object for Express compatibility
    const socketObj = {
      remoteAddress: req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '127.0.0.1',
      remotePort: 0,
      encrypted: true
    };
    
    const expressReq = {
      method: req.method,
      url: fullPath + queryString,
      path: fullPath,
      originalUrl: fullPath + queryString,
      baseUrl: '',
      query: cleanQuery,
      headers: { 
        ...req.headers,
        'content-type': req.headers['content-type'] || (req.method === 'POST' || req.method === 'PUT' ? 'application/json' : ''),
        'content-length': req.headers['content-length'] || (requestBody ? JSON.stringify(requestBody).length : 0).toString()
      },
      params: {},
      body: requestBody, // Set body explicitly
      ip: socketObj.remoteAddress,
      protocol: 'https',
      hostname: req.headers.host?.split(':')[0] || 'localhost',
      socket: socketObj,
      connection: socketObj,
      httpVersion: '1.1',
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      readable: true,
      readableEncoding: null,
      readableEnded: false,
      readableFlowing: null,
      readableHighWaterMark: 16384,
      readableLength: 0,
      readableObjectMode: false,
      get: function(name) {
        const lowerName = name?.toLowerCase();
        return this.headers[lowerName] || this.headers[name] || null;
      },
      is: function(type) {
        const ct = (this.headers['content-type'] || '').toLowerCase();
        if (type === 'application/json' || type.includes('json')) {
          return ct.includes('application/json');
        }
        return ct.includes(type.toLowerCase());
      },
      accepts: function() { return true; },
      acceptsCharsets: function() { return true; },
      acceptsEncodings: function() { return true; },
      acceptsLanguages: function() { return true; }
    };
    
    // Ensure body is properly set (Express might check this)
    Object.defineProperty(expressReq, 'body', {
      value: requestBody,
      writable: true,
      enumerable: true,
      configurable: true
    });
    
    // Extract path params for dynamic routes (e.g., /api/experiences/:slug)
    // Note: pathParts is already defined above, so this will be used in the routing logic
    
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

    // Call Express - manually route to the correct router with adjusted path
    try {
      // Extract pathParts for routing logic
      const pathParts = fullPath.split('/').filter(Boolean);
      
      console.log(`[Express Call] ${expressReq.method} ${expressReq.path}`, {
        url: expressReq.url,
        bodyKeys: expressReq.body ? Object.keys(expressReq.body) : 'none',
        query: expressReq.query,
        pathParts: pathParts,
        segments: segments
      });
      
      // Find matching router by mount path (e.g., /api/auth, /api/experiences)
      const mountPath = '/' + pathParts.slice(0, 2).join('/'); // e.g., '/api/auth'
      const router = global.__routeMap?.[mountPath];
      
      if (router && pathParts.length >= 2) {
        // Adjust path to remove mount point (Express strips this internally)
        // For /api/auth/register, router should see /register
        const routerPath = '/' + pathParts.slice(2).join('/') || '/';
        
        // Update request object for router (Express internally strips mount point)
        expressReq.path = routerPath;
        expressReq.url = routerPath + queryString;
        expressReq.originalUrl = routerPath + queryString;
        expressReq.baseUrl = mountPath; // Set baseUrl so router knows its mount point
        
        // Extract params for dynamic routes
        if (pathParts.length >= 4) {
          expressReq.params.slug = pathParts[3];
          expressReq.params.id = pathParts[3];
        }
        if (pathParts.length >= 5) {
          expressReq.params.id = pathParts[4];
          expressReq.params.experienceId = pathParts[4];
        }
        
        console.log(`[Router Call] Mount: ${mountPath}, Router path: ${routerPath}, Method: ${expressReq.method}`);
        console.log(`[Router Call] Request body:`, expressReq.body ? Object.keys(expressReq.body) : 'none');
        
        // Try to manually match route in router stack
        // Express routers store routes in router.stack array
        let routeMatched = false;
        
        if (router.stack && Array.isArray(router.stack)) {
          // Walk through router stack to find matching route
          for (const layer of router.stack) {
            if (layer.route) {
              // Check if method and path match
              const route = layer.route;
              const methods = route.methods || {};
              const routePath = route.path;
              
              // Match path (handle both exact and parameterized routes)
              let pathMatch = false;
              if (routePath === routerPath) {
                pathMatch = true;
              } else if (routePath.includes(':')) {
                // Parameterized route - basic matching
                const routeRegex = new RegExp('^' + routePath.replace(/:[^/]+/g, '[^/]+') + '$');
                pathMatch = routeRegex.test(routerPath);
                
                // Extract params if matched
                if (pathMatch) {
                  const routeParts = routePath.split('/');
                  const pathParts2 = routerPath.split('/');
                  routeParts.forEach((part, idx) => {
                    if (part.startsWith(':')) {
                      const paramName = part.substring(1);
                      expressReq.params[paramName] = pathParts2[idx];
                    }
                  });
                }
              }
              
              // Check if method matches
              const methodMatch = methods[expressReq.method.toLowerCase()] || methods[expressReq.method.toUpperCase()];
              
              if (pathMatch && methodMatch) {
                console.log(`[Manual Route Match] Found route: ${expressReq.method} ${routePath}`);
                routeMatched = true;
                // Call the route handler directly
                layer.handle_request(expressReq, expressRes, next);
                break;
              }
            }
          }
        }
        
        // If no manual match, try calling router normally
        if (!routeMatched) {
          console.log(`[Router Call] No manual match, calling router as middleware`);
          try {
            router(expressReq, expressRes, next);
          } catch (routerError) {
            console.error(`[Router Error] Error calling router:`, routerError);
            next(routerError);
          }
        }
      } else {
        // Fallback: try full app.handle() or call app directly
        console.log(`[App Handle] No specific router found for ${mountPath}, using full app`);
        console.log(`[App Handle] Available routes:`, Object.keys(global.__routeMap || {}));
        
        if (typeof app.handle === 'function') {
          app.handle(expressReq, expressRes, next);
        } else {
          // Call app as middleware function
          app(expressReq, expressRes, next);
        }
      }
      
      // Add timeout fallback in case Express doesn't call next or respond
      setTimeout(() => {
        if (!responseEnded && !res.headersSent) {
          console.error(`[Express Timeout] No response after 5s for ${req.method} ${fullPath}`);
          console.error(`[Express Timeout] Mount path: ${mountPath}, Router: ${router ? 'found' : 'not found'}`);
          console.error(`[Express Timeout] Available routes:`, Object.keys(global.__routeMap || {}));
          responseEnded = true;
          res.status(504).json({ 
            error: 'Request timeout - route may not be registered',
            path: fullPath,
            method: req.method,
            mountPath: mountPath,
            routerPath: pathParts.slice(2).join('/'),
            availableRoutes: Object.keys(global.__routeMap || {})
          });
          resolve();
        }
      }, 5000);
    } catch (error) {
      console.error('[Handler Error]:', error);
      console.error('[Handler Error] Stack:', error.stack);
      if (!responseEnded && !res.headersSent) {
        res.status(500).json({ 
          error: error.message || 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
      }
      resolve();
    }
  });
};
